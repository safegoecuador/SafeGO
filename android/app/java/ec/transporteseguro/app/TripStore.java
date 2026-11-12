package ec.transporteseguro.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

/** Estado persistente del viaje en curso (sobrevive a cierres de la app). */
final class TripStore {
    private static final String PREFS = "ts_trip";
    private static final int MAX_EVENTS = 60;

    private TripStore() {}

    static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static synchronized void startNew(Context c, String payload) {
        prefs(c).edit()
                .clear()
                .putString("payload", payload)
                .putBoolean("running", true)
                .putLong("startedAt", System.currentTimeMillis())
                .commit();
    }

    static String payload(Context c) { return prefs(c).getString("payload", null); }

    static JSONObject payloadJson(Context c) {
        String p = payload(c);
        if (p == null) return null;
        try { return new JSONObject(p); } catch (Exception e) { return null; }
    }

    static boolean running(Context c) { return prefs(c).getBoolean("running", false); }

    static synchronized void setRunning(Context c, boolean running) {
        prefs(c).edit().putBoolean("running", running).commit();
    }

    static synchronized void markArrived(Context c, long t, int sms) {
        prefs(c).edit().putBoolean("running", false).putLong("arrivedAt", t).putInt("smsSent", sms).commit();
    }

    static synchronized void markStopped(Context c, long t) {
        prefs(c).edit().putBoolean("running", false).putLong("stoppedAt", t).commit();
    }

    static synchronized void setLast(Context c, double lat, double lon, float acc, long t) {
        prefs(c).edit()
                .putString("last", lat + "," + lon + "," + acc + "," + t)
                .apply();
    }

    static double[] last(Context c) {
        String s = prefs(c).getString("last", null);
        if (s == null) return null;
        try {
            String[] p = s.split(",");
            return new double[]{Double.parseDouble(p[0]), Double.parseDouble(p[1]), Double.parseDouble(p[2]), Double.parseDouble(p[3])};
        } catch (Exception e) {
            return null;
        }
    }

    static boolean fired(Context c, int idx) { return prefs(c).getBoolean("fired_" + idx, false); }

    static void setFired(Context c, int idx) { prefs(c).edit().putBoolean("fired_" + idx, true).apply(); }

    static boolean flag(Context c, String k) { return prefs(c).getBoolean(k, false); }

    static void setFlag(Context c, String k, boolean v) { prefs(c).edit().putBoolean(k, v).apply(); }

    static long getLong(Context c, String k, long def) { return prefs(c).getLong(k, def); }

    static void putLong(Context c, String k, long v) { prefs(c).edit().putLong(k, v).apply(); }

    /** Guarda un evento para entregarlo a la interfaz cuando vuelva a abrirse. */
    static synchronized void queueEvent(Context c, JSONObject ev) {
        try {
            JSONArray arr = new JSONArray(prefs(c).getString("events", "[]"));
            arr.put(ev);
            while (arr.length() > MAX_EVENTS) arr.remove(0);
            prefs(c).edit().putString("events", arr.toString()).commit();
        } catch (Exception ignored) {
        }
    }

    /** Estado para la interfaz; vacía la cola de eventos pendientes. */
    static synchronized String statusAndDrain(Context c) {
        SharedPreferences p = prefs(c);
        try {
            JSONObject o = new JSONObject();
            o.put("running", p.getBoolean("running", false));
            o.put("hasTrip", p.getString("payload", null) != null);
            if (p.contains("arrivedAt")) o.put("arrivedAt", p.getLong("arrivedAt", 0));
            if (p.contains("stoppedAt")) o.put("stoppedAt", p.getLong("stoppedAt", 0));
            o.put("smsSent", p.getInt("smsSent", 0));
            double[] l = last(c);
            if (l != null) {
                JSONObject last = new JSONObject();
                last.put("lat", l[0]);
                last.put("lon", l[1]);
                last.put("acc", l[2]);
                last.put("t", (long) l[3]);
                o.put("last", last);
            }
            o.put("events", new JSONArray(p.getString("events", "[]")));
            p.edit().putString("events", "[]").commit();
            return o.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
}
