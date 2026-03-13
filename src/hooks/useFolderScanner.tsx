/*
* takes care of the folder selection logic
* Batch processing of 200 files per batch is used
* to keep UI from freezing
*/

import { SongInfo } from "@/types/audio";
import { useState, useEffect, useRef } from "react";
import { Directory, Paths, File } from "expo-file-system";

export const useFolderScanner = () => {
    const [songs, setLocalSongs] = useState<SongInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [folderName, setFolderName] = useState<string>("");
    const isMounted = useRef(true);
    
    useEffect(() => {
      return () => {
        isMounted.current = false;
      }
    },[]);
    
    //  TODO: Consider Methods where copying full folder isn't 
    //    necessary and can be loaded upon individual song selection
    //    New Folder Logic select a folder containing music list out all audio/mpeg files
    //    only download/copy file from device as user requests.moving to next song will have 
    //    to see if it's already copied, or should be re-copied.
    const chooseFolder = async () => {
      setLoading(true);
      setLocalSongs([]);
      const BATCH_SIZE = 200;
      let currentIndex = 0;
    
        try {
          const directory = await Directory.pickDirectoryAsync() as Directory;
          if (!directory) {
            setLoading(false);
            return;
          }
    
          setFolderName(directory.name || "Unknown Folder");
    
          const directoryItems = directory.list();
          
          const processBatch = () => {
            if(!isMounted.current) return;

            const currentBatch: SongInfo[] = [];
            const endIndex = Math.min(currentIndex + BATCH_SIZE, directoryItems.length);

            for (let i= currentIndex; i < endIndex; i++){
              const item = directoryItems[i];
              if(item instanceof File && (item.type == "audio/mpeg" || item.name.endsWith(".mp3"))){
                const originalName = item.name;
                const safeName = originalName.replace(/[^\w\s\-\.]/g, "");
                currentBatch.push({ 
                name: safeName,
                location: item.uri,
              });
              }
            }

            // if anything loaded to current batch, add it to end of local songs
            if(currentBatch.length > 0){
              setLocalSongs((prev) => [...prev,...currentBatch]);
            }

            currentIndex = endIndex;
            if (currentIndex < directoryItems.length){
              //schedule next batch to run after a UI update
              setTimeout(processBatch, 0);
            } else {
              setLoading(false);
            }
          };

          processBatch();
    
        } catch (error: any) {
          if (error?.message?.includes("cancelled by the user")){
            console.log("User cancelled folder selection.")
          }else{
          console.error(error);
          }
        } finally {
          if (isMounted.current) setLoading(false);
        }
      };

      return { songs, loading, folderName, chooseFolder };
    }
