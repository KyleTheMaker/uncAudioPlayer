import { Ionicons } from "@expo/vector-icons";
import { useThemeStyles } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import { View } from "react-native";




export default function AppTabs() {
    const theme = useThemeStyles();
return (
    <Tabs 
        screenOptions={{
            tabBarStyle: {
                backgroundColor: theme.colors.background,
                borderTopColor: "transparent",
                elevation: 0,
            },
            
            tabBarActiveTintColor: theme.colors.accent,
            tabBarInactiveTintColor: theme.colors.primary
        }}
    >
        <Tabs.Screen
            name='index'
            options={{
                title: "Home",
                headerShown: false,
                tabBarLabel: "Index",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='home' size={size} />
                )}}
        />
        <Tabs.Screen
            name="PlayListScreen"
            options={{
                title: "Playlist",
                headerShown: false,
                tabBarLabel: "Playlist",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='albums' size={size} />
                )}}
            />
        <Tabs.Screen
            name="MediaPlayerScreen"
            options={{
                title:"Audio Player", 
                headerShown: false,
                tabBarLabel: "Player",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='musical-notes' size={size} />
                )
            }}
                />
        <Tabs.Screen
            name="SettingsScreen"
            options={{
                title:"Settings", 
                headerShown: false,
                tabBarLabel: "Settings",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='settings' size={size} />
                )
            }}
        />
    </Tabs>
)}