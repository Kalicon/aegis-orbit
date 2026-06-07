package br.com.fiap.aegisorbit.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface ElevationDao {
    @Query("SELECT * FROM elevation_points WHERE sectorName = :sector")
    suspend fun getPointsBySector(sector: String): List<ElevationPoint>

    @Query("SELECT * FROM elevation_points WHERE slopeDegree > :maxSlope")
    suspend fun getHazardousPoints(maxSlope: Double): List<ElevationPoint>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPoints(points: List<ElevationPoint>)

    // Civil Reports offline persistence
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCivilReport(report: CivilReport)

    @Query("SELECT * FROM civil_reports ORDER BY timestamp DESC")
    suspend fun getAllCivilReports(): List<CivilReport>

    // UAP Sightings offline persistence
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUapSighting(sighting: UapSighting)

    @Query("SELECT * FROM uap_sightings ORDER BY timestamp DESC")
    suspend fun getAllUapSightings(): List<UapSighting>
}
