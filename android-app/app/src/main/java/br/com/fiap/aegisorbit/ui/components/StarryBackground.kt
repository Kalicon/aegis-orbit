package br.com.fiap.aegisorbit.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import kotlin.random.Random

@Composable
fun StarryBackground(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    // Generate 40 stars with stable random positions and twinkle speeds
    val stars = remember {
        List(40) {
            Triple(
                Random.nextFloat(), // X ratio
                Random.nextFloat(), // Y ratio
                Random.nextInt(1200, 3200) // Twinkle speed in ms
            )
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        // Draw each star with its own infinite transition for individual twinkling
        stars.forEach { star ->
            val infiniteTransition = rememberInfiniteTransition(label = "StarTwinkle")
            val alpha by infiniteTransition.animateFloat(
                initialValue = 0.1f,
                targetValue = 0.95f,
                animationSpec = infiniteRepeatable(
                    animation = tween(star.third, easing = LinearEasing),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "StarAlpha"
            )

            Canvas(modifier = Modifier.fillMaxSize()) {
                val x = star.first * size.width
                val y = star.second * size.height
                
                // Draw a cyan space star
                drawCircle(
                    color = Color(0xFF00E5FF).copy(alpha = alpha),
                    radius = 2.5f,
                    center = Offset(x, y)
                )
                // Draw star glow ring
                drawCircle(
                    color = Color(0xFF00E5FF).copy(alpha = alpha * 0.25f),
                    radius = 6.5f,
                    center = Offset(x, y)
                )
            }
        }
        
        // Render screen content
        content()
    }
}
