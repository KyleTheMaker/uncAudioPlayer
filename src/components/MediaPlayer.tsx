/**
 * ***Component Information***
 * Licence/Royalty Free Music Source: https://pixabay.com/
 * Media Player component displays track info and allows track control
 * 
 */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { useState, useEffect, act } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Slider from "@react-native-community/slider";
import { GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerGestures } from "@/hooks/usePlayerGestures";
import { useThemeStyles } from "@/context/ThemeContext";

import HelpModal from "@/components/HelpModal";
import MediaButton from "@/components/MediaButton";
import { useSongPlayer } from "@/context/SongContext";
import { useMediaControls } from "@/context/MediaControlContext";
import { useTheme } from "@react-navigation/native";

const MediaPlayer = () => {
  const { currentSong, changeTrack} = useSongPlayer();
  const { mediaControls } = useMediaControls();
  const theme = useThemeStyles();

  const [isPlay, setIsPlay] = useState(true);
  const [showHelpModal, setshowHelpModal] = useState(false);
  const [ showVolume, setShowVolume] = useState(false);

  const player = useAudioPlayer(currentSong.location);
  const status = useAudioPlayerStatus(player).currentTime;
  const [currentVolume, setCurrentVolume] = useState(player.volume);
  const duration = player.duration;
  const coverImages = [
    require("@/assets/vinyl-record.gif"),
    require("@/assets/vinyl-record-static.png"),
  ];

  // play when song changed
  useEffect(() => {
    if (currentSong.location) {
      player.replace(currentSong.location);
      player.play();
      setIsPlay(true);
    }
  }, [currentSong]);

  const formatTime = (totalSeconds: number) => {
    if(!totalSeconds) return "0:00";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedSecs = secs < 10 ? `0${Math.floor(secs)}` : Math.floor(secs);
    return `${mins}:${formattedSecs}`;
  };

  const currentTime = formatTime(status);
  const formattedSongDuration = formatTime(duration);
  const currentImage = isPlay ? coverImages[0] : coverImages[1];

  const handlePlayButton = () => {
    if (isPlay) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlay((prevVal) => !prevVal);
  };

  // Manage track control types
  const { swipeGestures, mouseGestures, noGestures} = usePlayerGestures({
    player,
    handlePlayButton,
    setShowVolume,
    setCurrentVolume
  });

  const showHelp = () => {
    setshowHelpModal(true);
  };

  const activeGesture = () => {
    if(mediaControls.GestureControl){ 
      console.log("Swipe Gestures Selected.");
      return swipeGestures};
    if(mediaControls.MouseControl){
      console.log("Mouse Gestures Selected.");
      return mouseGestures};
    if(mediaControls.ButtonControl){
      return noGestures;
    }
    return noGestures;
  }

  return (
    <>
      <HelpModal showHelp={showHelpModal} closeHelp={setshowHelpModal} />

      <View style={styles.helpContainer}>
        <Text style={[styles.advancedLabel,{ color: theme.colors.textPrimary }]}>Advanced Mode</Text>
        <Pressable onPress={showHelp}>
          <Ionicons style={{color: theme.colors.textPrimary}} name={"help-circle-sharp"} size={24} />
        </Pressable>
      </View>

      <GestureDetector gesture={activeGesture()} >
        <View style={styles.mediaPlayer}>
          <View style={styles.imageContainer}>
            <Image style={styles.coverImage} source={currentImage} />
          </View>

          <View style={styles.musicBarContainer}>
            <Text style={[styles.volumeText,{ opacity: showVolume ? 1 : 0, color: theme.colors.textPrimary }]}>
              Volume: {Math.round(currentVolume * 100)}%
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={[styles.timeText, {color: theme.colors.textPrimary}]}>{currentTime}</Text>
              <Text style={[styles.timeText, {color: theme.colors.textPrimary}]}>{formattedSongDuration}</Text>
            </View>
            <Slider
              style={{ width: "100%", margin: 5 }}
              minimumValue={0}
              maximumValue={duration}
              step={1}
              value={status}
              onSlidingComplete={(value) => player.seekTo(value)}
              minimumTrackTintColor= {theme.colors.accent}
              maximumTrackTintColor={theme.colors.background}
            />
            <Text style={[styles.songTitle, {color: theme.colors.textPrimary}]}>
              {currentSong.name}
            </Text>
          </View>

          {mediaControls.ButtonControl && (
            <View style={styles.buttonContainer}>
              <View style={styles.buttonRowContainer}>
                <MediaButton
                  icon="play-skip-back"
                  size={50}
                  pressOut={() => {
                    changeTrack(-1);
                  }}
                />
                <MediaButton
                  icon={isPlay ? "pause-circle" : "play-circle"}
                  size={70}
                  pressOut={handlePlayButton}
                />
                <MediaButton
                  icon="play-skip-forward"
                  size={50}
                  pressOut={() => {
                    changeTrack(1);
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  mediaPlayer: {
    flex: 1,
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
    gap: 6,
  },
  advancedLabel: {
    fontWeight: "bold",
    marginRight: 3,
    color: "#064e3b",
  },
  imageContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  coverImage: {
    width: 260,
    height: 260,
    borderRadius: 20,
    resizeMode: "cover",
  },
  musicBarContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
  },
  volumeText: {
    fontWeight: "600",
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
  },
  slider: {
    width: "100%",
    marginVertical: 6,
  },
  songTitle: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 6,
    fontWeight: "700",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MediaPlayer;
