 /**
  * Theme Context
  * This context manages the application's theme settings,
  * including light and dark modes, and provides a way to
  * toggle between them.
  *
  * - Dark/Light Mode Override (default is system setting) - 
  * // TODO: Dark Mode colour scheme needed, and base colour theme
  */

import { createContext, useState, useContext, useEffect } from "react";

export const themeContext = createContext({ 
  themeStyles: {light: {}, dark: {}, sysDefault: {}},
});