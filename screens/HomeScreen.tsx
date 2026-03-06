/** HomeScreen
 * currently displays songs from SongList
 *
 *
 */

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { SongInfo } from "@/types/audio";

import SongList from "../components/SongList";
import FolderSelector from "../components/FolderSelector";

export default function App() {
  // const [playSong, setPlaySong] = useState("");

  // function setSong(song: SongInfo) {
  //   setPlaySong(song);
  // }

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <View style={styles.container}>
        <Header />
      </View>
      <View style={{flex: 1, marginVertical: 8}}>
        <SongList />
      </View>
      <View style={{flex:1, marginVertical: 8}}>
        <FolderSelector />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const Header = () => {
  return (
    <View style={styles.headerWrapper}>
      <Text
        style={styles.headerTitle}
      >
        uncMusicPlayer
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f0fdfa",
  },
  container: {
    paddingBottom: 10,
    marginBottom: 4,
  },
  headerWrapper: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#a7f3d0",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: "#064e3b",
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  button: {
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
