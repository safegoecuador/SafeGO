package ec.transporteseguro.app;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.telephony.SmsManager;
import android.util.Log;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/** Utilidades compartidas: SMS, notificaciones, vibración, WhatsApp. */
final class Util {
    static final String TAG = "SafeGo";
    static final String CH_TRIP = "viaje";
    static final String CH_ALERT = "avisos";
    static final String CH_QUIET = "avisos_discretos";

    private Util() {}

    static boolean has(Context c, String perm) {
        return c.checkSelfPermission(perm) == PackageManager.PERMISSION_GRANTED;
    }

    static boolean hasLocation(Context c) {
        return has(c, Manifest.permission.ACCESS_FINE_LOCATION) || has(c, Manifest.permission.ACCESS_COARSE_LOCATION);
    }

    static boolean canNotify(Context c) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 33 && !has(c, Manifest.permission.POST_NOTIFICATIONS)) return false;
        return nm != null && nm.areNotificationsEnabled();
    }

    static String hhmm(long t) {
        return new SimpleDateFormat("HH:mm", Locale.US).format(new Date(t));
    }

    static String osmLink(double lat, double lon) {
        return String.format(Locale.US, "https://www.openstreetmap.org/?mlat=%.5f&mlon=%.5f#map=17/%.5f/%.5f", lat, lon, lat, lon);
    }

    static double distM(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371000.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    static void ensureChannels(Context c) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel trip = new NotificationChannel(CH_TRIP, c.getString(R.string.ch_trip), NotificationManager.IMPORTANCE_LOW);
        trip.setDescription(c.getString(R.string.ch_trip_desc));
        trip.setShowBadge(false);
        nm.createNotificationChannel(trip);

        NotificationChannel alert = new NotificationChannel(CH_ALERT, c.getString(R.string.ch_alert), NotificationManager.IMPORTANCE_HIGH);
        alert.setDescription(c.getString(R.string.ch_alert_desc));
        alert.enableVibration(true);
        alert.setVibrationPattern(new long[]{0, 400, 200, 400, 200, 400});
        nm.createNotificationChannel(alert);

        NotificationChannel quiet = new NotificationChannel(CH_QUIET, c.getString(R.string.ch_quiet), NotificationManager.IMPORTANCE_HIGH);
        quiet.setDescription(c.getString(R.string.ch_quiet_desc));
        quiet.enableVibration(true);
        quiet.setVibrationPattern(new long[]{0, 400, 200, 400, 200, 400});
        quiet.setSound(null, (AudioAttributes) null);
        nm.createNotificationChannel(quiet);
    }

    static int pendingFlags() {
        return PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
    }

    static PendingIntent openAppIntent(Context c, int req) {
        Intent i = new Intent(c, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(c, req, i, pendingFlags());
    }

    static void notifyAlert(Context c, int id, String title, String text, boolean discreet, Notification.Action[] actions) {
        if (!canNotify(c)) return;
        try {
            ensureChannels(c);
            Notification.Builder b = new Notification.Builder(c, discreet ? CH_QUIET : CH_ALERT)
                    .setSmallIcon(R.drawable.ic_notif)
                    .setColor(0xFFB3303F)
                    .setContentTitle(title)
                    .setContentText(text)
                    .setStyle(new Notification.BigTextStyle().bigText(text))
                    .setCategory(Notification.CATEGORY_NAVIGATION)
                    .setAutoCancel(true)
                    .setContentIntent(openAppIntent(c, 100 + id));
            if (actions != null) for (Notification.Action a : actions) if (a != null) b.addAction(a);
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(id, b.build());
        } catch (Exception e) {
            Log.w(TAG, "notifyAlert", e);
        }
    }

    static void vibrate(Context c, long[] pattern) {
        try {
            Vibrator v;
            if (Build.VERSION.SDK_INT >= 31) {
                VibratorManager vm = (VibratorManager) c.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                v = vm != null ? vm.getDefaultVibrator() : null;
            } else {
                v = (Vibrator) c.getSystemService(Context.VIBRATOR_SERVICE);
            }
            if (v == null || !v.hasVibrator()) return;
            if (pattern.length == 1) v.vibrate(VibrationEffect.createOneShot(pattern[0], VibrationEffect.DEFAULT_AMPLITUDE));
            else {
                long[] p = new long[pattern.length + 1];
                p[0] = 0;
                System.arraycopy(pattern, 0, p, 1, pattern.length);
                v.vibrate(VibrationEffect.createWaveform(p, -1));
            }
        } catch (Exception e) {
            Log.w(TAG, "vibrate", e);
        }
    }

    /** Envía el texto a cada número. Devuelve cuántos mensajes se pusieron en cola. */
    static int sendSms(Context c, List<String> phones, String text) {
        if (!has(c, Manifest.permission.SEND_SMS) || phones == null || phones.isEmpty() || text == null) return 0;
        SmsManager sms;
        try {
            if (Build.VERSION.SDK_INT >= 31) sms = c.getSystemService(SmsManager.class);
            else sms = SmsManager.getDefault();
        } catch (Exception e) {
            Log.w(TAG, "SmsManager", e);
            return 0;
        }
        if (sms == null) return 0;
        int ok = 0;
        for (String raw : phones) {
            String digits = raw == null ? "" : raw.replaceAll("[^0-9]", "");
            if (digits.length() < 7) continue;
            String dest = "+" + digits;
            try {
                ArrayList<String> parts = sms.divideMessage(text);
                if (parts.size() > 1) sms.sendMultipartTextMessage(dest, null, parts, null, null);
                else sms.sendTextMessage(dest, null, text, null, null);
                ok++;
            } catch (Exception e) {
                Log.w(TAG, "SMS a " + dest, e);
            }
        }
        return ok;
    }

    static Intent whatsappIntent(String phone, String text) {
        String digits = phone == null ? "" : phone.replaceAll("[^0-9]", "");
        String url;
        try {
            url = "https://wa.me/" + digits + "?text=" + URLEncoder.encode(text == null ? "" : text, "UTF-8").replace("+", "%20");
        } catch (Exception e) {
            url = "https://wa.me/" + digits;
        }
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        return i;
    }

    /** Abre WhatsApp (o WhatsApp Business, o el navegador) con el mensaje listo. */
    static void openWhatsApp(Context c, String phone, String text) {
        String[] pkgs = {"com.whatsapp", "com.whatsapp.w4b", null};
        for (String pkg : pkgs) {
            Intent i = whatsappIntent(phone, text);
            if (pkg != null) i.setPackage(pkg);
            try {
                c.startActivity(i);
                return;
            } catch (ActivityNotFoundException ignored) {
            } catch (Exception e) {
                Log.w(TAG, "whatsapp", e);
            }
        }
    }

    static boolean isOnline(Context c) {
        try {
            ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return true;
            Network n = cm.getActiveNetwork();
            if (n == null) return false;
            NetworkCapabilities caps = cm.getNetworkCapabilities(n);
            return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception e) {
            return true;
        }
    }
}
