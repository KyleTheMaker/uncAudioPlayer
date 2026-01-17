import { Text, Button, Image, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Directory, Paths, File } from "expo-file-system";
import { copyAsync } from "expo-file-system/legacy";
import { useSongPlayer } from "../context/SongContext";
import { addSongToPlaylist } from "../data/musicdb";
import { useSQLiteContext } from "expo-sqlite";

import Song from "./Song";
import { FlatList } from "react-native-gesture-handler";

/**
 * Folder holding music can be selected
 * audio/mp3 files from folder will be listed
 * clicking will play selected file
 * 
 * 
 * TODO:
 * Consider Methods where copying full folder isn't 
 * necessary and can be loaded upon individual song selection
 *
 */

const FolderSelector = () => {
  const [chosenFolder, setChosenFolder] = useState("");
  const [localSongs, setLocalSongs] = useState([]);
  const [localSongUri, setLocalSongUri] = useState();
  const [songsList, setSongsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { playNewSong } = useSongPlayer();

  const db = useSQLiteContext();

  const chooseFolder = async () => {
    setLoading(true);
    setLocalSongs([]);
    try {
      const directory = await Directory.pickDirectoryAsync();
      if (directory.canceled) {
        setLoading(false);
        return;
      }
      setChosenFolder(directory.name);
      const directoryItems = directory.list().filter((item) => {
        return item instanceof File && item.type == "audio/mpeg";
      });

      const localMusicDirectory = new Directory(
        Paths.document,
        "localMusicStorage"
      );
      if (!localMusicDirectory.exists) {
        await localMusicDirectory.create();
      }

      const correctedSongs = await Promise.all(
        directoryItems.map(async (item) => {
          const originalName = item.name;
          const safeName = originalName.replace(/[^\w\s\-\.]/g, "");

          let targetSong = new File(localMusicDirectory, safeName);
          if (!targetSong.exists) {
            try {
              await copyAsync({
                from: item.uri,
                to: targetSong.uri,
              });
            } catch (copyError) {
              console.log(`Failed to copy ${originalName}`, copyError);
            }
          }
          return {
            name: item.name,
            location: targetSong.uri,
            externalUri: item.uri,
          };
        })
      );
      setLocalSongs(correctedSongs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async (songItem) => {
    try {
      await addSongToPlaylist(db, songItem.name, songItem.location);
    } catch (error) {
      console.log("error adding song to db: ", error);
    }
  };

  const handlePlaySong = async (songFile, listArray, listIndex) => {
    try {
      playNewSong(songFile.location, songFile.name, listArray, listIndex);
    } catch (error) {
      console.error("error playing song", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {chosenFolder ? `${chosenFolder} Folder Songs` : "No Folder Selected"}
      </Text>
      <Button
        title={loading ? "Loading..." : "Choose Folder"}
        onPress={chooseFolder}
        disabled={loading}
      />
      <Text>Select the music folder on your phone!</Text>
      <FlatList
        data={localSongs}
        renderItem={({ item, index }) => (
          <Song
            songName={item.name}
            actionText={"Add Song"}
            songLocation={item.location}
            playSong={() => handlePlaySong(item, localSongs, index)}
            actionFunction={() => handleAddSong(item)}
          />
        )}
        keyExtractor={(item) => item.location}
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
