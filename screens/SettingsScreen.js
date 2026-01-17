/**
 * TODO:
 *  - THIS PAGE DOES NOTHING RELATIVE TO THE REST OF THE APP
 * FIX THAT!
 *  - This should only contain broader components, refactor 
 * and simplify into more standard components
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import BluetoothScanButton from "../components/BluetoothScanButton";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [shuffleByDefault, setShuffleByDefault] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  const mockDevices = [
    { id: "AA:BB:CC:DD:01", name: "Sony WH-1000XM4" },
    { id: "AA:BB:CC:DD:02", name: "AirPods Pro" },
    { id: "AA:BB:CC:DD:03", name: "JBL Speaker" },
    { id: "AA:BB:CC:DD:04", name: "Car Bluetooth" },
  ];

  const startMockScan = () => {
    setScanning(true);
    setDevices([]);

    setTimeout(() => {
      setDevices(mockDevices);
      setScanning(false);
    }, 3000);
  };

  const handleReset = () => {
    setDarkMode(false);
    setHighQuality(true);
    setShuffleByDefault(false);
    setNotifications(true);
    setDevices([]);

    Alert.alert("Settings Reset", "All settings have been reset to default.");
  };

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

      <View style={styles.row}>
        <Text style={[styles.label, darkMode && styles.darkText]}>
          High Quality Audio
        </Text>
        <Switch value={highQuality} onValueChange={setHighQuality} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, darkMode && styles.darkText]}>
          Shuffle by Default
        </Text>
        <Switch value={shuffleByDefault} onValueChange={setShuffleByDefault} />
      </View>

      {/* GENERAL */}
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        General
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, darkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, darkMode && styles.darkText]}>
          Notifications
        </Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* BLUETOOTH */}
      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Bluetooth
      </Text>

      <BluetoothScanButton scanning={scanning} onPress={startMockScan} />

      <Text style={[styles.subText, darkMode && styles.darkText]}>
        Found devices: {devices.length}
      </Text>

      <FlatList
        scrollEnabled={false}
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceRow}>
            <Text
              style={[
                styles.deviceName,
                darkMode && { color: "#ecfdf5" },
              ]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.deviceId,
                darkMode && { color: "#bfdbfe" },
              ]}
            >
              {item.id}
            </Text>
          </View>
        )}
      />

      {/* RESET BUTTON */}
      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetText}>Reset All Settings</Text>
      </TouchableOpacity>

      {/* SUMMARY */}
      <View
        style={[
          styles.summaryBox,
          darkMode && styles.summaryBoxDark,
        ]}
      >
        <Text
          style={[
            styles.summaryTitle,
            darkMode && { color: "#ecfdf5" },
          ]}
        >
          Current Settings
        </Text>
        <Text
          style={[
            styles.summaryText,
            darkMode && { color: "#ecfdf5" },
          ]}
        >
          Theme: {darkMode ? "Dark" : "Light"}
        </Text>
        <Text
          style={[
            styles.summaryText,
            darkMode && { color: "#ecfdf5" },
          ]}
        >
          Audio: {highQuality ? "High Quality" : "Standard"}
        </Text>
        <Text
          style={[
            styles.summaryText,
            darkMode && { color: "#ecfdf5" },
          ]}
        >
          Shuffle by Default: {shuffleByDefault ? "On" : "Off"}
        </Text>
        <Text
          style={[
            styles.summaryText,
            darkMode && { color: "#ecfdf5" },
          ]}
        >
          Notifications: {notifications ? "Enabled" : "Disabled"}
        </Text>
      </View>

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

