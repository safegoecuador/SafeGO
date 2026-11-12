package ec.transporteseguro.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
    private static final int REQ_PERMS = 41;
    private static final String[] ALLOWED_HOSTS = {"nominatim.openstreetmap.org", "routing.openstreetmap.de", "estebangarciaojeda-ui.github.io", "juanfercaicedo.github.io"};
    private static WeakReference<MainActivity> current = new WeakReference<>(null);

    private WebView web;
    private final Handler ui = new Handler(Looper.getMainLooper());
    private String pendingPermCb = null;
    private boolean resumed = false;
    private volatile boolean visible = false;
    private ConnectivityManager.NetworkCallback netCb;

    /* ------------------------------------------------------------------ */

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        current = new WeakReference<>(this);
        Util.ensureChannels(this);

        web = new WebView(this);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        // La interfaz se carga desde file:///android_asset, que funciona sin acceso general a archivos.
        s.setAllowFileAccess(false);
        s.setAllowFileAccessFromFileURLs(false);
        s.setAllowUniversalAccessFromFileURLs(false);
        s.setAllowContentAccess(false);
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setGeolocationEnabled(false);
        s.setUserAgentString(s.getUserAgentString() + " SafeGo/2.0");

        web.addJavascriptInterface(new Bridge(), "TSNative");
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage m) {
                Log.d(Util.TAG, "JS " + m.messageLevel() + ": " + m.message() + " @" + m.sourceId() + ":" + m.lineNumber());
                return true;
            }
        });
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                String url = req.getUrl().toString();
                if (TileCache.isTile(url)) {
                    byte[] data = TileCache.get(MainActivity.this, url);
                    if (data != null) {
                        WebResourceResponse r = new WebResourceResponse("image/png", null, new ByteArrayInputStream(data));
                        Map<String, String> h = new HashMap<>();
                        h.put("Access-Control-Allow-Origin", "*");
                        h.put("Cache-Control", "max-age=86400");
                        r.setResponseHeaders(h);
                        return r;
                    }
                    return new WebResourceResponse("image/png", null, 404, "Not Found", new HashMap<String, String>(), new ByteArrayInputStream(new byte[0]));
                }
                return null;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                Uri u = req.getUrl();
                String scheme = u.getScheme();
                if ("file".equals(scheme)) return false;
                // Los enlaces externos (OSM, WhatsApp, tel:) se abren fuera de la app
                openExternal(u);
                return true;
            }

            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                // Si el motor web se cae, recreamos la actividad en vez de cerrar la app
                Log.e(Util.TAG, "WebView render process gone");
                if (web == view) {
                    setContentView(new View(MainActivity.this));
                    view.destroy();
                    web = null;
                }
                recreate();
                return true;
            }
        });
        // Android 15+ dibuja la app de borde a borde: dejamos el espacio de las barras del sistema y del teclado.
        android.widget.FrameLayout root = new android.widget.FrameLayout(this);
        root.setBackgroundColor(getResources().getColor(R.color.bg, getTheme()));
        root.addView(web, new android.widget.FrameLayout.LayoutParams(-1, -1));
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
                @Override
                public android.view.WindowInsets onApplyWindowInsets(View v, android.view.WindowInsets in) {
                    android.graphics.Insets b = in.getInsets(android.view.WindowInsets.Type.systemBars() | android.view.WindowInsets.Type.displayCutout());
                    android.graphics.Insets k = in.getInsets(android.view.WindowInsets.Type.ime());
                    v.setPadding(b.left, b.top, b.right, Math.max(b.bottom, k.bottom));
                    return android.view.WindowInsets.CONSUMED;
                }
            });
        }
        setContentView(root);
        if (Build.VERSION.SDK_INT >= 33) {
            // Atrás predictivo (obligatorio al apuntar a Android 16): onBackPressed ya no se llama
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                    new android.window.OnBackInvokedCallback() {
                        @Override
                        public void onBackInvoked() { handleBack(); }
                    });
        }
        web.loadUrl("file:///android_asset/www/index.html");
        registerNetworkCallback();
    }

    private void registerNetworkCallback() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return;
            netCb = new ConnectivityManager.NetworkCallback() {
                @Override
                public void onAvailable(Network network) { emit("online", "{\"online\":true}"); }

                @Override
                public void onLost(Network network) { emit("online", "{\"online\":false}"); }
            };
            cm.registerDefaultNetworkCallback(netCb);
        } catch (Exception e) {
            Log.w(Util.TAG, "network callback", e);
        }
    }

    private void openExternal(Uri u) {
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, u);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } catch (ActivityNotFoundException e) {
            toast(getString(R.string.err_no_app));
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        current = new WeakReference<>(this);
        visible = true;
        if (resumed) emit("resume", "{}");
        resumed = true;
    }

    @Override
    protected void onPause() {
        visible = false;
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null && netCb != null) cm.unregisterNetworkCallback(netCb);
        } catch (Exception ignored) {
        }
        if (current.get() == this) current = new WeakReference<>(null);
        if (web != null) {
            web.removeJavascriptInterface("TSNative");
            web.destroy();
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() { handleBack(); }

    private void handleBack() {
        if (web == null) {
            finish();
            return;
        }
        web.evaluateJavascript("(window.TS && TS.onBack) ? TS.onBack() : false", new android.webkit.ValueCallback<String>() {
            @Override
            public void onReceiveValue(String value) {
                if (!"true".equals(value)) moveTaskToBack(true);
            }
        });
    }

    /* ------------------------------------------------------------------ */

    /** Envía un evento a la interfaz. */
    void emit(final String type, final String json) {
        ui.post(new Runnable() {
            @Override
            public void run() {
                if (web == null) return;
                String js = "window.TS && TS.onNative(" + JSONObject.quote(type) + "," + JSONObject.quote(json) + ")";
                web.evaluateJavascript(js, null);
            }
        });
    }

    /**
     * Llamado desde el servicio. Si la interfaz está visible entrega el evento en vivo;
     * si no, lo guarda (cuando importa) para entregarlo al volver.
     */
    static void emitTrip(Context c, JSONObject ev, boolean important) {
        MainActivity a = current.get();
        if (a != null && !a.isFinishing() && a.web != null && a.visible && a.hasWindowFocusSafe()) {
            a.emit("trip", ev.toString());
        } else if (important) {
            TripStore.queueEvent(c, ev);
        }
    }

    private boolean hasWindowFocusSafe() {
        try {
            return getWindow() != null && getWindow().getDecorView().isShown();
        } catch (Exception e) {
            return false;
        }
    }

    private void callback(String id, boolean ok, Object data, String error) {
        try {
            JSONObject o = new JSONObject();
            o.put("id", id);
            o.put("ok", ok);
            if (data != null) o.put("data", data);
            if (error != null) o.put("error", error);
            emit("cb", o.toString());
        } catch (Exception e) {
            Log.w(Util.TAG, "callback", e);
        }
    }

    private void toast(final String msg) {
        ui.post(new Runnable() {
            @Override
            public void run() { Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show(); }
        });
    }

    private JSONObject permissionJson() {
        JSONObject o = new JSONObject();
        try {
            o.put("location", Util.hasLocation(this));
            o.put("preciseLocation", Util.has(this, Manifest.permission.ACCESS_FINE_LOCATION));
            o.put("notifications", Util.canNotify(this));
            o.put("sms", Util.has(this, Manifest.permission.SEND_SMS));
            LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
            o.put("gpsOn", lm != null && (lm.isProviderEnabled(LocationManager.GPS_PROVIDER) || lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)));
        } catch (Exception ignored) {
        }
        return o;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_PERMS && pendingPermCb != null) {
            String cb = pendingPermCb;
            pendingPermCb = null;
            callback(cb, true, permissionJson(), null);
        }
    }

    /* ---------------- Ubicación puntual ---------------- */

    @SuppressLint("MissingPermission")
    private void locateOnce(final String cbId) {
        if (!Util.hasLocation(this)) {
            callback(cbId, false, null, "permiso");
            return;
        }
        final LocationManager lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (lm == null) {
            callback(cbId, false, null, "sin-gps");
            return;
        }
        boolean gps = false, net = false;
        try { gps = lm.isProviderEnabled(LocationManager.GPS_PROVIDER); } catch (Exception ignored) { }
        try { net = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER); } catch (Exception ignored) { }
        if (!gps && !net) {
            callback(cbId, false, null, "gps-apagado");
            toast(getString(R.string.err_gps_off));
            return;
        }
        final Location[] best = {null};
        try {
            for (String p : lm.getProviders(true)) {
                Location l = lm.getLastKnownLocation(p);
                if (l != null && System.currentTimeMillis() - l.getTime() < 60000
                        && (best[0] == null || l.getAccuracy() < best[0].getAccuracy())) best[0] = l;
            }
        } catch (Exception ignored) {
        }
        if (best[0] != null && best[0].getAccuracy() <= 50) {
            callback(cbId, true, locJson(best[0]), null);
            return;
        }
        final boolean[] done = {false};
        final LocationListener[] holder = new LocationListener[1];
        final Runnable finish = new Runnable() {
            @Override
            public void run() {
                if (done[0]) return;
                done[0] = true;
                try { lm.removeUpdates(holder[0]); } catch (Exception ignored) { }
                if (best[0] != null) callback(cbId, true, locJson(best[0]), null);
                else callback(cbId, false, null, "sin-senal");
            }
        };
        holder[0] = new LocationListener() {
            @Override
            public void onLocationChanged(Location l) {
                if (best[0] == null || l.getAccuracy() < best[0].getAccuracy()) best[0] = l;
                if (l.getAccuracy() <= 40) {
                    ui.removeCallbacks(finish);
                    finish.run();
                }
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) { }

            @Override
            public void onProviderEnabled(String provider) { }

            @Override
            public void onProviderDisabled(String provider) { }
        };
        try {
            if (gps) lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, holder[0], Looper.getMainLooper());
        } catch (Exception e) {
            Log.w(Util.TAG, "locateOnce gps", e);
        }
        try {
            if (net) lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 1000, 0, holder[0], Looper.getMainLooper());
        } catch (Exception e) {
            Log.w(Util.TAG, "locateOnce red", e);
        }
        ui.postDelayed(finish, 12000);
    }

    private JSONObject locJson(Location l) {
        JSONObject o = new JSONObject();
        try {
            o.put("lat", l.getLatitude());
            o.put("lon", l.getLongitude());
            o.put("acc", l.hasAccuracy() ? l.getAccuracy() : 50);
            o.put("t", System.currentTimeMillis());
        } catch (Exception ignored) {
        }
        return o;
    }

    /* ---------------- Puente JavaScript ---------------- */

    private class Bridge {
        @JavascriptInterface
        public String appVersion() { return "2.0.0"; }

        @JavascriptInterface
        public String loadState() {
            return getSharedPreferences("ts_app", MODE_PRIVATE).getString("state", null);
        }

        @JavascriptInterface
        public void saveState(String json) {
            if (json == null || json.length() > 2_000_000) return;
            getSharedPreferences("ts_app", MODE_PRIVATE).edit().putString("state", json).apply();
        }

        @JavascriptInterface
        public String permissionStatus() { return permissionJson().toString(); }

        @JavascriptInterface
        public void requestPermissions(final String cbId, String listJson) {
            final List<String> perms = new ArrayList<>();
            try {
                JSONArray arr = new JSONArray(listJson);
                for (int i = 0; i < arr.length(); i++) {
                    String n = arr.optString(i);
                    if ("location".equals(n)) {
                        perms.add(Manifest.permission.ACCESS_FINE_LOCATION);
                        perms.add(Manifest.permission.ACCESS_COARSE_LOCATION);
                    } else if ("notifications".equals(n) && Build.VERSION.SDK_INT >= 33) {
                        perms.add(Manifest.permission.POST_NOTIFICATIONS);
                    } else if ("sms".equals(n)) {
                        perms.add(Manifest.permission.SEND_SMS);
                    }
                }
            } catch (Exception ignored) {
            }
            final List<String> missing = new ArrayList<>();
            for (String p : perms) if (!Util.has(MainActivity.this, p)) missing.add(p);
            if (missing.isEmpty()) {
                callback(cbId, true, permissionJson(), null);
                return;
            }
            ui.post(new Runnable() {
                @Override
                public void run() {
                    if (pendingPermCb != null) callback(pendingPermCb, true, permissionJson(), null);
                    pendingPermCb = cbId;
                    MainActivity.this.requestPermissions(missing.toArray(new String[0]), REQ_PERMS);
                }
            });
        }

        @JavascriptInterface
        public void getLocation(final String cbId) {
            ui.post(new Runnable() {
                @Override
                public void run() { locateOnce(cbId); }
            });
        }

        @JavascriptInterface
        public void httpGet(final String url, final String cbId) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    HttpURLConnection con = null;
                    try {
                        URL u = new URL(url);
                        boolean allowed = "https".equals(u.getProtocol());
                        boolean hostOk = false;
                        for (String h : ALLOWED_HOSTS) if (h.equals(u.getHost())) hostOk = true;
                        if (!allowed || !hostOk) {
                            callback(cbId, false, null, "host-no-permitido");
                            return;
                        }
                        con = (HttpURLConnection) u.openConnection();
                        con.setConnectTimeout(8000);
                        con.setReadTimeout(12000);
                        con.setRequestProperty("User-Agent", TileCache.UA);
                        con.setRequestProperty("Accept-Language", "es");
                        int code = con.getResponseCode();
                        InputStream in = code >= 400 ? con.getErrorStream() : con.getInputStream();
                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        if (in != null) {
                            byte[] buf = new byte[8192];
                            int n;
                            while ((n = in.read(buf)) > 0 && out.size() < 1_000_000) out.write(buf, 0, n);
                            in.close();
                        }
                        JSONObject d = new JSONObject();
                        d.put("status", code);
                        d.put("body", out.toString("UTF-8"));
                        callback(cbId, code < 400, d, null);
                    } catch (Exception e) {
                        callback(cbId, false, null, "red");
                    } finally {
                        if (con != null) con.disconnect();
                    }
                }
            }).start();
        }

        @JavascriptInterface
        public String startTrip(String payload) {
            try {
                new JSONObject(payload); // validación
            } catch (Exception e) {
                return "error:" + getString(R.string.err_trip_data);
            }
            if (!Util.hasLocation(MainActivity.this)) return "error:" + getString(R.string.err_no_location_perm);
            TripStore.startNew(MainActivity.this, payload);
            try {
                Intent i = new Intent(MainActivity.this, TripService.class);
                i.setAction(TripService.ACTION_START);
                startForegroundService(i);
                return "ok";
            } catch (Exception e) {
                Log.e(Util.TAG, "startTrip", e);
                TripStore.setRunning(MainActivity.this, false);
                return "error:" + e.getClass().getSimpleName();
            }
        }

        @JavascriptInterface
        public String tripAction(String action) {
            if (action == null) return "no";
            try {
                if (action.startsWith("delay:")) {
                    String[] parts = action.split(":");
                    long expectedAt = Long.parseLong(parts[1]);
                    long lateAt = Long.parseLong(parts[2]);
                    JSONObject p = TripStore.payloadJson(MainActivity.this);
                    if (p == null) return "no";
                    p.put("lateAt", lateAt);
                    p.put("expectedAt", expectedAt);
                    SharedPreferences.Editor e = TripStore.prefs(MainActivity.this).edit();
                    e.putString("payload", p.toString()).putBoolean("lateNotified", false).commit();
                    if (TripService.isAlive()) sendService(TripService.ACTION_UPDATE);
                    return "ok";
                }
                if (!TripService.isAlive() || !TripStore.running(MainActivity.this)) {
                    if ("cancel".equals(action)) TripStore.markStopped(MainActivity.this, System.currentTimeMillis());
                    return "no";
                }
                if ("arrive".equals(action)) { sendService(TripService.ACTION_ARRIVE); return "ok"; }
                if ("cancel".equals(action)) { sendService(TripService.ACTION_CANCEL); return "ok"; }
            } catch (Exception e) {
                Log.w(Util.TAG, "tripAction", e);
            }
            return "no";
        }

        @JavascriptInterface
        public String tripStatus() { return TripStore.statusAndDrain(MainActivity.this); }

        @JavascriptInterface
        public void sendSms(final String cbId, String phonesJson, final String text) {
            final List<String> phones = new ArrayList<>();
            try {
                JSONArray arr = new JSONArray(phonesJson);
                for (int i = 0; i < arr.length(); i++) phones.add(arr.optString(i));
            } catch (Exception ignored) {
            }
            if (!Util.has(MainActivity.this, Manifest.permission.SEND_SMS)) {
                callback(cbId, false, null, "permiso");
                return;
            }
            new Thread(new Runnable() {
                @Override
                public void run() {
                    int sent = Util.sendSms(MainActivity.this, phones, text);
                    JSONObject d = new JSONObject();
                    try { d.put("sent", sent); } catch (Exception ignored) { }
                    callback(cbId, sent > 0, d, sent > 0 ? null : "no-enviado");
                }
            }).start();
        }

        @JavascriptInterface
        public void whatsapp(String phone, String text) { Util.openWhatsApp(MainActivity.this, phone, text); }

        @JavascriptInterface
        public void share(String text) {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("text/plain");
            i.putExtra(Intent.EXTRA_TEXT, text);
            Intent chooser = Intent.createChooser(i, getString(R.string.share_with));
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { startActivity(chooser); } catch (Exception e) { toast(getString(R.string.err_share)); }
        }

        @JavascriptInterface
        public void dial(String phone) {
            String digits = phone == null ? "" : phone.replaceAll("[^0-9+]", "");
            Intent i = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + digits));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { startActivity(i); } catch (Exception e) { toast(getString(R.string.err_dialer)); }
        }

        @JavascriptInterface
        public void openUrl(String url) {
            if (url == null || !(url.startsWith("https://") || url.startsWith("geo:"))) return;
            openExternal(Uri.parse(url));
        }

        @JavascriptInterface
        public void vibrate(String patternJson) {
            try {
                long[] p;
                if (patternJson.trim().startsWith("[")) {
                    JSONArray arr = new JSONArray(patternJson);
                    p = new long[arr.length()];
                    for (int i = 0; i < arr.length(); i++) p[i] = Math.min(2000, arr.optLong(i));
                } else {
                    p = new long[]{Math.min(2000, Long.parseLong(patternJson.trim()))};
                }
                if (p.length > 0) Util.vibrate(MainActivity.this, p);
            } catch (Exception ignored) {
            }
        }

        @JavascriptInterface
        public void notify(String title, String text) {
            Util.notifyAlert(MainActivity.this, 7100, title, text, false, null);
        }

        @JavascriptInterface
        public void keepScreenOn(final boolean on) {
            ui.post(new Runnable() {
                @Override
                public void run() {
                    if (on) getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    else getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        }

        @JavascriptInterface
        public void copy(String text) {
            ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("SafeGo", text));
        }

        /* ---------- Ubicación en vivo (canal cifrado en ntfy.sh) ---------- */
        @JavascriptInterface
        public String liveNew() {
            try {
                return LiveShare.newChannel().toString();
            } catch (Exception e) {
                return "";
            }
        }

        @JavascriptInterface
        public void liveConfig(String topic, String key, boolean on) {
            if (!LiveShare.validTopic(topic) || key == null || key.length() < 40) on = false;
            LiveShare.saveConfig(MainActivity.this, topic, key, on);
        }

        @JavascriptInterface
        public void liveFetch(final String topic, final String key, final String since, final String cbId) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        callback(cbId, true, LiveShare.fetch(topic, key, since), null);
                    } catch (Exception e) {
                        callback(cbId, false, null, "red");
                    }
                }
            }).start();
        }

        @JavascriptInterface
        public boolean isOnline() { return Util.isOnline(MainActivity.this); }

        @JavascriptInterface
        public void openAppSettings() {
            Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { startActivity(i); } catch (Exception ignored) { }
        }

        @JavascriptInterface
        public void openBatterySettings() {
            Intent i = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            try { startActivity(i); } catch (Exception e) { openAppSettings(); }
        }

        @JavascriptInterface
        public int battery() {
            try {
                android.os.BatteryManager bm = (android.os.BatteryManager) getSystemService(Context.BATTERY_SERVICE);
                return bm != null ? bm.getIntProperty(android.os.BatteryManager.BATTERY_PROPERTY_CAPACITY) : -1;
            } catch (Exception e) {
                return -1;
            }
        }

        @JavascriptInterface
        public boolean batteryOptimized() {
            try {
                android.os.PowerManager pm = (android.os.PowerManager) getSystemService(Context.POWER_SERVICE);
                return pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName());
            } catch (Exception e) {
                return false;
            }
        }

    }

    private void sendService(String action) {
        Intent i = new Intent(this, TripService.class);
        i.setAction(action);
        try {
            startService(i);
        } catch (Exception e) {
            Log.w(Util.TAG, "sendService " + action, e);
        }
    }
}
