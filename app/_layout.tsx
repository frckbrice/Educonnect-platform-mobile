import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/theme.context";
import {
  Poppins_600SemiBold,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
// import { withIAPContext } from "react-native-iap";
// import { NotificationProvider } from "@/context/notification.provider";
import { LogBox, } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/context/auth";

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

  return (
    <>
    <AuthProvider>
    <ThemeProvider>
        {/* <NotificationProvider> */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(routes)/onboarding/index" />
          <Stack.Screen name="(tabs)" />
          {/* <Stack.Screen name="(routes)/course-access" /> */}
          {/* <Stack.Screen name="(routes)/notification" /> */}
          <Stack.Screen name="index" />
        </Stack>
        {/* </NotificationProvider> */}
    </ThemeProvider>
    </AuthProvider>
      {/* set the status bar base on the platform  */}
      <StatusBar style="auto" />
    </>
  );
}

export default RootLayout;