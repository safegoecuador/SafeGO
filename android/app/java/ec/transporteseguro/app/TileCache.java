package ec.transporteseguro.app;

import android.content.Context;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.Comparator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Caché en disco de mosaicos de OpenStreetMap. Descarga con un User-Agent propio
 * (requisito de la política de uso de OSM) y permite ver el mapa ya visitado sin conexión.
 */
final class TileCache {
    static final String UA = "SafeGo/2.0 (Android; app estudiantil de movilidad segura, Quito)";
    private static final Pattern TILE = Pattern.compile("^https://tile\\.openstreetmap\\.org/(\\d+)/(\\d+)/(\\d+)\\.png$");
    private static final long MAX_AGE_MS = 30L * 24 * 3600 * 1000;
    private static final long MAX_BYTES = 150L * 1024 * 1024;
    private static long lastTrim = 0;

    private TileCache() {}

    static boolean isTile(String url) { return url != null && TILE.matcher(url).matches(); }

    /** Devuelve los bytes del mosaico o null si no hay red ni copia guardada. */
    static byte[] get(Context c, String url) {
        Matcher m = TILE.matcher(url);
        if (!m.matches()) return null;
        File dir = new File(c.getCacheDir(), "tiles");
        if (!dir.exists() && !dir.mkdirs()) return download(url);
        File f = new File(dir, m.group(1) + "_" + m.group(2) + "_" + m.group(3) + ".png");
        boolean fresh = f.exists() && System.currentTimeMillis() - f.lastModified() < MAX_AGE_MS;
        if (fresh) {
            byte[] b = read(f);
            if (b != null) return b;
        }
        byte[] data = Util.isOnline(c) ? download(url) : null;
        if (data != null) {
            write(f, data);
            maybeTrim(dir);
            return data;
        }
        return f.exists() ? read(f) : null; // copia vieja mejor que nada
    }

    private static byte[] download(String url) {
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) new URL(url).openConnection();
            con.setConnectTimeout(8000);
            con.setReadTimeout(12000);
            con.setRequestProperty("User-Agent", UA);
            if (con.getResponseCode() != 200) return null;
            InputStream in = con.getInputStream();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            in.close();
            return out.toByteArray();
        } catch (Exception e) {
            return null;
        } finally {
            if (con != null) con.disconnect();
        }
    }

    private static byte[] read(File f) {
        try (FileInputStream in = new FileInputStream(f)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream((int) f.length());
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }

    private static void write(File f, byte[] data) {
        File tmp = new File(f.getPath() + ".tmp" + Thread.currentThread().getId());
        try (FileOutputStream out = new FileOutputStream(tmp)) {
            out.write(data);
        } catch (Exception e) {
            tmp.delete();
            return;
        }
        if (!tmp.renameTo(f)) tmp.delete();
    }

    private static synchronized void maybeTrim(File dir) {
        long now = System.currentTimeMillis();
        if (now - lastTrim < 10 * 60 * 1000) return;
        lastTrim = now;
        try {
            File[] files = dir.listFiles();
            if (files == null) return;
            long total = 0;
            for (File f : files) total += f.length();
            if (total <= MAX_BYTES) return;
            Arrays.sort(files, new Comparator<File>() {
                @Override
                public int compare(File a, File b) { return Long.compare(a.lastModified(), b.lastModified()); }
            });
            for (File f : files) {
                if (total <= MAX_BYTES * 0.8) break;
                total -= f.length();
                f.delete();
            }
        } catch (Exception e) {
            Log.w(Util.TAG, "trim", e);
        }
    }
}
