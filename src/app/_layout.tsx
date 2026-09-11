/** uncMusicPlayer
 *
 * Play from our default songs, or ones stored on your device
 * Create your own playlist from your favourite songs
 * Select from multiple song control methods like:
 * - Buttons
 * - Screen Gestures
 *
 *
 */

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SongProvider } from "@/context/SongContext";
import { ThemeProvider} from "@/context/ThemeContext";
import  AppTabs  from "@/components/Tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";

import { manageDBIfNeeded } from "@/data/musicdb";
import { MediaControlProvider } from "@/context/MediaControlContext";

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SQLiteProvider databaseName="uncMusic.db" onInit={manageDBIfNeeded}>
            <MediaControlProvider>
            <SongProvider>
              <ThemeProvider>
                <AppTabs />           
              </ThemeProvider>
            </SongProvider>
          </MediaControlProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
