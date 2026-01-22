/**
 * This is for providing song information to
 * children components via context.
 *
 *  needs a context provider?
 *  and a way for song component to send back the chosen song
 *
 * // TODO: track full list of chosen directory songs
 *
 * // TODO: update song control function so they handle only loading
 * //   content songs as needed. Change track throws error because they're not loaded
 * //   maybe make a check function, or write checks into every other function
 */

import { createContext, useState, useContext, useEffect } from "react";
import { AudioAssetMap, getSongListSongs } from "../data/musicdb";
import { useSQLiteContext } from "expo-sqlite";
import { Directory, Paths, File } from "expo-file-system";
import { copyAsync } from "expo-file-system/legacy";

export const SongContext = createContext({
  currentSong: { location: null, name: "Nothing Playing" },
  playNewSong: () => {},
  isLoading: true,
});

export const SongProvider = ({ children }) => {
  const db = useSQLiteContext();
  const [isLoading, setIsLoading] = useState(true);
  const [playerState, setPlayerState] = useState({
    currentSong: {
      location: null,
      name: "Nothing Playing",
    },
    currentList: [],
    currentIndex: -1,
  });

  // Access database for any stored songs
  useEffect(() => {
    if (db && isLoading) {
      async function initializePlayer() {
        try {
          const initialList = await getSongListSongs(db);
          if (initialList && initialList.length > 0) {
            const firstSong = initialList[0];
            const firstAsset = AudioAssetMap[firstSong.location];

            if (firstAsset) {
              setPlayerState({
                currentSong: { location: firstAsset, name: firstSong.name },
                currentList: initialList,
                currentIndex: 0,
              });
            } else {
              console.error(
                "Asset not found for first song: ",
                firstSong.location,
              );
            }
          }
        } catch (error) {
          console.error("error loading initial song list:", error);
        } finally {
          setIsLoading(false);
        }
      }
      initializePlayer();
    }
  }, [db]);

  const { currentSong, currentList, currentIndex } = playerState;

  async function playNewSong(songLocation, songName, listArray, listIndex) {
    let asset = null;

    //This check is to determine where the song is coming from
    //local saved file, the app-provided songs, or from the custom playlist
    // TODO: consider moving content file copying and checking to it's own function

    if (
      typeof songLocation === "string" &&
      songLocation.startsWith("file://")
    ) {
      console.log("Playing local file:", songLocation);
      asset = songLocation;
    } else if (
      typeof songLocation === "string" &&
      songLocation.startsWith("content://")
    ) {
      //Copy the file from location
      console.log("Retrieving external song: ", songName);
      console.log("location from: ", songLocation);
      const localMusicDirectory = new Directory(
        Paths.document,
        "localMusicStorage",
      );
      if (!localMusicDirectory.exists) {
        await localMusicDirectory.create();
      }
      let targetSong = new File(localMusicDirectory, songName);
      try {
        if (!targetSong.exists) {
          await copyAsync({
            from: songLocation,
            to: targetSong.uri,
          });
          console.log("copied song to: ", targetSong);
        }
      } catch (copyError) {
        console.log(`Failed to copy ${songName}`, copyError);
      }
      asset = targetSong;
    } else if (AudioAssetMap[songLocation]) {
      asset = AudioAssetMap[songLocation];
    } else if (typeof songLocation === "number") {
      asset = songLocation;
    }
    if (asset) {
      //sets the require function in the location
      setPlayerState({
        currentSong: { location: asset, name: songName },
        currentList: listArray,
        currentIndex: listIndex,
      });
    } else {
      console.log("error finding song at location: ", songLocation);
    }
  }

  async function changeTrack(direction) {
    const { currentList, currentIndex } = playerState;

    if (currentList.length === 0) return;

    let newIndex = currentIndex + direction;

    if (newIndex >= currentList.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = currentList.length - 1;
    }
    console.log("current music list: ", currentList);
    const nextSong = currentList[newIndex];
    const songLocation = nextSong.location || nextSong.uri;
    console.log("Lookinf for song: ", nextSong.name);
    console.log("Location at: ", songLocation);
    if (!songLocation) {
      console.error("Location not found for next song: ", nextSong);
      return;
    }
    let asset = null;

    if (
      typeof songLocation === "string" &&
      songLocation.startsWith("file://")
    ) {
      console.log("Playing local file:", songLocation);
      asset = songLocation;
    } else if (
      typeof songLocation === "string" &&
      songLocation.startsWith("content://")
    ) {
      //Copy the file from location
      console.log("Retrieving external song: ", nextSong.name);
      console.log("location from: ", songLocation);
      const localMusicDirectory = new Directory(
        Paths.document,
        "localMusicStorage",
      );
      if (!localMusicDirectory.exists) {
        await localMusicDirectory.create();
      }
      let targetSong = new File(localMusicDirectory, nextSong.name);
      try {
        if (!targetSong.exists) {
          await copyAsync({
            from: songLocation,
            to: targetSong.uri,
          });
          console.log("copied song to: ", targetSong);
        }
      } catch (copyError) {
        console.log(`Failed to copy ${nextSong.name}`, copyError);
      }
      console.log("song already exists");
      asset = targetSong;
    } else if (AudioAssetMap[songLocation]) {
      asset = AudioAssetMap[songLocation];
    } else if (typeof songLocation === "number") {
      asset = songLocation;
    }
    if (asset) {
      setPlayerState({
        currentSong: { location: asset, name: nextSong.name },
        currentList: currentList,
        currentIndex: newIndex,
      });
    } else {
      console.error("location not found for next song: ", songLocation);
    }
  }

  const contextValue = {
    currentSong,
    playNewSong,
    changeTrack,
    isLoading,
  };

  return (
    <SongContext.Provider value={contextValue}>{children}</SongContext.Provider>
  );
};

export const useSongPlayer = () => useContext(SongContext);
