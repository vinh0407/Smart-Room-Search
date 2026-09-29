package com.smartroomsearch.app

import android.app.Application
import androidx.room.Room
import com.smartroomsearch.app.api.RetrofitClient
import com.smartroomsearch.app.model.ExternalRoomsData
import com.smartroomsearch.app.repository.AppDatabase
import com.smartroomsearch.app.repository.SmartRoomRepository

class SmartRoomApplication : Application() {
    
    companion object {
        lateinit var appContext: Application
            private set
    }
    
    lateinit var repository: SmartRoomRepository
    
    override fun onCreate() {
        super.onCreate()
        appContext = this
        ExternalRoomsData.init(this)

        RetrofitClient.init(this)

        val database = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "smart_room_db"
        ).build()
        
        repository = SmartRoomRepository(
            api = RetrofitClient.instance,
            favoriteDao = database.favoriteDao()
        )
    }
}
