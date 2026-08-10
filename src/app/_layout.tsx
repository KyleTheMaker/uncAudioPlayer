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

import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SongProvider } from "@/context/SongContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SQLiteProvider } from "expo-sqlite";
import { Tabs } from "expo-router";

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
                <Tabs>
                <Tabs.Screen
                    name='index'
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarLabel: "Index",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name='home' size={size} color={color} />
                        )}}
                />
                <Tabs.Screen
                    name="PlayListScreen"
                    options={{
                        title: "Playlist",
                        headerShown: false,
                        tabBarLabel: "Playlist",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name='albums' size={size} color={color} />
                        )}}
                    />
                <Tabs.Screen
                    name="MediaPlayerScreen"
                    options={{
                        title:"Audio Player", 
                        headerShown: false,
                        tabBarLabel: "Player",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name='musical-notes' size={size} color={color} />
                        )
                    }}
                        />
                <Tabs.Screen
                    name="SettingsScreen"
                    options={{
                        title:"Settings", 
                        headerShown: false,
                        tabBarLabel: "Settings",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name='settings' size={size} color={color} />
                        )
                    }}
                />
            </Tabs>
            </ThemeProvider>
            </SongProvider>
          </MediaControlProvider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
