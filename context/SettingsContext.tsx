/** // TODO: Finish writing the Settings Context
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

import { createContext, useState, useContext, useEffect } from "react";

export const SettingsContext = createContext({
    MediaControls: {ButtonControl: true, GestureControl: false, MouseControl: false,},
    ThemeStyling: {DarkMode: false, SystemDefault: true, LightMode: false},
})