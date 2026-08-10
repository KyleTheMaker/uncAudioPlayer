 /**
  * Theme Context
  * This context manages the application's theme settings,
  * including light and dark modes, and provides a way to
  * toggle between them.
  *
  * - Dark/Light Mode Override (default is system setting) - 
  * 
  * Read the colorScheme of the device, and whether dark or light,
  * apply the dark, or light theme colours. components will need to
  * read the color theme and use the defined catagories in their stylesheet
  * 
  * // TODO: Dark Mode colour scheme needed, and base colour theme
  */

// import { ThemeContext } from "@react-navigation/native";
import { createContext, ReactNode, useState, useContext } from "react";
import { light, dark } from "@/constants/theme";
import { useColorScheme } from "react-native";

// export interface ThemeStyles {
//   light: boolean;
//   dark: boolean;
//   sysDefault: boolean;
// }

type ThemeStyle = 'system' | 'light' | 'dark';
type ActiveTheme = 'dark' | 'light';
type ThemeColors = typeof light;

interface ThemeContextType {
  colors: ThemeColors;
  activeTheme: ActiveTheme;
  themeStyle: ThemeStyle;
  setThemeStyle: React.Dispatch<React.SetStateAction<ThemeStyle>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const deviceTheme = useColorScheme();
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('system');

  const activeTheme = themeStyle === 'system' ? (deviceTheme === "dark" ? "dark": "light") : themeStyle;
  const colors = activeTheme === 'light' ? light : dark;

  return(
    <ThemeContext.Provider value={{colors, activeTheme, themeStyle, setThemeStyle}}>
    {children}
    </ThemeContext.Provider>
  )
}

export const useThemeStyles = () => {
  const context = useContext(ThemeContext);
  if(!context){
    throw new Error("useThemeStlyes must be used with a ThemeStyleProvider");
  }
  return context;
}