// import React, { createContext, useState, useContext, useEffect } from "react";
// import { useColorScheme } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Define your custom themes
// const LightTheme = {
//   dark: false,
//   colors: {
//     background: "#ffffff",
//     text: "#000000",
//   },
// };

// const DarkTheme = {
//   dark: true,
//   colors: {
//     background: "#000000",
//     text: "#ffffff",
//   },
// };

// const ThemeContext = createContext({
//   theme: LightTheme,
//   toggleTheme: () => {},
// });

// export const ThemeProvider = ({ children }:any) => {
//   const systemColorScheme = useColorScheme(); // Get the system color scheme
//   const [theme, setTheme] = useState(systemColorScheme === "dark" ? DarkTheme : LightTheme);

//   useEffect(() => {
//     const loadTheme = async () => {
//       const savedTheme = await AsyncStorage.getItem("userTheme");
//       if (savedTheme) {
//         setTheme(savedTheme === "dark" ? DarkTheme : LightTheme);
//       } else {
//         setTheme(systemColorScheme === "dark" ? DarkTheme : LightTheme);
//       }
//     };
//     loadTheme();
//   }, []);

//   const toggleTheme = async () => {
//     const newTheme = theme === DarkTheme ? LightTheme : DarkTheme;
//     setTheme(newTheme);
//     await AsyncStorage.setItem("userTheme", newTheme.dark ? "dark" : "light");
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useColorScheme, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeColors = {
  background: string;
  text: string;
};

export type AppTheme = {
  dark: boolean;
  colors: ThemeColors;
};

const LightTheme: AppTheme = {
  dark: false,
  colors: {
    background: "#ffffff",
    text: "#000000",
  },
};

const DarkTheme: AppTheme = {
  dark: true,
  colors: {
    background: "#000000",
    text: "#ffffff",
  },
};

type ThemeContextType = {
  theme: AppTheme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: LightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeName, setThemeName] = useState<ColorSchemeName | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("userTheme");
        setThemeName(savedTheme === "dark" ? "dark" : savedTheme === "light" ? "light" : null);
      } catch (error) {
        console.error("Failed to load theme", error);
        setThemeName(null);
      }
    };
    loadTheme();
  }, []);

  const theme = useMemo(() => {
    return themeName === "dark" || (themeName === null && systemColorScheme === "dark")
      ? DarkTheme
      : LightTheme;
  }, [themeName, systemColorScheme]);

  const toggleTheme = async () => {
    const newThemeName = theme.dark ? "light" : "dark";
    setThemeName(newThemeName);
    try {
      await AsyncStorage.setItem("userTheme", newThemeName);
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme.dark,
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
