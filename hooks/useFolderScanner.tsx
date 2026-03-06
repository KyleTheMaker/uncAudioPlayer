//takes care of the folder selection logic

import { SongInfo } from "@/types/audio";
import { useState } from "react";
import { Directory, Paths, File } from "expo-file-system";

export const useFolderScanner = () => {
    const [songs, setLocalSongs] = useState<SongInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [folderName, setFolderName] = useState<string>("");

      //  TODO: Consider Methods where copying full folder isn't 
  //    necessary and can be loaded upon individual song selection
  //    New Folder Logic select a folder containing music list out all audio/mpeg files
  //    only download/copy file from device as user requests.moving to next song will have 
  //    to see if it's already copied, or should be re-copied.
    const chooseFolder = async () => {
        setLoading(true);
        setLocalSongs([]);
    
        try {
          const directory = await Directory.pickDirectoryAsync() as Directory;
          if (!directory) {
            setLoading(false);
            return;
          }
    
          setFolderName(directory.name || "Unknown Folder");
    
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
    
          // Sanitize song names, then copy each 
          // corrected song into correctedSongs
          const correctedSongs: SongInfo[] = await Promise.all(
            directoryItems.map(async (item) => {
              const originalName = item.name;
              const safeName = originalName.replace(/[^\w\s\-\.]/g, "");
              return {
                name: safeName,
                location: item.uri,
              };
            })
          );
    
          setLocalSongs(correctedSongs);
        } catch (error: any) {
          if (error?.message?.includes("cancelled by the user")){
            console.log("User cancelled folder selection.")
          }else{
          console.error(error);
          }
        } finally {
          setLoading(false);
        }
      };

      return { songs, loading, folderName, chooseFolder };
    }
