import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <PaperProvider theme={MD3DarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>

      <StatusBar style="auto" />
    </>
  );
}

// TODO: Add index.tsx to /app as a one-time welcome screen
