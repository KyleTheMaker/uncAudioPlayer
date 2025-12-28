/**
 * ***Component Information***
 * Licence/Royalty Free Music Source: https://pixabay.com/
 * Media Player component displays track info and allows track control
 *
 *
 * TODO:
 * Gesture handler conflict between "mouse" clicks and taps
 *  taps prevent moving to and from "advanced mode". add a toggle switch on player
 *  or control options through settings
 * 
 */
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Alert,
  Image,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Slider from "@react-native-community/slider";
import {
  Gesture,
  GestureDetector,
  LongPressGesture,
  PointerType,
  MouseButton,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import HelpModal from "./HelpModal";
import MediaButton from "./MediaButton";
import { SongContext, useSongPlayer } from "../context/SongContext";

const MediaPlayer = () => {
  const { currentSong, changeTrack } = useSongPlayer();

  const [isPlay, setIsPlay] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [formattedSongDuration, setFormattedSongDuration] = useState("0:00");
  const [advancedModeEnabled, setAdvancedModeEnabled] = useState(false);
  const [showHelpModal, setshowHelpModal] = useState(false);
  const [showVolume, setshowVolume] = useState(false);
  const player = useAudioPlayer(currentSong.location);
  const status = useAudioPlayerStatus(player).currentTime;
  const [currentVolume, setCurrentVolume] = useState(player.volume);
  const duration = player.duration;
  const coverImages = [
    require("../assets/vinyl-record.gif"),
    require("../assets/vinyl-record-static.png"),
  ];
  const [currentImage, setCurrentImage] = useState(coverImages[0]);
  const MAX_TRANSLATION_Y = 5000;

  const navigation = useNavigation();

  // update current time
  useEffect(() => {
    setCurrentTime(formatTime(status));
  }, [status]);

  // update song duration
  useEffect(() => {
    if (duration == 0) return;
    else setFormattedSongDuration(formatTime(duration));
  }, [duration]);

  // play when song changed
  useEffect(() => {
    if (currentSong.location) {
      player.replace(currentSong.location);
      player.play();
      setIsPlay(true);
    }
  }, [currentSong]);

  // change image when isPlay variable changed
  useEffect(() => {
    if (isPlay) {
      setCurrentImage(coverImages[0]);
    } else {
      setCurrentImage(coverImages[1]);
    }
  }, [isPlay]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedSecs = secs < 10 ? `0${Math.floor(secs)}` : Math.floor(secs);
    return `${mins}:${formattedSecs}`;
  };

  const handlePlayButton = () => {
    if (isPlay) {
      player.pause();
    } else {
      player.play();
    }

    setIsPlay((prevVal) => !prevVal);
  };

  const calculateVolumeChanges = (value) => {
    const clamped = Math.min(Math.abs(value), MAX_TRANSLATION_Y);
    const delta = clamped / MAX_TRANSLATION_Y;

    return value > 0 ? -delta : delta; // down = negative, up = positive
  };

  {
    /** Handle Mouse input for Gesture control */
  }

  const mouseTripleTap = Gesture.Tap()
    .maxDelay(250)
    .numberOfTaps(3)
    .mouseButton(MouseButton.LEFT)
    .onEnd(() => {
      //Logic to go to previous song
      changeTrack(-1);
    });

  const mouseDoubleTap = Gesture.Tap()
    .maxDelay(250)
    .numberOfTaps(2)
    .mouseButton(MouseButton.LEFT)
    .onEnd(() => {
      // Logic to go to next song
      changeTrack(1);
    });

  const mouseSingleTap = Gesture.Tap()
    .numberOfTaps(1)
    .mouseButton(MouseButton.LEFT)
    .onEnd(() => {
      // Logic for Pause/Play
      handlePlayButton();
    });

  {
    /** Handle user tap/general phone input for gesture control */
  }

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const { translationX, translationY } = e;

      if (Math.abs(translationY) > Math.abs(translationX)) {
        // Vertical swipe for volume control
        setshowVolume(true);
        let normalizedY = calculateVolumeChanges(translationY);

        setCurrentVolume((prevVal) => {
          let newVolume = prevVal + normalizedY;

          if (newVolume >= 1) newVolume = 1;
          else if (newVolume <= 0.1) newVolume = 0.1;

          return newVolume;
        });
        player.volume = currentVolume;
      }
    })
    .onEnd((e) => {
      const { translationX, translationY } = e;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe for track control
        if (translationX > 50) {
          changeTrack(1);
        } else if (translationX < -50) {
          changeTrack(-1);
        }
      } else {
        // Vertical swipe
        let normalizedY = calculateVolumeChanges(translationY);

        let newVolume = player.volume + normalizedY;

        if (newVolume >= 1) newVolume = 1;
        else if (newVolume <= 0) newVolume = 0.1;

        player.volume = newVolume;

        // Hide volume text after 2 seconds
        setTimeout(() => {
          setshowVolume(false);
        }, 1000);
      }
    });

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      player.seekTo(0);
    })
    .minDuration(750) // Minimum duration in milliseconds for the gesture to be recognized
    .maxDistance(10); // Maximum distance in points the finger can travel during the long press

  const tapGesture = Gesture.Tap().onStart(() => {
    handlePlayButton();
  });

  const doubleTap = Gesture.Tap()
    .maxDuration(500)
    .numberOfTaps(2)
    .onStart(() => {
      setAdvancedModeEnabled((previousState) => !previousState);
    });

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    if (e.scale > 1) {
      navigation.navigate("Playlist");
    }
  });

  const pinchAndPanGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const exclusiveGesture = Gesture.Exclusive(
    mouseTripleTap,
    mouseDoubleTap,
    mouseSingleTap,
    pinchAndPanGesture,
    longPressGesture,
    doubleTap,
    tapGesture,
  );

  const showHelp = () => {
    setshowHelpModal(true);
  };

  return (
    <>
      <HelpModal showHelp={showHelpModal} closeHelp={setshowHelpModal} />

      <View style={styles.helpContainer}>
        <Text style={{ fontWeight: "bold" }}>Advanced Mode</Text>
        <Pressable onPress={showHelp}>
          <Ionicons name={"help-circle-sharp"} size={24} />
        </Pressable>
      </View>

      <GestureDetector
        gesture={advancedModeEnabled ? exclusiveGesture : doubleTap}
      >
        <View style={styles.mediaPlayer}>
          <View style={styles.imageContainer}>
            <Image style={styles.coverImage} source={currentImage} />
          </View>

          <View style={styles.musicBarContainer}>
            <Text style={{ opacity: showVolume ? 1 : 0 }}>
              Volume: {Math.round(currentVolume * 100)}%
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text>{currentTime}</Text>
              <Text>{formattedSongDuration}</Text>
            </View>
            <Slider
              style={{ width: "100%", margin: 5 }}
              minimumValue={0}
              maximumValue={duration}
              step={1}
              value={status}
              onSlidingComplete={(value) => player.seekTo(value)}
              minimumTrackTintColor="#2e3299ff"
              maximumTrackTintColor="#000000"
            />
            <Text style={{ fontSize: 30, textAlign: "center", margin: 5 }}>
              {currentSong.name}
            </Text>
          </View>

          {!advancedModeEnabled && (
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
    // padding: 12,
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
    color: "#0f766e",
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
    color: "#065f46",
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
    color: "#022c22",
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
