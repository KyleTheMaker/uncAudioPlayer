/**
 *
 * This Component is is to display the playList
 * longpressing song in playlist will enable button -
 * that button removes song from playlist (remove from playlist table)
 *
 *
 */

import { StyleSheet, Text, View, Pressable, FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect, useCallback } from "react";
import { getPlayListSongs, removeSongFromPlaylist } from "@/data/musicdb";
import { useFocusEffect } from "@react-navigation/native";
import { useSongPlayer } from "@/context/SongContext";
import { SongInfo } from "@/types/audio";
import { useThemeStyles } from "@/context/ThemeContext";

import Song from "./Song";

const PlayList = () => {
  const db = useSQLiteContext();
  const [songsList, setSongsList] = useState<SongInfo[]>([]);
  const { playNewSong } = useSongPlayer();
  const theme = useThemeStyles();

  //we're getting all songs from playlist table to display in a flatlist
  // useEffect(() => {
  //   loadSongs();
  // }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadSongs();
    }, [])
  );

  const loadSongs = async () => {
    const allSongs = await getPlayListSongs(db);
    const sortedSongs = allSongs.sort(function(a,b){
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if(x < y){return -1;}
      if(x > y){return 1;}
      return 0;
    });
    setSongsList(sortedSongs);
  };

  const handleRemoveSong = async (name: string) => {
    //remove chosen song from list
    const newList = songsList.filter((song) => song.name !== name);
    setSongsList(newList);
    try {
      await removeSongFromPlaylist(db, name);
    } catch (error) {
      console.log("Error removing song from db: ", error);
      loadSongs();
    }
  };

  const handlePlaySong = (songInfo: SongInfo, listArray: SongInfo[], listIndex: number) => {
    playNewSong({name: songInfo.name, location: songInfo.location, listArray, listIndex});
  };

  return (
    <View style={styles.playlist}>
      <Text style={[styles.title, {color: theme.colors.textPrimary}]}>Playlist</Text>
      <FlatList
        style={{ flex: 1 }}
        data={songsList}
        renderItem={({ item, index }) => (
          <Song
            songInfo={item}
            actionText={"Remove Song"}
            playSong={() =>
              handlePlaySong(item, songsList, index)
            }
            actionFunction={() => handleRemoveSong(item.name)}
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
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 20,
  },
  addRemove: {
    marginEnd: 2,
    backgroundColor: "#a7f3d0",
  },
});

export default PlayList;
