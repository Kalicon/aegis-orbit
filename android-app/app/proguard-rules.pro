# ============================================================
# AEGIS-ORBIT — ProGuard Rules
# ============================================================

# Keep WebView JavaScript interface classes
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebView client classes
-keep class android.webkit.** { *; }

# Keep Kotlin coroutines
-keep class kotlinx.coroutines.** { *; }

# Keep Compose runtime
-keep class androidx.compose.** { *; }

# General Android rules
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
