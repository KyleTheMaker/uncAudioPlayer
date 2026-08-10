import { View, Text, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";


import PlayList from "@/components/PlayList";
import { useTheme } from "@react-navigation/native";
import { useThemeStyles } from "@/context/ThemeContext";

export default function PlaylistScreen() {
  const theme = useThemeStyles();

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", overflow: "hidden", backgroundColor: theme.colors.background }}
    >
      <PlayList />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#261a68",
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 18,
    borderRadius: 20,

    backgroundColor: "#a7f3d0",

    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});
