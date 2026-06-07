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
import br.com.fiap.aegisorbit.ui.components.StarryBackground
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun TrackerScreen() {
    var signalStrength by remember { mutableFloatStateOf(0f) }
    var alignStatus by remember { mutableStateOf("Buscando Sinal") }
    var isAligning by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val db = remember { AppDatabase.getDatabase(context) }

    // Pulse animation for LEO satellite beacons
    val infiniteTransition = rememberInfiniteTransition(label = "RadarBlink")
    val beaconPulse by infiniteTransition.animateFloat(
        initialValue = 4f,
        targetValue = 24f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "PulseRadius"
    )

    StarryBackground {
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
                Text(text = "Rastreamento LEO", color = Color.White, fontSize = 18.sp)
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (signalStrength > 0.8f) Color(0x1F00FF66) else Color(0x1FFF1744)
                    ),
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = if (signalStrength > 0.8f) "LINK ATIVO" else "SEM SINAL",
                        color = if (signalStrength > 0.8f) Color(0xFF00FF66) else Color(0xFFFF1744),
                        fontSize = 10.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }

            Text(
                text = "Aponte o receptor na direção do satélite Aegis-LEO para efetuar sincronização offline de dados climáticos.",
                color = Color(0xFF90CAF9),
                fontSize = 11.sp,
                lineHeight = 14.sp,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Compass / Antenna Alignment Graphic using Canvas
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .background(Color(0xFF070913), RoundedCornerShape(12.dp))
                    .padding(8.dp),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val radius = size.minDimension / 2
                    val center = Offset(size.width / 2, size.height / 2)

                    // Concentric circles
                    drawCircle(color = Color(0x1A00E5FF), radius = radius, center = center, style = Stroke(2f))
                    drawCircle(color = Color(0x3300E5FF), radius = radius * 0.7f, center = center, style = Stroke(1.5f))
                    drawCircle(color = Color(0x4D00E5FF), radius = radius * 0.4f, center = center, style = Stroke(1f))

                    // Axis Lines
                    drawLine(color = Color(0x1A00E5FF), start = Offset(0f, center.y), end = Offset(size.width, center.y))
                    drawLine(color = Color(0x1A00E5FF), start = Offset(center.x, 0f), end = Offset(center.x, size.height))

                    // Satellite Target Node
                    val targetOffset = if (signalStrength > 0.8f) {
                        center // perfectly centered when locked
                    } else {
                        Offset(center.x + radius * 0.5f, center.y - radius * 0.3f)
                    }

                    drawCircle(
                        color = if (signalStrength > 0.8f) Color(0xFF00FF66) else Color(0xFF00E5FF),
                        radius = 8f,
                        center = targetOffset
                    )

                    drawCircle(
                        color = if (signalStrength > 0.8f) Color(0x3300FF66) else Color(0x3300E5FF),
                        radius = beaconPulse,
                        center = targetOffset,
                        style = Stroke(1.5f)
                    )

                    // Current Device Alignment pointer
                    if (isAligning && signalStrength <= 0.8f) {
                        drawLine(
                            color = Color(0xFFFF9100),
                            start = center,
                            end = targetOffset,
                            strokeWidth = 2f
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Telemetry details card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "ESTATÍSTICAS DA CONEXÃO",
                        color = Color(0xFF00E5FF),
                        fontSize = 11.sp,
                        style = MaterialTheme.typography.labelSmall
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Status: $alignStatus",
                        color = Color.White,
                        fontSize = 12.sp
                    )
                    Text(
                        text = "Qualidade do Sinal: ${(signalStrength * 100).toInt()}%",
                        color = if (signalStrength > 0.8f) Color(0xFF00FF66) else Color(0xFF90CAF9),
                        fontSize = 12.sp
                    )
                    Text(
                        text = "Satélites em Alcance: 3 (AEGIS-2, AEGIS-4, SENTINEL-1B)",
                        color = Color.Gray,
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = {
                    scope.launch {
                        isAligning = true
                        alignStatus = "Calibrando Giroscópio..."
                        delay(1000)
                        alignStatus = "Apontando para satélite AEGIS-4..."
                        signalStrength = 0.3f
                        delay(1000)
                        alignStatus = "Sincronizando frequências..."
                        signalStrength = 0.6f
                        delay(1000)
                        alignStatus = "Verificando base local offline..."
                        val unsynced = db.elevationDao().getAllCivilReports().filter { !it.isSynced }
                        delay(1000)
                        if (unsynced.isNotEmpty()) {
                            alignStatus = "Enviando ${unsynced.size} relatórios pendentes..."
                            unsynced.forEach { report ->
                                val success = AegisApiService.uploadCivilReport(report)
                                if (success) {
                                    db.elevationDao().insertCivilReport(report.copy(isSynced = true))
                                }
                            }
                            delay(1200)
                        }
                        alignStatus = "Sincronização completa!"
                        signalStrength = 0.95f
                        isAligning = false
                    }
                },
                enabled = !isAligning,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00E5FF)),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = if (isAligning) "Alinhando..." else "Alinhar Antena Satelital",
                    color = Color(0xFF020409)
                )
            }
        }
    }
}
