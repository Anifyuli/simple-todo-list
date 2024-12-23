// @/utils/db.ts
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { openDatabaseAsync } from 'expo-sqlite';

export const loadDatabase = async () => {
  const dbName = "todos.db";
  const dbAsset = require("../data/todos.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
  }
  await FileSystem.downloadAsync(dbUri, dbFilePath);

  try {

    const db = await openDatabaseAsync(dbName);

    // Buat tabel jika belum ada
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS todo (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          completed INTEGER DEFAULT 0
        );`
    )

    console.log('Database ready');
    await db.closeAsync();
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
};