import { createContext, useContext } from "react";

export const DarkModeContext = createContext({ darkMode: false, setDarkMode: () => {} });

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const getTheme = (darkMode) => ({
  primary: "#0A66C2", // LinkedIn blue
  primaryDark: "#004182",
  background: darkMode ? "#18191A" : "#F3F6F8", // LinkedIn bg
  cardBackground: darkMode ? "#222" : "#fff",
  card: darkMode ? "#222" : "#fff",
  text: darkMode ? "#fff" : "#1D2226",
  secondaryText: darkMode ? "#bbb" : "#5E5E5E",
  highlight: darkMode ? "#333" : "#EAEAEA",
  border: darkMode ? "#444" : "#EAEAEA"
}); 