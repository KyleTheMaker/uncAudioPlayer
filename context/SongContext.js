/**
 * This is for providing song information to
 * children components via context.
 *
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
    // Locate the song
    const asset = await songLocator(songLocation, songName);
    // Set the song to the player state
    if (asset) {
      setPlayerState({
        currentSong: { location: asset, name: songName },
        currentList: listArray,
        currentIndex: listIndex,
      });
    } else {
      console.log("error finding song at location: ", songLocation);
    }
  }

  // determines where the song is coming from and returns the location
  const songLocator = async (songLocation, name) => {
    
    if (
      //stored in app
      typeof songLocation === "string" &&
      songLocation.startsWith("file://") 
    ) {
      return songLocation;
    } else if (
      //stored on device
      typeof songLocation === "string" &&
      songLocation.startsWith("content://") 
    ) {
      //Copy the file from device to local
      const localMusicDirectory = new Directory(
        Paths.document,
        "localMusicStorage",
      );
      if (!localMusicDirectory.exists) {
        await localMusicDirectory.create();
      }
      let targetSong = new File(localMusicDirectory, name);
      try {
        if (!targetSong.exists) {
          await copyAsync({
            from: songLocation,
            to: targetSong.uri,
          });
          console.log("copied song to: ", targetSong);
        }
      } catch (copyError) {
        console.log(`Failed to copy ${name}`, copyError);
      }
      console.log("playing song from local directory", localMusicDirectory.uri);
      return targetSong.uri;
    } else if (AudioAssetMap[songLocation]) {
      // hardcoded in app
      return AudioAssetMap[songLocation];
    } else if (typeof songLocation === "number") {
      // handle other cases
      return songLocation;
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
    const nextSong = currentList[newIndex];
    const songLocation = nextSong.location || nextSong.uri;
    if (!songLocation) {
      console.error("Location not found for next song: ", nextSong);
      return;
    }
    
    // get song and location
    const asset = await songLocator(songLocation, nextSong.name);
    
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
