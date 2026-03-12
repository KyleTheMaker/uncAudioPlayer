/**
 * // TODO: THIS PAGE DOES NOTHING RELATIVE TO THE REST OF THE APP FIX THAT!
 *  - This should only contain broader components, refactor 
 * and simplify into more standard components
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

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [shuffleByDefault, setShuffleByDefault] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView
      style={[styles.container, darkMode && styles.darkBg]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[styles.header, darkMode && styles.darkText]}>Settings</Text>

      
      {/* PLAYBACK */}
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Playback
      </Text>
      
      <MediaControlSelections />


      <StatusBar style={darkMode ? "light" : "dark"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0fdfa", // mint-50
  },
  darkBg: {
    backgroundColor: "#022c22",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#064e3b",
    marginTop: 24,
  },
  darkText: {
    color: "#ecfdf5",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginTop: 20,
    color: "#047857",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#064e3b",
  },
  subText: {
    marginTop: 8,
    color: "#0f766e",
  },
  deviceRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccfbf1",
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#022c22",
  },
  deviceId: {
    fontSize: 12,
    color: "#0f766e",
  },
  resetBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#0f766e",
    alignItems: "center",
  },
  resetText: {
    color: "#ecfdf5",
    fontWeight: "600",
    fontSize: 15,
  },
  summaryBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    backgroundColor: "#ecfdf5",
  },
  summaryBoxDark: {
    borderColor: "#0d9488",
    backgroundColor: "#064e3b",
  },
  summaryTitle: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#065f46",
  },
  summaryText: {
    fontSize: 14,
    color: "#064e3b",
  },
});

