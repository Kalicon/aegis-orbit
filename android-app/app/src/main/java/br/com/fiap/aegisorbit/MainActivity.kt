package br.com.fiap.aegisorbit

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.GeolocationPermissions
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Edge-to-edge display (full bleed, NASA aesthetic)
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT

        // Make status bar icons dark-on-light (we have a dark bg, so light icons)
        val insetsController = WindowInsetsControllerCompat(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false
        insetsController.isAppearanceLightNavigationBars = false

        // Request Microphone + Location permissions at runtime
        val permissionsNeeded = mutableListOf<String>()
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.RECORD_AUDIO)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }
        if (permissionsNeeded.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsNeeded.toTypedArray(), 101)
        }

        setContent {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { context ->
                    WebView(context).apply {
                        // Full-bleed background matching the app's --bg-primary
                        setBackgroundColor(Color.parseColor("#020409"))

                        webViewClient = object : WebViewClient() {
                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                // Inject JS to mark this as running inside Android WebView
                                view?.evaluateJavascript(
                                    "document.body.classList.add('android-webview'); " +
                                    "window.IS_ANDROID_WEBVIEW = true;",
                                    null
                                )
                            }
                        }

                        webChromeClient = object : WebChromeClient() {
                            // Grant all media/microphone/camera permissions
                            override fun onPermissionRequest(request: PermissionRequest) {
                                request.grant(request.resources)
                            }
                            // Grant geolocation (for GPS-based features)
                            override fun onGeolocationPermissionsShowPrompt(
                                origin: String?,
                                callback: GeolocationPermissions.Callback?
                            ) {
                                callback?.invoke(origin, true, false)
                            }
                        }

                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            allowFileAccess = true
                            allowContentAccess = true
                            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

                            // Responsive viewport: use device width, no forced desktop zoom
                            useWideViewPort = true
                            loadWithOverviewMode = true

                            // Offline cache support (for assets and API responses)
                            cacheMode = WebSettings.LOAD_DEFAULT
                            databaseEnabled = true

                            // Better fonts rendering
                            standardFontFamily = "sans-serif"
                            defaultFontSize = 14

                            // Smooth scrolling
                            setSupportZoom(false)
                            builtInZoomControls = false
                            displayZoomControls = false

                            // Media autoplay (for animations and audio)
                            mediaPlaybackRequiresUserGesture = false

                            // Geolocation
                            setGeolocationEnabled(true)
                        }

                        // Enable hardware acceleration
                        setLayerType(View.LAYER_TYPE_HARDWARE, null)

                        // Load the app from assets folder
                        loadUrl("file:///android_asset/index.html")
                    }
                }
            )
        }
    }
}
