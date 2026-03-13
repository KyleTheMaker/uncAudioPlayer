/**
 *
 *
 * ***Component Information***
 * This component is for a selectable song item
 * Song should get its pressable text from parent list
 * parent list dictates if Long Press should be add or remove
 *
 */

import { SongInfo } from "@/types/audio";
import { useState } from "react";
import { Pressable, Text, Image, StyleSheet, View, Alert } from "react-native";

interface SongProps {
  playSong: (song:SongInfo) => void;
  actionFunction: (song:SongInfo ) => void;
  actionText: string;
  songInfo: SongInfo;
}

const Song = ({playSong, actionFunction, actionText, songInfo}:SongProps) => {
  const [isVisible, setVisible] = useState(false);
  return (
    <View>
      <Pressable
        style={styles.songItem}
        onLongPress={() => {
          setVisible(!isVisible);
        }}
        onPress={() => {
          playSong(songInfo);
        }}
      >
        {isVisible && (
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              actionFunction(songInfo);
              Alert.alert(actionText + " " + songInfo.name);
              setVisible(!isVisible);
            }}
          >
            <Text style={styles.actionText}>{actionText}</Text>
          </Pressable>
        )}
        <Text style={styles.songName}>{songInfo.name}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  songItem: {
    backgroundColor: "#ecfdf5",
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064e3b",
    flexShrink: 1,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#dc2626",
    marginLeft: 8,
  },
  actionText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 12,
  },
});
export default Song;
