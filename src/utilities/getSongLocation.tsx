import { Directory, Paths, File } from "expo-file-system";
import { copyAsync } from "expo-file-system/legacy";
import { AudioAssetMap } from "@/data/musicdb";

export const getSongLocation = async (songLocation: string | number | null, name: string) => {

    if (!songLocation) return null;
    
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
        return null;
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