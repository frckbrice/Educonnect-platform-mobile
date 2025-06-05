import { ThemeProvider } from "@/context/theme.context";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import React from "react";
// import { withIAPContext } from "react-native-iap";
// import { NotificationProvider } from "@/context/notification.provider";
import { AuthProvider } from "@/context/auth";
import { useTheme } from "@/context/theme.context";
import { StatusBar } from "expo-status-bar";
import { LogBox, } from "react-native";
import { withIAPContext } from "react-native-iap";

LogBox.ignoreAllLogs();

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const { theme } = useTheme();

  return (
    <>
    <AuthProvider>
    <ThemeProvider>
        {/* <NotificationProvider> */}
        <Stack screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="(routes)/*" /> */}
            <Stack.Screen name="(tabs)" />
          {/* <Stack.Screen name="(routes)/notification" /> */}
          <Stack.Screen name="index" />
        </Stack>
        {/* </NotificationProvider> */}
    </ThemeProvider>
    </AuthProvider>
      {/* set the status bar base on the platform  */}
      <StatusBar
        style={theme.dark ? 'light' : 'dark'} // iOS only
        backgroundColor={theme.dark ? '#000000' : '#ffffff'} // Android only
      />
    </>
  );
}

export default withIAPContext(RootLayout);