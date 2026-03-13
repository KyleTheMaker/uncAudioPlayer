/**
 * This is for providing song information to
 * children components via context.
 * 
 * // TODO: explore background audio playback options with:
 *    import { setAudioModeAsync } from 'expo-audio';
 *    Configure audio for background playback with mixing
 *    await setAudioModeAsync({
 *    playsInSilentMode: true,
 *    shouldPlayInBackground: true,
 *    interruptionMode: 'mixWithOthers'
 *     });
 *
 */

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { getSongListSongs, SongDBItem } from '@/data/musicdb';
import { useSQLiteContext } from "expo-sqlite";
import { SongInfo, AudioData } from "@/types/audio";
import { getSongLocation } from "@/utilities/getSongLocation";

interface PlayerState {
  currentSong: SongInfo;
  currentList: SongInfo[];
  currentIndex: number;
}

interface SongContextType {
  currentSong: SongInfo;
  playNewSong: (audioData: AudioData) => Promise<void>;
  changeTrack: (direction: number) => Promise<void>;
  isLoading: boolean;
}

export const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider = ({ children }:{children: ReactNode}) => {
  const db = useSQLiteContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: {
      location: null,
      name: "Nothing Playing",
    },
    currentList: [],
    currentIndex: -1,
  });

  // Access database for any Playlist songs
  useEffect(() => {
    if (db && isLoading) {
      async function initializePlayer() {
        try {
          const initialList = await getSongListSongs(db);
          if (initialList && initialList.length > 0) {
            const firstSong: SongDBItem = initialList[0];
            const firstAsset = await getSongLocation(firstSong.location,firstSong.name);

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

  async function playNewSong(newSong: AudioData) {
    // Locate the song
    const asset = await getSongLocation(newSong.location, newSong.name);
    // Set the song to the player state
    if (asset) {
      setPlayerState({
        currentSong: { location: asset, name: newSong.name },
        currentList: newSong.listArray,
        currentIndex: newSong.listIndex,
      });
    } else {
      console.log("error finding song at location: ", newSong.location);
    }
  }

  async function changeTrack(direction: number) {
    const { currentList, currentIndex } = playerState;

    if (currentList.length === 0) return;

    let newIndex = currentIndex + direction;

    if (newIndex >= currentList.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = currentList.length - 1;
    }
    const nextSong = currentList[newIndex];
    const songLocation = nextSong.location;
    if (!songLocation) {
      console.error("Location not found for next song: ", nextSong);
      return;
    }
    
    // get song and location
    const asset = await getSongLocation(songLocation, nextSong.name);
    
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
    <SongContext.Provider value={contextValue}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongPlayer = () => {
  const context = useContext(SongContext);
    if (!context){
      throw new Error("useSongPlayer must be used within a SongContextProvider");
    }
    return context;
}
