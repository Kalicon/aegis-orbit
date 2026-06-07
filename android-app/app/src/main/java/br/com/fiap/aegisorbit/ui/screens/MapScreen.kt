package br.com.fiap.aegisorbit.ui.screens

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
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.ui.components.StarryBackground

@Composable
fun MapScreen() {
    var isNavigating by remember { mutableStateOf(false) }

    StarryBackground {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Rotas de Fuga Segura",
                color = Color.White,
                fontSize = 18.sp,
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // Custom canvas drawing representing a topographic elevation map
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .background(Color(0xFF070913), RoundedCornerShape(12.dp))
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    // Drawing topographic grid lines
                    for (i in 0..size.width.toInt() step 60) {
                        drawLine(
                            color = Color(0x0F00E5FF),
                            start = Offset(i.toFloat(), 0f),
                            end = Offset(i.toFloat(), size.height),
                            strokeWidth = 1f
                        )
                    }

                    // Drawing Danger Zone
                    drawCircle(
                        color = Color(0x22FF1744),
                        center = Offset(size.width * 0.4f, size.height * 0.6f),
                        radius = 90f
                    )
                    drawCircle(
                        color = Color(0xFFFF1744),
                        center = Offset(size.width * 0.4f, size.height * 0.6f),
                        radius = 15f
                    )

                    // User dot
                    drawCircle(
                        color = Color(0xFF00E5FF),
                        center = Offset(size.width * 0.2f, size.height * 0.3f),
                        radius = 12f
                    )

                    // Destination dot
                    drawCircle(
                        color = Color(0xFF00FF66),
                        center = Offset(size.width * 0.8f, size.height * 0.4f),
                        radius = 18f
                    )

                    // Safe Path bypassing landslide zone
                    if (isNavigating) {
                        val pathEffect = PathEffect.dashPathEffect(floatArrayOf(15f, 10f), 0f)
                        drawLine(
                            color = Color(0xFF00E5FF),
                            start = Offset(size.width * 0.2f, size.height * 0.3f),
                            end = Offset(size.width * 0.5f, size.height * 0.2f),
                            strokeWidth = 6f,
                            pathEffect = pathEffect
                        )
                        drawLine(
                            color = Color(0xFF00E5FF),
                            start = Offset(size.width * 0.5f, size.height * 0.2f),
                            end = Offset(size.width * 0.8f, size.height * 0.4f),
                            strokeWidth = 6f,
                            pathEffect = pathEffect
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Info Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "ROTA DE EVASÃO ORBITAL",
                        color = Color(0xFF00E5FF),
                        fontSize = 12.sp,
                        style = MaterialTheme.typography.labelSmall
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Distância: 820m | Elevação Média: +12m (Área Segura)",
                        color = Color.White,
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "A rota evita encostas de alto declive conforme leitura de satélite InSAR.",
                        color = Color(0xFF00FF66),
                        fontSize = 11.sp
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = { isNavigating = !isNavigating },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0b3d91)),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = if (isNavigating) "Parar Orientação" else "Iniciar Orientação Offline",
                    color = Color.White
                )
            }
        }
    }
}
