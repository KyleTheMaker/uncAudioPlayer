/** HomeScreen
 * currently displays songs from SongList
 *
 *
 */

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStyles } from "@/context/ThemeContext";

import SongList from "../components/SongList";
import FolderSelector from "../components/FolderSelector";

export default function App() {

  const theme = useThemeStyles();

  return (
    <SafeAreaView
      style={[styles.screen,{backgroundColor: theme.colors.background}]}
    >
      <View style={styles.container}>
        <Header />
      </View>
      <View style={styles.listContainer}>
        <SongList />
      </View>
      <View style={styles.listContainer}>
        <FolderSelector />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const Header = () => {
  const theme = useThemeStyles();
  return (
    <View style={[styles.headerWrapper,{backgroundColor: theme.colors.primary}]}>
      <Text
        style={[styles.headerTitle, {color: theme.colors.textPrimary}]}
      >
        uncMusicPlayer
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingBottom: 10,
    marginBottom: 4,
  },
  listContainer: {
    flex: 1,
    marginVertical: 8
  },
  headerWrapper: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 18,
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
