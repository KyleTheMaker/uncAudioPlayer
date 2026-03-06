/**
 *
 *
 * ***Component Information***
 * This component is for a selectable song item
 * Song should get its pressable text from parent list
 * parent list dictates if Long Press should be add or remove
 *
 */

import { useState } from "react";
import { Pressable, Text, Image, StyleSheet, View, Alert } from "react-native";

const Song = (props) => {
  const [isVisible, setVisible] = useState(false);
  return (
    <View>
      <Pressable
        style={styles.songItem}
        onLongPress={() => {
          setVisible(!isVisible);
        }}
        onPress={() => {
          props.playSong(props.songLocation, props.songName);
        }}
      >
        {isVisible && (
          <Pressable
            style={styles.pressRemove}
            onPress={() => {
              props.actionFunction(props.songName, props.songLocation);
              Alert.alert(props.actionText + " " + props.songName);
              setVisible(!isVisible);
            }}
          >
            <Text>{props.actionText}</Text>
          </Pressable>
        )}
        <Text>{props.songName}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 5,
  },
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
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#a7f3d0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064e3b",
    flexShrink: 1,
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#dc2626",
    marginLeft: 8,
  },
  removeText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 12,
  },
});
export default Song;
