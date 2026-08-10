# **UncMusicPlayer**

This music player offers track control through touch buttons, gestures, and BT Mouse input.

## Components
1. Song  
A pressable item with a longpress function that opens a customizable button. the main onPress function is intended to play selected song.

2. MediaButton  
A pressable button with customizable text and function. intended for song controls(Play, Pause, Next, etc.).

3. MediaPlayer  
A Component for controlling and displaying the current song, and navigating the current playlist.

4. Playlist  
A customizable list of songs chosen by the user.

5. Songlist  
A list of all songs in the app

6. FileSelector  
A way to select a music folder from your device, and use that for the audio player.  

7. HelpModal  
Presents advanced mode instructions.  

8. BluetoothScanButton  
A component for styling a bluetooth scanner button
# Combined Components Description  
 - MediaPlayer uses the MediaButton for touch control  
 - SongList and Playlist both use the song component for listing out all songs 

## Resources:

**Create project:**  
npx create-expo-app@latest --template blank  
npx expo start --tunnel (for lab computers since they use diff network)  
npx expo start (for home use)

**Safe Area context for mobile screens:**  
https://appandflow.github.io/react-native-safe-area-context/

**Expo Audio:**  
https://docs.expo.dev/versions/latest/sdk/audio/

**React Community Slider (Song Tracking):**  
https://github.com/callstack/react-native-slider#installation--usage

**Expo SQLite (song and playlist storage):**  
https://docs.expo.dev/versions/latest/sdk/sqlite/  
https://github.com/OmonUrkinbaev/SQLiteExampleApp/tree/master
https://docs.expo.dev/versions/latest/sdk/sqlite/

**Expo Vector Icons:**  
https://docs.expo.dev/guides/icons/

**Tabs Navigator**  
https://reactnavigation.org/docs/bottom-tab-navigator/?config=dynamic

**Gesture Handler**  
https://docs.swmansion.com/react-native-gesture-handler/docs/  
Run `npx expo prebuild` after installing

**Assets**  
https://pixabay.com/gifs/record-retro-vinyl-music-8329/

**Expo FileSystem**  
npx expo install expo-file-system
https://docs.expo.dev/versions/v53.0.0/sdk/filesystem/