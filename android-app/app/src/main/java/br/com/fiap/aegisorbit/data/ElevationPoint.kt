package br.com.fiap.aegisorbit.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "elevation_points")
data class ElevationPoint(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val latitude: Double,
    val longitude: Double,
    val altitudeMeters: Double,
    val slopeDegree: Double,
    val sectorName: String
)
