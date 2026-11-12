package ec.transporteseguro.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Ubicación en vivo para la familia.
 *
 * El teléfono del estudiante publica su posición cifrada (AES-GCM, 256 bits) en un canal de
 * ntfy.sh, un servicio libre y de código abierto que solo reenvía mensajes. La clave viaja
 * únicamente dentro del código de configuración que comparte la familia, así que ntfy.sh
 * (o cualquiera que adivine el canal) solo ve texto cifrado. ntfy.sh guarda los mensajes
 * unas horas y luego los borra.
 */
final class LiveShare {
    static final String HOST = "ntfy.sh";
    private static final String PREFS = "ts_live";
    private static final SecureRandom RNG = new SecureRandom();
    private static final ExecutorService IO = Executors.newSingleThreadExecutor();

    private LiveShare() {}

    /** Canal nuevo: {topic, key}. */
    static JSONObject newChannel() throws Exception {
        byte[] t = new byte[16];
        byte[] k = new byte[32];
        RNG.nextBytes(t);
        RNG.nextBytes(k);
        StringBuilder sb = new StringBuilder("ts-");
        for (byte b : t) sb.append(String.format("%02x", b));
        JSONObject o = new JSONObject();
        o.put("topic", sb.toString());
        o.put("key", Base64.encodeToString(k, Base64.NO_WRAP | Base64.URL_SAFE | Base64.NO_PADDING));
        return o;
    }

    static boolean validTopic(String t) {
        return t != null && t.matches("[A-Za-z0-9_-]{8,64}");
    }

    private static byte[] key(String keyB64) {
        byte[] k = Base64.decode(keyB64, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
        if (k.length != 32) throw new IllegalArgumentException("clave");
        return k;
    }

    static String encrypt(String keyB64, String plain) throws Exception {
        byte[] iv = new byte[12];
        RNG.nextBytes(iv);
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key(keyB64), "AES"), new GCMParameterSpec(128, iv));
        byte[] ct = c.doFinal(plain.getBytes("UTF-8"));
        byte[] out = new byte[iv.length + ct.length];
        System.arraycopy(iv, 0, out, 0, iv.length);
        System.arraycopy(ct, 0, out, iv.length, ct.length);
        return "TS1." + Base64.encodeToString(out, Base64.NO_WRAP);
    }

    static String decrypt(String keyB64, String msg) throws Exception {
        if (msg == null || !msg.startsWith("TS1.")) throw new IllegalArgumentException("formato");
        byte[] all = Base64.decode(msg.substring(4), Base64.NO_WRAP);
        if (all.length < 29) throw new IllegalArgumentException("corto");
        Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
        c.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key(keyB64), "AES"), new GCMParameterSpec(128, all, 0, 12));
        return new String(c.doFinal(all, 12, all.length - 12), "UTF-8");
    }

    /* ---------- Configuración del estudiante (la lee también el servicio en segundo plano) ---------- */

    static void saveConfig(Context c, String topic, String key, boolean enabled) {
        c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putString("topic", topic).putString("key", key).putBoolean("on", enabled).apply();
    }

    /** {topic, key} si compartir en vivo está activo; si no, null. */
    static String[] config(Context c) {
        SharedPreferences p = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String t = p.getString("topic", null), k = p.getString("key", null);
        if (!p.getBoolean("on", false) || !validTopic(t) || k == null) return null;
        return new String[]{t, k};
    }

    /** Publica sin bloquear. Si no hay red, el punto se pierde: el siguiente lo reemplaza. */
    static void publish(Context c, final JSONObject point) {
        final String[] cfg = config(c);
        if (cfg == null || point == null) return;
        IO.execute(new Runnable() {
            @Override
            public void run() {
                HttpURLConnection con = null;
                try {
                    byte[] body = encrypt(cfg[1], point.toString()).getBytes("UTF-8");
                    con = (HttpURLConnection) new URL("https://" + HOST + "/" + cfg[0]).openConnection();
                    con.setConnectTimeout(8000);
                    con.setReadTimeout(10000);
                    con.setDoOutput(true);
                    con.setRequestMethod("POST");
                    con.setRequestProperty("User-Agent", TileCache.UA);
                    con.setRequestProperty("Content-Type", "text/plain");
                    con.setFixedLengthStreamingMode(body.length);
                    OutputStream os = con.getOutputStream();
                    os.write(body);
                    os.close();
                    int code = con.getResponseCode();
                    if (code >= 400) Log.w(Util.TAG, "ntfy respondió " + code);
                } catch (Exception e) {
                    Log.w(Util.TAG, "No se pudo publicar la ubicación en vivo: " + e.getMessage());
                } finally {
                    if (con != null) con.disconnect();
                }
            }
        });
    }

    /**
     * Lee los puntos publicados desde «since» (id de mensaje de ntfy, o p. ej. "3h").
     * Devuelve {points:[...], last:"id"}; los mensajes que no se pueden descifrar se ignoran.
     */
    static JSONObject fetch(String topic, String keyB64, String since) throws Exception {
        if (!validTopic(topic)) throw new IllegalArgumentException("canal");
        if (since == null || !since.matches("[A-Za-z0-9]{1,32}")) since = "3h";
        URL u = new URL("https://" + HOST + "/" + topic + "/json?poll=1&since=" + URLEncoder.encode(since, "UTF-8"));
        HttpURLConnection con = (HttpURLConnection) u.openConnection();
        JSONArray pts = new JSONArray();
        String last = null;
        try {
            con.setConnectTimeout(8000);
            con.setReadTimeout(15000);
            con.setRequestProperty("User-Agent", TileCache.UA);
            int code = con.getResponseCode();
            if (code >= 400) throw new IllegalStateException("http " + code);
            InputStream in = con.getInputStream();
            BufferedReader r = new BufferedReader(new InputStreamReader(in, "UTF-8"));
            String line;
            int n = 0;
            while ((line = r.readLine()) != null && n++ < 2000) {
                try {
                    JSONObject m = new JSONObject(line);
                    if (!"message".equals(m.optString("event"))) continue;
                    last = m.optString("id", last);
                    JSONObject p = new JSONObject(decrypt(keyB64, m.optString("message")));
                    p.put("rt", m.optLong("time", 0) * 1000L);
                    pts.put(p);
                } catch (Exception ignored) {
                    // mensaje ajeno o dañado
                }
            }
            r.close();
        } finally {
            con.disconnect();
        }
        JSONObject out = new JSONObject();
        out.put("points", pts);
        if (last != null) out.put("last", last);
        return out;
    }
}
