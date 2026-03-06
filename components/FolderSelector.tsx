/**
 * Folder holding music can be selected
 * audio/mp3 files from folder will be listed
 * clicking will play selected file
 * 
*/
import { Text, Button, FlatList, View, StyleSheet } from "react-native";
import { useSongPlayer } from "@/context/SongContext";
import { addSongToPlaylist } from "@/data/musicdb";
import { useSQLiteContext } from "expo-sqlite";
import { SongInfo } from "@/types/audio";
import { useFolderScanner } from "@/hooks/useFolderScanner";

import Song from "./Song";

const FolderSelector = () => {
  const { songs, loading, folderName, chooseFolder } = useFolderScanner();
  const { playNewSong } = useSongPlayer();
  const db = useSQLiteContext();  

  const handleAddSong = async (songItem: SongInfo) => {
    try {
      await addSongToPlaylist(db, {name:songItem.name, location:songItem.location});
    } catch (error) {
      console.log("error adding song to db: ", error);
    }
  };

  const handlePlaySong = async (songFile: SongInfo, listArray: SongInfo[], listIndex: number) => {
    try {
      playNewSong({
        name: songFile.name,
        location: songFile.location,
        listArray: listArray,
        listIndex: listIndex}
      );
    } catch (error) {
      console.error("error playing song", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {folderName ? `${folderName} Folder` : "No Folder Selected"}
      </Text>
      <Text>Select the music folder on your phone!</Text>
      <Button
        title={loading ? "Loading..." : "Choose Folder"}
        onPress={chooseFolder}
        disabled={loading}
      />
      <FlatList
        data={songs}
        renderItem={({ item, index }) => (
          <Song
            songInfo={item}
            actionText={"Add Song"}
            playSong={() => handlePlaySong(item, songs, index)}
            actionFunction={() => handleAddSong(item)}
          />
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginBottom: 10,
    marginStart: 8,
    marginEnd: 8,
    backgroundColor: "transparent",
    alignItems: "stretch",
    justifyContent: "center",
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 20,
    color: "#064e3b",
  },
});

export default FolderSelector;
