/**
 *
 * This is for managing interactions with the db
 *
 *
 */

import * as SQLite from "expo-sqlite";
import { SongInfo } from "@/types/audio";

interface DbInfo {
  user_version: number
}

export interface SongDBItem {
  id: number;
  name: string;
  location: string;
}

export const AudioAssetMap: Record<string, string> = {
  "./assets/music/afrobeat-chill.mp3": require("../assets/music/afrobeat-chill.mp3"),
  "./assets/music/cats-and-mushrooms.mp3": require("../assets/music/cats-and-mushrooms.mp3"),
  "./assets/music/chill-lofi.mp3": require("../assets/music/chill-lofi.mp3"),
  "./assets/music/chill-lounge-lofi.mp3": require("../assets/music/chill-lounge-lofi.mp3"),
  "./assets/music/chillhop-in-new-york.mp3": require("../assets/music/chillhop-in-new-york.mp3"),
  "./assets/music/chillhop-lofi.mp3": require("../assets/music/chillhop-lofi.mp3"),
  "./assets/music/japanese-magic-lofi.mp3": require("../assets/music/japanese-magic-lofi.mp3"),
  "./assets/music/jazzy-lofi-rhythm.mp3": require("../assets/music/jazzy-lofi-rhythm.mp3"),
  "./assets/music/peaceful-lofi.mp3": require("../assets/music/peaceful-lofi.mp3"),
  "./assets/music/unstoppable-dance.mp3": require("../assets/music/unstoppable-dance.mp3"),
};

export async function manageDBIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let result = await db.getFirstAsync("PRAGMA user_version") as DbInfo;
  let currentDbVersion = result ? result.user_version : 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    const initialSongs = [
      {name:"Fuzzy Cats and Mushrooms", location:"./assets/music/cats-and-mushrooms.mp3"},
      {name:"Peaceful Lofi", location:"./assets/music/peaceful-lofi.mp3"},
      {name:"Unstoppable Dance", location:"./assets/music/unstoppable-dance.mp3"},
      {name:"afrobeat-chill", location:"./assets/music/afrobeat-chill.mp3"},
      {name:"chill-lofi", location:"./assets/music/chill-lofi.mp3"},
      {name:"chill-lounge-lofi", location:"./assets/music/chill-lounge-lofi.mp3"},
      {name:"chillhop-in-new-york", location:"./assets/music/chillhop-in-new-york.mp3"},
      {name:"chillhop-lofi", location:"./assets/music/chillhop-lofi.mp3"},
      {name:"japanese-magic-lofi", location:"./assets/music/japanese-magic-lofi.mp3"},
      {name:"jazzy-lofi-rhythm", location:"./assets/music/jazzy-lofi-rhythm.mp3"}
    ]
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS songlist (id INTEGER PRIMARY KEY NOT null, name TEXT UNIQUE NOT null, location TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS playlist (id INTEGER PRIMARY KEY NOT null, name TEXT UNIQUE NOT null, location TEXT NOT NULL);
    `);

    for (const song of initialSongs){
      await db.runAsync(
        "INSERT OR IGNORE INTO songlist (name, location) VALUES (?,?)",
        [song.name, song.location]
      );
    }
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export async function getPlayListSongs(db: SQLite.SQLiteDatabase): Promise<SongDBItem[]> {
  try {
    const playListSongs = await db.getAllAsync<SongDBItem>("SELECT * FROM playlist");
    return playListSongs;
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return [];
  }
}

export async function getSongListSongs(db: SQLite.SQLiteDatabase): Promise<SongDBItem[]> {
  try {
    const allSongs = await db.getAllAsync<SongDBItem>("SELECT * FROM songlist");
    return allSongs;
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    return [];
  }
}

export async function addSongToPlaylist(db: SQLite.SQLiteDatabase, {name, location}: SongInfo) {
    try {
        // Use db.runAsync for INSERT, UPDATE, DELETE queries
        await db.runAsync(
            "INSERT OR IGNORE INTO playlist (name, location) VALUES (?, ?)", 
            [name, location]
        );
        console.log(`Added song: ${name}`);
    } catch (error) {
        console.error("Error adding song to playlist:", error);
    }
}

export async function removeSongFromPlaylist(db: SQLite.SQLiteDatabase, name: string) {
    try {
        // Use db.runAsync for INSERT, UPDATE, DELETE queries
        await db.runAsync(
            "DELETE FROM playlist WHERE name = ? ", 
            [name]
        );
        console.log(`Removed song: ${name}`);
    } catch (error) {
        console.error("Error adding song to playlist:", error);
    }
}
