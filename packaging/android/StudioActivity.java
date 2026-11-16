package io.github.fenitranalisoa.storyboard;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowInsets;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;
import java.util.Locale;

public final class StudioActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/app/index.html";
    private static final int PICK_FILE = 1;
    private final ExportBridge exports = new ExportBridge();
    private ValueCallback<Uri[]> fileSelection;
    private WebView view;

    @Override
    public void onCreate(Bundle state) {
        super.onCreate(state);
        view = new WebView(this);
        view.setBackgroundColor(0xff151219);
        setContentView(view);
        if (Build.VERSION.SDK_INT >= 35) {
            view.setOnApplyWindowInsetsListener((page, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars() |
                    WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                page.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return WindowInsets.CONSUMED;
            });
        }
        view.getSettings().setJavaScriptEnabled(true);
        view.getSettings().setDomStorageEnabled(true);
        view.getSettings().setAllowFileAccess(false);
        view.addJavascriptInterface(exports, "StoryboardAndroid");
        view.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView page, WebResourceRequest request) {
                Uri url = request.getUrl();
                if (!isLocal(url) || !"GET".equals(request.getMethod())) return missing();
                String path = url.getPath();
                if (path == null || !path.startsWith("/app/")) return missing();
                for (String part : path.split("/")) {
                    if (part.equals(".") || part.equals("..") || part.indexOf('\\') >= 0) return missing();
                }
                try {
                    String name = path.substring(1);
                    String mime = mimeType(name);
                    return new WebResourceResponse(mime, mime.startsWith("text/") ? "UTF-8" : null, getAssets().open(name));
                } catch (IOException exception) {
                    return missing();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView page, WebResourceRequest request) {
                if (isLocal(request.getUrl())) return false;
                if (request.isForMainFrame() && request.hasGesture() && "https".equals(request.getUrl().getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, request.getUrl())); }
                    catch (ActivityNotFoundException ignored) { }
                }
                return true;
            }
        });
        view.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView page, ValueCallback<Uri[]> callback, FileChooserParams parameters) {
                if (fileSelection != null) fileSelection.onReceiveValue(null);
                fileSelection = callback;
                try {
                    startActivityForResult(parameters.createIntent(), PICK_FILE);
                } catch (ActivityNotFoundException exception) {
                    fileSelection = null;
                    callback.onReceiveValue(null);
                }
                return true;
            }
        });
        view.loadUrl(START_URL);
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPort() == -1;
    }

    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
            Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }

    private static String mimeType(String name) {
        int dot = name.lastIndexOf('.');
        if (dot < 0) return "application/octet-stream";
        switch (name.substring(dot + 1).toLowerCase(Locale.ROOT)) {
            case "html": return "text/html";
            case "js": return "text/javascript";
            case "css": return "text/css";
            case "ttf": return "font/ttf";
            case "jpg": return "image/jpeg";
            default: return "application/octet-stream";
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != PICK_FILE || fileSelection == null) return;
        ValueCallback<Uri[]> callback = fileSelection;
        fileSelection = null;
        Uri[] files = WebChromeClient.FileChooserParams.parseResult(result, data);
        if (files != null) {
            for (Uri file : files) {
                if (!"content".equals(file.getScheme())) {
                    files = null;
                    break;
                }
            }
        }
        callback.onReceiveValue(files);
    }

    @Override
    protected void onDestroy() {
        exports.abortExport();
        if (fileSelection != null) fileSelection.onReceiveValue(null);
        view.destroy();
        super.onDestroy();
    }

    public final class ExportBridge {
        private Uri pending;
        private OutputStream output;

        @JavascriptInterface
        public synchronized boolean beginExport(String name, String type) {
            if (pending != null || name == null || !name.matches("[a-zA-Z0-9][a-zA-Z0-9._-]{0,239}") ||
                    !("image/png".equals(type) && name.endsWith(".png") ||
                    "text/plain".equals(type) && name.endsWith(".txt")))
                return false;
            ContentResolver resolver = getContentResolver();
            ContentValues properties = new ContentValues();
            properties.put(MediaStore.Downloads.DISPLAY_NAME, name);
            properties.put(MediaStore.Downloads.MIME_TYPE, type);
            properties.put(MediaStore.Downloads.IS_PENDING, 1);
            try {
                Uri downloads = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
                pending = resolver.insert(downloads, properties);
                if (pending == null) return false;
                output = resolver.openOutputStream(pending, "w");
                if (output != null) return true;
            } catch (IOException | RuntimeException ignored) { }
            abortExport();
            return false;
        }

        @JavascriptInterface
        public synchronized boolean appendExport(String data) {
            if (output == null || data == null || data.length() > 350000) return false;
            try {
                output.write(Base64.decode(data, Base64.NO_WRAP));
                return true;
            } catch (IOException | IllegalArgumentException exception) {
                return false;
            }
        }

        @JavascriptInterface
        public synchronized boolean finishExport() {
            if (pending == null || output == null) return false;
            try {
                output.close();
                output = null;
                ContentValues properties = new ContentValues();
                properties.put(MediaStore.Downloads.IS_PENDING, 0);
                if (getContentResolver().update(pending, properties, null, null) == 1) {
                    pending = null;
                    return true;
                }
            } catch (IOException | RuntimeException ignored) { }
            abortExport();
            return false;
        }

        @JavascriptInterface
        public synchronized void abortExport() {
            if (output != null) {
                try { output.close(); }
                catch (IOException ignored) { }
                output = null;
            }
            if (pending != null) {
                try { getContentResolver().delete(pending, null, null); }
                catch (RuntimeException ignored) { }
                pending = null;
            }
        }
    }
}
