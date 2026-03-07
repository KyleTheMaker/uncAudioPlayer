/** uncMusicPlayer
 *
 *
 * The MediaPlayer Component handles song control and information
 *
 *
 */
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import MediaPlayer from "@/components/MediaPlayer";


export default function App() {
  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", overflow: "hidden" }}
    >
      <View style={styles.container}>
        <MediaPlayer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    borderRadius: 22,

    // Nice smooth sky color
    backgroundColor: "#bae6fd",

    // Soft drop shadow
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});