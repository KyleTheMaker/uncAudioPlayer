/** uncMusicPlayer
 *
 *
 * The MediaPlayer Component handles song control and information
 *
 *
 */
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStyles } from "@/context/ThemeContext";


import MediaPlayer from "@/components/MediaPlayer";


export default function App() {
  const theme = useThemeStyles();
  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", overflow: "hidden",backgroundColor: theme.colors.background }}
    >
      <View style={[styles.container,{backgroundColor: theme.colors.surface, shadowColor: theme.colors.accent}]}>
        <MediaPlayer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});