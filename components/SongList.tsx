/**
 *
 *
 * This component takes in all saved songs from a database
 * Song's longpress opens an action button - that action button
 * adds the selected song to the playlist table
 *
 *
 */

import { StyleSheet, Text, View, FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { useSongPlayer } from "../context/SongContext";
import { SongInfo } from "@/types/audio";

// import { getSongListSongs } from "../data/musicdb";
import { addSongToPlaylist, getSongListSongs } from "../data/musicdb";
import Song from "./Song";

const SongList = () => {
  const db = useSQLiteContext();
  const [songsList, setSongsList] = useState<SongInfo[]>([]);
  // const [playSong, setPlaySong] = useState("");
  const {playNewSong} = useSongPlayer();

  //we're getting all songs from songlist table and display in flatlist
  useEffect(() => {
    const loadSongs = async () => {
      const allSongs = await getSongListSongs(db);
      setSongsList(allSongs);
    };
    loadSongs();
  }, [db]);

  const handleAddSong = async ({name,location}: SongInfo) => {
    await addSongToPlaylist(db, {name, location});
  };

  const handlePlaySong = (songInfo: SongInfo, listArray: SongInfo[], listIndex: number) => {
    playNewSong({name: songInfo.name, location: songInfo.location, listArray, listIndex});
  };

  return (
    <View style={styles.playlist}>
      <Text style={styles.title}>App Songs</Text>
      <FlatList
        data={songsList}
        renderItem={({ item, index }) => (
          <Song
            songInfo={item}
            actionText={"Add Song"}
            playSong={() => handlePlaySong(item, songsList, index)}
            actionFunction={handleAddSong}
          />
        )}
        keyExtractor={(song) => song.name.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  playlist: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 4,
    margin: 8,
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 20,
    color: "#064e3b",
  },
});

export default SongList;
