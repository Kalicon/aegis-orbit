package br.com.fiap.aegisorbit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.ui.components.StarryBackground

@Composable
fun EcoScreen() {
    var ecoCredits by remember { mutableIntStateOf(640) }
    var levelXp by remember { mutableStateOf("780 XP") }

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
                Text(text = "Comunidade Verde", color = Color.White, fontSize = 18.sp)
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0x1F00FF66)),
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text(
                        text = "$ecoCredits ECO",
                        color = Color(0xFF00FF66),
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelMedium
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Circular Progress Score
            Box(
                modifier = Modifier.size(100.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    progress = 0.78f,
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF00FF66),
                    strokeWidth = 6.dp,
                    trackColor = Color(0xFF0C1224)
                )
                Text(
                    text = levelXp,
                    color = Color.White,
                    fontSize = 18.sp,
                    style = MaterialTheme.typography.titleMedium
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Nível 4 Guardião",
                color = Color(0xFF00FF66),
                fontSize = 14.sp,
                style = MaterialTheme.typography.bodyLarge
            )
            Text(
                text = "Sua área foi validada como 'Área Reflorestada' via análise multiespectral de Sentinel-2.",
                color = Color(0xFF90CAF9),
                fontSize = 11.sp,
                modifier = Modifier.padding(top = 4.dp, bottom = 16.dp),
                lineHeight = 15.sp
            )

            // Rewards details card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0C1224)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "RECOMPENSAS DISPONÍVEIS",
                        color = Color(0xFF00FF66),
                        fontSize = 11.sp,
                        style = MaterialTheme.typography.labelSmall
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "- Desconto na tarifa de energia: 400 ECO", color = Color.White, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "- Kit de mudas nativas: 150 ECO", color = Color.White, fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            Button(
                onClick = {
                    if (ecoCredits >= 400) {
                        ecoCredits -= 400
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00FF66)),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = "Resgatar Desconto de Energia", color = Color(0xFF020409))
            }
        }
    }
}
