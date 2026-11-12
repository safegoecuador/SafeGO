package ec.transporteseguro.app;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Servicio en primer plano que sigue el viaje con GPS aunque la app esté cerrada:
 * avisa antes de cada bajada, detecta la llegada (y envía el SMS automático),
 * y alerta si hay retraso.
 */
public class TripService extends Service implements LocationListener {
    static final String ACTION_START = "ec.transporteseguro.START";
    static final String ACTION_ARRIVE = "ec.transporteseguro.ARRIVE";
    static final String ACTION_CANCEL = "ec.transporteseguro.CANCEL";
    static final String ACTION_SOS = "ec.transporteseguro.SOS";
    static final String ACTION_UPDATE = "ec.transporteseguro.UPDATE";

    private static final int NOTIF_ONGOING = 7001;
    private static final int NOTIF_ALERT = 7002;
    private static final int NOTIF_ARRIVED = 7003;
    private static final int NOTIF_LATE = 7004;
    private static final int NOTIF_SOS = 7005;
    private static final long TICK_MS = 30000;
    private static final long MAX_EXTRA_MS = 3L * 3600 * 1000; // corte de seguridad para no gastar batería

    private static volatile boolean alive = false;
    private static final long METRO_GAP_MS = 120000; // sin GPS por 2 min cerca de una estación = va bajo tierra
    private long lastFixAt = 0;
    private boolean underground = false;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private LocationManager lm;
    private JSONObject trip;
    private Location best;
    private int insideCount = 0;
    private boolean finishing = false;
    private long lastLiveAt = 0;
    private double lastLiveLat = 0, lastLiveLon = 0;
    private static final long LIVE_MIN_MS = 15000;   // como máximo un punto cada 15 s
    private static final long LIVE_MAX_MS = 60000;   // y al menos uno por minuto aunque esté quieto

    static boolean isAlive() { return alive; }

    private final Runnable ticker = new Runnable() {
        @Override
        public void run() {
            try {
                checkLate();
                checkTimeout();
                checkMetro();
                if (!finishing && System.currentTimeMillis() - lastLiveAt > LIVE_MAX_MS) publishLive("viaje", true);
                updateOngoing();
            } catch (Exception e) {
                Log.w(Util.TAG, "tick", e);
            }
            if (alive && !finishing) handler.postDelayed(this, TICK_MS);
        }
    };

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onCreate() {
        super.onCreate();
        alive = true;
        Util.ensureChannels(this);
        lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;
        if (action == null) action = ACTION_START; // reinicio del sistema (START_STICKY)

        if (ACTION_CANCEL.equals(action)) {
            finishTrip(false);
            return START_NOT_STICKY;
        }
        if (ACTION_ARRIVE.equals(action)) {
            if (trip == null) trip = TripStore.payloadJson(this);
            if (trip != null && TripStore.running(this)) arrived(true);
            else stopSelfSafely();
            return START_NOT_STICKY;
        }
        if (ACTION_SOS.equals(action)) {
            if (trip == null) trip = TripStore.payloadJson(this);
            sendSos();
            if (trip == null || !TripStore.running(this)) stopSelfSafely();
            return START_STICKY;
        }
        if (ACTION_UPDATE.equals(action)) {
            trip = TripStore.payloadJson(this);
            updateOngoing();
            return START_STICKY;
        }

        // ACTION_START: primero pasamos a primer plano (Android lo exige tras startForegroundService)
        trip = TripStore.payloadJson(this);
        if (!goForeground()) {
            stopSelfSafely();
            return START_NOT_STICKY;
        }
        if (trip == null || !TripStore.running(this)) {
            shutdown();
            return START_NOT_STICKY;
        }
        finishing = false;
        insideCount = 0;
        lastFixAt = System.currentTimeMillis();
        underground = false;
        startLocation();
        handler.removeCallbacks(ticker);
        handler.postDelayed(ticker, TICK_MS);
        return START_STICKY;
    }

