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
      <View style={[styles.container,{backgroundColor: theme.colors.background, shadowColor: theme.colors.accent}]}>
      <PlayList />
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    marginBottom: 20,
    paddingBottom: 20,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
});
