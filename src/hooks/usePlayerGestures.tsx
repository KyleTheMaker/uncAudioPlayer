/**
 * This player gestures hook defines the gesture logic for
 * each type of gesture input: buttons, swipe gestures, tap gestures.
 * Future input types: voice command, visual gesture command
 * 
 * //TODO: Gesture handler conflict between "mouse" clicks and taps
 * taps prevent moving to and from "advanced mode". add a toggle switch on player
 * or control options through settings
 * 
 */


import { Gesture, MouseButton } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Dispatch, SetStateAction, } from "react";
import { AudioPlayer } from "expo-audio";
import { useSongPlayer } from "@/context/SongContext";

interface UsePlayerGesturesProps {
    player: AudioPlayer;
    handlePlayButton: () => void;
    setAdvancedModeEnabled: Dispatch<SetStateAction<boolean>>;
    setShowVolume: Dispatch<SetStateAction<boolean>>;
    setCurrentVolume: Dispatch<SetStateAction<number>>;
}

type RootParamList = {
    Playlist: undefined;
}

export const usePlayerGestures = ({
    player,
    handlePlayButton,
    setAdvancedModeEnabled,
    setShowVolume,
    setCurrentVolume
}: UsePlayerGesturesProps) => {
    const {changeTrack } = useSongPlayer();

    const MAX_TRANSLATION_Y = 5000;
    const SWIPE_THRESHOLD = 50;

    const navigation = useRouter();

{/** Handle Mouse input for Gesture control */}

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

{ /** Handle user tap/general phone input for gesture control */ }

    const calculateVolumeChanges = (value: number) => {
    const clamped = Math.min(Math.abs(value), MAX_TRANSLATION_Y);
    const delta = clamped / MAX_TRANSLATION_Y;

    return value > 0 ? -delta : delta; // down = negative, up = positive
  };

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
        const { translationX, translationY } = e;

        if (Math.abs(translationY) > Math.abs(translationX)) {
            // Vertical swipe for volume control
            setShowVolume(true);
            let normalizedY = calculateVolumeChanges(translationY);

            setCurrentVolume((prevVal) => {
            let newVolume = prevVal + normalizedY;

            if (newVolume >= 1) newVolume = 1;
            else if (newVolume <= 0.1) newVolume = 0.1;

            player.volume = newVolume;
            return newVolume;
            });
        }
    })
    .onEnd((e) => {
      const { translationX, translationY } = e;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe for track control
        if (translationX > SWIPE_THRESHOLD) {
          changeTrack(1);
        } else if (translationX < -SWIPE_THRESHOLD) {
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
          setShowVolume(false);
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

  return {
    exclusiveGesture,
    doubleTapOnly: doubleTap
  };
}