    private boolean goForeground() {
        try {
            Notification n = buildOngoing(null);
            if (Build.VERSION.SDK_INT >= 29) {
                startForeground(NOTIF_ONGOING, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
            } else {
                startForeground(NOTIF_ONGOING, n);
            }
            return true;
        } catch (Exception e) {
            Log.e(Util.TAG, "No se pudo iniciar el servicio en primer plano", e);
            return false;
        }
    }

    @SuppressLint("MissingPermission")
    private void startLocation() {
        if (lm == null || !Util.hasLocation(this)) {
            Log.w(Util.TAG, "Sin permiso de ubicación");
            return;
        }
        try {
            lm.removeUpdates(this);
        } catch (Exception ignored) {
        }
        try {
            if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 4000, 8, this, Looper.getMainLooper());
            }
        } catch (Exception e) {
            Log.w(Util.TAG, "GPS", e);
        }
        try {
            if (lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 10000, 20, this, Looper.getMainLooper());
            }
        } catch (Exception e) {
            Log.w(Util.TAG, "Red", e);
        }
        try {
            Location last = null;
            for (String p : lm.getProviders(true)) {
                Location l = lm.getLastKnownLocation(p);
                if (l != null && (last == null || l.getTime() > last.getTime())) last = l;
            }
            if (last != null && System.currentTimeMillis() - last.getTime() < 120000) onLocationChanged(last);
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onLocationChanged(Location loc) {
        if (trip == null || finishing || loc == null) return;
        long now = System.currentTimeMillis();
        // Preferimos lecturas precisas; una lectura de red no reemplaza a un GPS reciente y mejor
        if (best != null && loc.getAccuracy() > best.getAccuracy() * 2 && now - best.getTime() < 20000
                && LocationManager.NETWORK_PROVIDER.equals(loc.getProvider())) {
            return;
        }
        best = loc;
        double lat = loc.getLatitude(), lon = loc.getLongitude();
        float acc = loc.hasAccuracy() ? loc.getAccuracy() : 50f;
        if (acc <= 150) lastFixAt = now;
        if (underground && acc <= 150) {
            // Volvió la señal al salir del Metro: seguimos con normalidad
            underground = false;
            emitMetro(false, now);
        }
        TripStore.setLast(this, lat, lon, acc, now);
        try {
            JSONObject ev = new JSONObject();
            ev.put("type", "loc");
            ev.put("lat", lat);
            ev.put("lon", lon);
            ev.put("acc", acc);
            ev.put("t", now);
            MainActivity.emitTrip(this, ev, false);
        } catch (Exception ignored) {
        }
        if (now - lastLiveAt >= LIVE_MAX_MS
                || (now - lastLiveAt >= LIVE_MIN_MS && Util.distM(lat, lon, lastLiveLat, lastLiveLon) > 25)) {
            publishLive("viaje", false);
        }
        if (acc > 400) return; // demasiado impreciso para decidir algo

        checkAlerts(lat, lon, acc);
        checkArrival(lat, lon, acc);
        updateOngoing();
    }

    private void checkAlerts(double lat, double lon, float acc) {
        JSONArray alerts = trip.optJSONArray("alerts");
        if (alerts == null) return;
        for (int i = 0; i < alerts.length(); i++) {
            if (TripStore.fired(this, i)) continue;
            JSONObject a = alerts.optJSONObject(i);
            if (a == null) continue;
            double d = Util.distM(lat, lon, a.optDouble("lat"), a.optDouble("lon"));
            double radius = a.optDouble("radius", 400);
            if (d <= radius + Math.min(acc, 100) * 0.5) {
                TripStore.setFired(this, i);
                // Marca también los avisos anteriores para no repetirlos fuera de orden
                for (int j = 0; j < i; j++) TripStore.setFired(this, j);
                String msg = a.optString("msg", getString(R.string.n_get_ready));
                String kind = a.optString("kind");
                boolean discreet = trip.optBoolean("discreet", false);
                String notice = a.has("notice") && !a.isNull("notice") ? fill(a.optString("notice"), System.currentTimeMillis()) : null;
                int sent = 0;
                Notification.Action[] actions = null;
                String title = "bajar".equals(kind) ? getString(R.string.n_get_ready) : getString(R.string.app_name);
                if (notice != null && notice.length() > 0) {
                    // Aviso a la familia al subir o hacer transbordo
                    if (trip.optBoolean("noticeSms", false)) sent = Util.sendSms(this, phones(), notice);
                    if (sent == 0) {
                        actions = new Notification.Action[]{new Notification.Action.Builder(null, getString(R.string.a_whatsapp),
                                PendingIntent.getActivity(this, 50 + i, Util.whatsappIntent(firstPhone(), notice), Util.pendingFlags())).build()};
                        msg = getString(R.string.n_board_tap_whatsapp, msg);
                    } else {
                        msg = getString(R.string.n_board_sent, msg);
                    }
                }
                Util.vibrate(this, new long[]{400, 200, 400, 200, 400});
                Util.notifyAlert(this, NOTIF_ALERT + ("subir".equals(kind) ? 10 : 0), title, msg, discreet, actions);
                try {
                    JSONObject ev = new JSONObject();
                    ev.put("type", "alert");
                    ev.put("idx", i);
                    ev.put("msg", a.optString("msg"));
                    ev.put("kind", kind);
                    if (notice != null) ev.put("notice", notice);
                    ev.put("sms", sent);
                    MainActivity.emitTrip(this, ev, true);
                } catch (Exception ignored) {
                }
            }
        }
    }

    private void checkArrival(double lat, double lon, float acc) {
        double d = Util.distM(lat, lon, trip.optDouble("destLat"), trip.optDouble("destLon"));
        double radius = trip.optDouble("arrivalRadius", 150);
        boolean inside = d <= radius + Math.min(acc * 0.5, 75);
        if (inside) insideCount++;
        else insideCount = 0;
        // Con buena precisión basta una lectura; si no, pedimos dos seguidas para evitar falsos avisos
        if ((inside && acc <= 35) || insideCount >= 2) arrived(false);
    }

    private List<String> phones() {
        List<String> out = new ArrayList<>();
        JSONArray cs = trip != null ? trip.optJSONArray("contacts") : null;
        if (cs == null) return out;
        for (int i = 0; i < cs.length(); i++) {
            JSONObject c = cs.optJSONObject(i);
            if (c != null && c.optString("phone").length() > 0) out.add(c.optString("phone"));
        }
        return out;
    }

    private String firstPhone() {
        List<String> p = phones();
        return p.size() == 1 ? p.get(0) : "";
    }

    private String text(String key) {
        JSONObject t = trip != null ? trip.optJSONObject("texts") : null;
        return t != null ? t.optString(key, "") : "";
    }

    private String fill(String s, long now) {
        double[] l = TripStore.last(this);
        String link = l != null ? Util.osmLink(l[0], l[1]) : getString(R.string.no_location);
        String prec = l != null ? String.valueOf(Math.round(l[2])) : "?";
        return s.replace("{hora}", Util.hhmm(now)).replace("{link}", link).replace("{precision}", prec);
    }

    private void arrived(boolean manual) {
        if (finishing) return;
        finishing = true;
        long now = System.currentTimeMillis();
        int sent = 0;
        String msg = fill(text("arrival"), now);
        if (trip.optBoolean("autoSmsArrival", false)) {
            sent = Util.sendSms(this, phones(), msg);
        }
        TripStore.markArrived(this, now, sent);
        publishLive(manual ? "llego_manual" : "llego", true);
        String dest = trip.optString("destName", "tu destino");
        String body = sent > 0 ? getString(R.string.n_arrived_sms) : getString(R.string.n_arrived_tap);
        Notification.Action wa = new Notification.Action.Builder(null, getString(R.string.a_whatsapp),
                PendingIntent.getActivity(this, 31, Util.whatsappIntent(firstPhone(), msg), Util.pendingFlags())).build();
        Util.vibrate(this, new long[]{200, 100, 200});
        Util.notifyAlert(this, NOTIF_ARRIVED, getString(R.string.n_arrived_title, dest), body, trip.optBoolean("discreet", false), new Notification.Action[]{wa});
        try {
            JSONObject ev = new JSONObject();
            ev.put("type", "arrived");
            ev.put("t", now);
            ev.put("sms", sent);
            ev.put("manual", manual);
            ev.put("auto", !manual);
            MainActivity.emitTrip(this, ev, true);
        } catch (Exception ignored) {
        }
        cancelNotif(NOTIF_LATE);
        shutdown();
    }

    private void checkLate() {
        if (trip == null || finishing || TripStore.flag(this, "lateNotified")) return;
        long lateAt = trip.optLong("lateAt", 0);
        if (lateAt <= 0 || System.currentTimeMillis() < lateAt) return;
        TripStore.setFlag(this, "lateNotified", true);
        publishLive("tarde", true);
        long now = System.currentTimeMillis();
        int sent = 0;
        if (trip.optBoolean("smsOnLate", false)) {
            sent = Util.sendSms(this, phones(), fill(text("late"), now));
        }
        String body = sent > 0 ? getString(R.string.n_late_sms)
                : getString(R.string.n_late_ask);
        Util.vibrate(this, new long[]{600, 200, 600});
        Util.notifyAlert(this, NOTIF_LATE, getString(R.string.n_late_title), body, trip.optBoolean("discreet", false), null);
        try {
            JSONObject ev = new JSONObject();
            ev.put("type", "late");
            ev.put("t", now);
            ev.put("sms", sent);
            MainActivity.emitTrip(this, ev, true);
            if (sent > 0) {
                JSONObject ev2 = new JSONObject();
                ev2.put("type", "sms");
                ev2.put("sent", sent);
                MainActivity.emitTrip(this, ev2, true);
            }
        } catch (Exception ignored) {
        }
    }

    /**
     * El Metro de Quito va bajo tierra y ahí no hay GPS. Si perdemos la señal cerca de una estación
     * del Metro del viaje, lo marcamos «en el Metro», mantenemos la hora estimada y retomamos al salir.
     */
    private void checkMetro() {
        if (trip == null || finishing || underground) return;
        JSONArray m = trip.optJSONArray("metro");
        if (m == null || m.length() == 0) return;
        long now = System.currentTimeMillis();
        if (now - lastFixAt < METRO_GAP_MS) return;
        double[] l = TripStore.last(this);
        if (l == null) return;
        boolean near = false;
        for (int i = 0; i < m.length() && !near; i++) {
            JSONArray p = m.optJSONArray(i);
            if (p != null && Util.distM(l[0], l[1], p.optDouble(0), p.optDouble(1)) < 600) near = true;
        }
        if (!near) return;
        underground = true;
        emitMetro(true, now);
    }

    private void emitMetro(boolean on, long now) {
        if (on) publishLive("metro", true);
        else publishLive("viaje", true);
        updateOngoing();
        try {
            JSONObject ev = new JSONObject();
            ev.put("type", "metro");
            ev.put("on", on);
            ev.put("t", now);
            MainActivity.emitTrip(this, ev, true);
        } catch (Exception ignored) {
        }
    }

    private void checkTimeout() {
        if (trip == null || finishing) return;
        long expected = trip.optLong("expectedAt", 0);
        if (expected > 0 && System.currentTimeMillis() > expected + MAX_EXTRA_MS) {
            Util.notifyAlert(this, NOTIF_LATE, getString(R.string.n_timeout_title),
                    getString(R.string.n_timeout_body), true, null);
            finishTrip(true);
        }
    }

    private void sendSos() {
        long now = System.currentTimeMillis();
        String tpl = text("sos");
        if (tpl.length() == 0) tpl = getString(R.string.sos_default);
        int sent = Util.sendSms(this, phones(), fill(tpl, now));
        publishLive("sos", true);
        Intent dial = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:911"));
        dial.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Notification.Action call = new Notification.Action.Builder(null, getString(R.string.a_call_911),
                PendingIntent.getActivity(this, 41, dial, Util.pendingFlags())).build();
        Util.notifyAlert(this, NOTIF_SOS, sent > 0 ? getString(R.string.n_sos_sent) : getString(R.string.n_sos_failed),
                sent > 0 ? getString(R.string.n_sos_sent_body) : getString(R.string.n_sos_failed_body), false, new Notification.Action[]{call});
        try {
            JSONObject ev = new JSONObject();
            ev.put("type", "sms");
            ev.put("sent", sent);
            MainActivity.emitTrip(this, ev, true);
        } catch (Exception ignored) {
        }
    }

    private void finishTrip(boolean auto) {
        if (finishing && !auto) {
            shutdown();
            return;
        }
        finishing = true;
        long now = System.currentTimeMillis();
        TripStore.markStopped(this, now);
        publishLive("fin", true);
        try {
            JSONObject ev = new JSONObject();
            ev.put("type", "stopped");
            ev.put("t", now);
            MainActivity.emitTrip(this, ev, true);
        } catch (Exception ignored) {
        }
        shutdown();
    }

    /** Envía la posición actual (cifrada) al canal en vivo de la familia, si está activo. */
    private void publishLive(String state, boolean force) {
        try {
            double[] l = TripStore.last(this);
            if (l == null) return;
            long now = System.currentTimeMillis();
            if (!force && now - lastLiveAt < LIVE_MIN_MS) return;
            JSONObject p = new JSONObject();
            p.put("v", 1);
            p.put("t", l.length > 3 ? (long) l[3] : now);
            p.put("lat", Math.round(l[0] * 1e6) / 1e6);
            p.put("lon", Math.round(l[1] * 1e6) / 1e6);
            p.put("acc", Math.round(l[2]));
            if (best != null && best.hasSpeed()) p.put("spd", Math.round(best.getSpeed() * 3.6));
            p.put("st", state);
            p.put("sent", now);
            if (trip != null) {
                p.put("dest", trip.optString("destName", ""));
                if (trip.has("destLat")) { p.put("dlat", trip.optDouble("destLat")); p.put("dlon", trip.optDouble("destLon")); }
                p.put("eta", trip.optLong("expectedAt", 0));
                p.put("leg", trip.optString("legNow", ""));
            }
            lastLiveAt = now;
            lastLiveLat = l[0];
            lastLiveLon = l[1];
            LiveShare.publish(this, p);
        } catch (Exception e) {
            Log.w(Util.TAG, "en vivo", e);
        }
    }

    private void shutdown() {
        handler.removeCallbacks(ticker);
        try {
            if (lm != null) lm.removeUpdates(this);
        } catch (Exception ignored) {
        }
        try {
            stopForeground(STOP_FOREGROUND_REMOVE);
        } catch (Exception ignored) {
        }
        stopSelfSafely();
    }

    private void stopSelfSafely() {
        try {
            stopSelf();
        } catch (Exception ignored) {
        }
    }

    private void cancelNotif(int id) {
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(id);
    }

    private PendingIntent serviceAction(String action, int req) {
        Intent i = new Intent(this, TripService.class);
        i.setAction(action);
        return PendingIntent.getService(this, req, i, Util.pendingFlags());
    }

    private Notification buildOngoing(String extra) {
        String dest = trip != null ? trip.optString("destName", "tu destino") : "tu destino";
        long expected = trip != null ? trip.optLong("expectedAt", 0) : 0;
        String title = getString(R.string.n_trip_title, dest);
        String text = (expected > 0 ? getString(R.string.n_trip_eta, Util.hhmm(expected)) : getString(R.string.n_trip_on_way)) + (extra != null ? " · " + extra : "");
        Notification.Builder b = new Notification.Builder(this, Util.CH_TRIP)
                .setSmallIcon(R.drawable.ic_notif)
                .setColor(0xFFB3303F)
                .setContentTitle(title)
                .setContentText(text)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setCategory(Notification.CATEGORY_NAVIGATION)
                .setContentIntent(Util.openAppIntent(this, 1))
                .addAction(new Notification.Action.Builder(null, getString(R.string.a_arrived), serviceAction(ACTION_ARRIVE, 2)).build())
                .addAction(new Notification.Action.Builder(null, getString(R.string.a_sos), serviceAction(ACTION_SOS, 3)).build())
                .addAction(new Notification.Action.Builder(null, getString(R.string.a_stop), serviceAction(ACTION_CANCEL, 4)).build());
        if (Build.VERSION.SDK_INT >= 31) b.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
        return b.build();
    }

    private void updateOngoing() {
        if (trip == null || finishing) return;
        String extra = null;
        double[] l = TripStore.last(this);
        if (l != null) {
            double d = Util.distM(l[0], l[1], trip.optDouble("destLat"), trip.optDouble("destLon"));
            extra = d >= 1000 ? getString(R.string.n_remaining, String.format(Locale.US, "%.1f km", d / 1000.0)) : getString(R.string.n_remaining, Math.round(d) + " m");
        }
        if (underground) extra = getString(R.string.n_metro);
        if (System.currentTimeMillis() > trip.optLong("lateAt", Long.MAX_VALUE)) extra = (extra == null ? "" : extra + " · ") + getString(R.string.n_late_short);
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.notify(NOTIF_ONGOING, buildOngoing(extra));
        } catch (Exception ignored) {
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {}

    @Override
    public void onProviderEnabled(String provider) {
        if (!finishing) startLocation();
    }

    @Override
    public void onProviderDisabled(String provider) {}

    @Override
    public void onDestroy() {
        alive = false;
        handler.removeCallbacks(ticker);
        try {
            if (lm != null) lm.removeUpdates(this);
        } catch (Exception ignored) {
        }
        super.onDestroy();
    }
}
