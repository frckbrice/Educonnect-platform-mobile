
import { ThemeProvider } from "@/context/theme.context";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"  />
        <Stack.Screen name="(routes)/onboarding/index"  />
        <Stack.Screen name="(tabs)/index" />
      </Stack>
    </ThemeProvider>
  );
}
