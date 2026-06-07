package br.com.fiap.aegisorbit.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "civil_reports")
data class CivilReport(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val type: String,
    val description: String,
    val latitude: Double,
    val longitude: Double,
    val timestamp: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false
)
