package br.com.fiap.aegisorbit.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.api.AegisApiService
import br.com.fiap.aegisorbit.data.AppDatabase
import br.com.fiap.aegisorbit.data.UapSighting
import br.com.fiap.aegisorbit.ui.components.StarryBackground
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun SkyWatchScreen() {
    var uapStatus by remember { mutableStateOf("Anomalia ionosférica ativa detectada sobre Setor Rio-A. Assinatura: UAP-1.") }
    var isScanning by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val db = remember { AppDatabase.getDatabase(context) }

    // Infinite transition for radar sweep animation
    val infiniteTransition = rememberInfiniteTransition(label = "RadarSweep")
    val angle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(4000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "RadarSweepAngle"
    )

    StarryBackground {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Aegis SkyWatch", color = Color.White, fontSize = 18.sp)
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0x1FBD00F9)),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = "SETI ACTIVE",
                            color = Color(0xFFD500F9),
                            fontSize = 10.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                Text(
                    text = "Varredura de anomalias aéreas e radiação ionosférica sincronizado com a base NASA SETI.",
                    color = Color(0xFF90CAF9),
                    fontSize = 11.sp,
                    lineHeight = 14.sp,
                    modifier = Modifier.padding(vertical = 8.dp)
                )

                // Radar Visualizer Canvas
                Box(
                    modifier = Modifier
                        .size(150.dp)
                        .padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val radius = size.minDimension / 2
                        val center = Offset(size.width / 2, size.height / 2)

                        // Draw circles
                        drawCircle(color = Color(0x3300E5FF), radius = radius, center = center, style = Stroke(2f))
                        drawCircle(color = Color(0x1a00E5FF), radius = radius * 0.6f, center = center, style = Stroke(1.5f))
                        drawCircle(color = Color(0x0d00E5FF), radius = radius * 0.2f, center = center, style = Stroke(1f))

                        // Draw crosshairs
                        drawLine(color = Color(0x1a00E5FF), start = Offset(0f, center.y), end = Offset(size.width, center.y))
                        drawLine(color = Color(0x1a00E5FF), start = Offset(center.x, 0f), end = Offset(center.x, size.height))

                        // Draw sweep line
                        val rad = Math.toRadians(angle.toDouble())
                        val endX = center.x + radius * Math.cos(rad).toFloat()
                        val endY = center.y + radius * Math.sin(rad).toFloat()
                        drawLine(
                            color = Color(0xaa00E5FF),
                            start = center,
                            end = Offset(endX, endY),
                            strokeWidth = 3f
                        )

                        // Simulated Blip (Landmark)
                        drawCircle(
                            color = Color(0xFFD500F9),
                            radius = 6f,
                            center = Offset(center.x + radius * 0.5f, center.y - radius * 0.4f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // UAP Alert Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = "DETECÇÃO ATIVA",
                            color = Color(0xFFD500F9),
                            fontSize = 11.sp,
                            style = MaterialTheme.typography.labelSmall
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = uapStatus,
                            color = Color.White,
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.weight(1f))

                Button(
                    onClick = {
                        scope.launch {
                            isScanning = true
                            delay(1800)
                            
                            val sighting = UapSighting(
                                ionicFlux = 14.2,
                                frequencyGhz = 1.420,
                                description = "Anomalia UAP luminosa flutuante travada na faixa 1.42GHz",
                                isVerified = true
                            )
                            db.elevationDao().insertUapSighting(sighting)
                            AegisApiService.uploadUapSighting(sighting)
                            
                            uapStatus = "UAP CONFIRMADO (#UAP-R1). Anomalia eletromagnética registrada na Room DB e enviada para a central NASA SETI."
                            isScanning = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD500F9)),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(text = "Escanear Sky com Câmera AR", color = Color.White)
                }
            }

            // Scanning AR dialog overlay
            if (isScanning) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xE6020409)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = Color(0xFFD500F9))
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(text = "Alinhando Câmera AR...", color = Color(0xFFD500F9), fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = "Gravando avistamento na base local Room...", color = Color.Gray, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
