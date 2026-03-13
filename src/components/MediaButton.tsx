/**
 * 
 * 
 * Button style for song control
 * used in Media Player
 * 
 * 
 */

import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, Dispatch, SetStateAction } from "react";

interface MediaButtonProps {
  pressOut: () => void;
  icon: ComponentProps<typeof Ionicons>['name'];
  size: number;
}

const MediaButton = ({pressOut, icon, size}: MediaButtonProps) => {
  return (
    <View>
      <Pressable style={styles.pressBtn} onPressOut={pressOut}>
        <Ionicons name={icon} size={size} color="#064e3b" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pressBtn: {
    margin: 8,
    padding: 8,
    borderRadius: 40,

    backgroundColor: "#a7f3d0",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default MediaButton;
