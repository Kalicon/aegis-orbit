package br.com.fiap.aegisorbit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import br.com.fiap.aegisorbit.api.AegisApiService
import br.com.fiap.aegisorbit.data.AppDatabase
import br.com.fiap.aegisorbit.data.CivilReport
import br.com.fiap.aegisorbit.ui.components.StarryBackground
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen() {
    var selectedOption by remember { mutableStateOf("Alagamento") }
    var description by remember { mutableStateOf("") }
    var isUploading by remember { mutableStateOf(false) }
    var uploadStatus by remember { mutableStateOf("Desconectado") }
    var uploadDetail by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val db = remember { AppDatabase.getDatabase(context) }

    val options = listOf("Alagamento", "Deslizamento", "Obstrução de Via")

    StarryBackground {
        Box(modifier = Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Reportar Ocorrência",
                    color = Color.White,
                    fontSize = 18.sp,
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Text(
                    text = "Seus dados móveis estão indisponíveis. O aplicativo usará o Android Satellite API para se conectar diretamente a um satélite LEO.",
                    color = Color(0xFF90CAF9),
                    fontSize = 11.sp,
                    lineHeight = 15.sp,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                // Options List
                options.forEach { option ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .background(
                                if (selectedOption == option) Color(0x1F00E5FF) else Color(0x05FFFFFF),
                                RoundedCornerShape(8.dp)
                            )
                            .clickable { selectedOption = option }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = (selectedOption == option),
                            onClick = { selectedOption = option },
                            colors = RadioButtonDefaults.colors(selectedColor = Color(0xFF00E5FF))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = option, color = Color.White, fontSize = 14.sp)
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Descreva a ocorrência...", color = Color(0xFF4F7CAC)) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    colors = TextFieldDefaults.outlinedTextFieldColors(
                        focusedBorderColor = Color(0xFF00E5FF),
                        unfocusedBorderColor = Color(0x33FFFFFF),
                        focusedLabelColor = Color(0xFF00E5FF),
                        textColor = Color.White
                    )
                )

                Spacer(modifier = Modifier.weight(1f))

                Button(
                    onClick = {
                        scope.launch {
                            isUploading = true
                            uploadStatus = "Gravando Localmente..."
                            uploadDetail = "Persistindo na base SQLite Room..."
                            
                            val report = CivilReport(
                                type = selectedOption,
                                description = description,
                                latitude = -22.9519,
                                longitude = -43.2105,
                                isSynced = false
                            )
                            db.elevationDao().insertCivilReport(report)
                            delay(1000)

                            uploadStatus = "Buscando satélite LEO..."
                            uploadDetail = "Varrendo frequências Direct-to-Cell..."
                            delay(1200)
                            
                            uploadStatus = "Transmitindo Pacotes..."
                            uploadDetail = "Sincronizando com Aegis Command API..."
                            val success = AegisApiService.uploadCivilReport(report)
                            
                            if (success) {
                                db.elevationDao().insertCivilReport(report.copy(isSynced = true))
                                uploadStatus = "SUCESSO"
                                uploadDetail = "Relatório sincronizado! ACK: #OK"
                            } else {
                                uploadStatus = "PENDENTE"
                                uploadDetail = "Salvo offline para envio posterior."
                            }
                            
                            delay(1500)
                            isUploading = false
                            description = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFff9100)),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(text = "Transmitir via Satélite LEO", color = Color.White)
                }
            }

            // Animated satellite loading dialog
            if (isUploading) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xE6020409)),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        CircularProgressIndicator(color = Color(0xFF00E5FF))
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(text = uploadStatus, color = Color(0xFF00E5FF), fontSize = 16.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(text = uploadDetail, color = Color.Gray, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
