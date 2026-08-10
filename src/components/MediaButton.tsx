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
import { useThemeStyles } from "@/context/ThemeContext";

interface MediaButtonProps {
  pressOut: () => void;
  icon: ComponentProps<typeof Ionicons>['name'];
  size: number;
}

const MediaButton = ({pressOut, icon, size}: MediaButtonProps) => {
  const theme = useThemeStyles();
  return (
    <View>
      <Pressable style={[styles.pressBtn,{ backgroundColor: theme.colors.surface, shadowColor: theme.colors.accent}]} onPressOut={pressOut}>
        <Ionicons name={icon} size={size} color={theme.colors.accent} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pressBtn: {
    margin: 8,
    padding: 8,
    borderRadius: 40,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default MediaButton;
