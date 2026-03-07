/** // TODO: Finish writing the Settings Context
/**
 * This context connects choices from the settings menu to
 * properly reflect throughout the app.
 * Settings:
 *  - Media Control Options -
 * Button (T/F regardles of other controls), [BT Mouse, Touch Gesture, 
 * voice control, Camera Gesture] only one can be true at a time.
 * 
 *  - Dark Mode Override (default is system setting) - 
 * // TODO: Dark Mode colour scheme needed, and likely a theme context
 */

import React, { createContext, useState, useContext, ReactNode } from "react";

export interface MediaControlSettings {
  ButtonControl: boolean;
  GestureControl: boolean;
  MouseControl: boolean;
}

interface MediaControlContextType {
  mediaControls: MediaControlSettings;
  setMediaControls: React.Dispatch<React.SetStateAction<MediaControlSettings>>;
}

export const MediaControlContext = createContext<MediaControlContextType | undefined>(undefined);

export const MediaControlProvider = ({children}: {children: ReactNode}) => {
    const [mediaControls, setMediaControls] = useState({
        ButtonControl: true,
        GestureControl: false,
        MouseControl: false,
    });

    return (
      <MediaControlContext.Provider value={{mediaControls, setMediaControls}}>
        {children}
      </MediaControlContext.Provider>
    );
}

export const useMediaControls = () => {
  const context = useContext(MediaControlContext);
  if (!context){
    throw new Error("useMediaControls must be used within a MediaControlProvider");
  }
  return context;
}

