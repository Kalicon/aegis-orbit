package br.com.fiap.aegisorbit.api

import br.com.fiap.aegisorbit.data.CivilReport
import br.com.fiap.aegisorbit.data.UapSighting
import kotlinx.coroutines.delay

object AegisApiService {
    /**
     * Simulates uploading a civil warning report via satellite network to NASA EOS Partner server.
     */
    suspend fun uploadCivilReport(report: CivilReport): Boolean {
        delay(1000) // Simulates LEO satellite latency
        return true
    }

    /**
     * Simulates uploading a UAP anomalous event to SETI command center.
     */
    suspend fun uploadUapSighting(sighting: UapSighting): Boolean {
        delay(1200) // Simulates satellite latency
        return true
    }
}
