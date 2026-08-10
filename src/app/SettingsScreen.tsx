/**
 * // TODO: implement the dark/light mode control and remove
 * previous darkmode references.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MediaControlSelections } from "@/components/MediaControlSelections";
import { ThemeStyleSelections } from "@/components/ThemeSelections";
import { useThemeStyles } from "@/context/ThemeContext";


export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [shuffleByDefault, setShuffleByDefault] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const theme = useThemeStyles();

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.header,{color: theme.colors.textPrimary}]}>Settings</Text>

      
      {/* PLAYBACK */}
      <Text style={[styles.sectionTitle,{color: theme.colors.textSecondary}]}>
        Playback
      </Text>
      
      <MediaControlSelections />
      <ThemeStyleSelections />


      <StatusBar style={"auto"} />
    </ScrollView>
  );
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // mint-50
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
  },
  subText: {
    marginTop: 8,
    color: "#0f766e",
  },
});

