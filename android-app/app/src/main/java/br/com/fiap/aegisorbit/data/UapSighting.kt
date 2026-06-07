package br.com.fiap.aegisorbit.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "uap_sightings")
data class UapSighting(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val ionicFlux: Double,
    val frequencyGhz: Double,
    val description: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isVerified: Boolean = false
)
