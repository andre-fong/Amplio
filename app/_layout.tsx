import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme, MD3Theme } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";

const theme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    primary: "rgb(218, 29, 0)",
    onPrimary: "rgb(105, 0, 0)",
    primaryContainer: "rgb(147, 1, 0)",
    onPrimaryContainer: "rgb(255, 218, 212)",
    secondary: "rgb(79, 216, 235)",
    onSecondary: "rgb(0, 54, 61)",
    secondaryContainer: "rgb(0, 79, 88)",
    onSecondaryContainer: "rgb(151, 240, 255)",
    tertiary: "rgb(248, 189, 42)",
    onTertiary: "rgb(64, 45, 0)",
    tertiaryContainer: "rgb(92, 67, 0)",
    onTertiaryContainer: "rgb(255, 223, 160)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(32, 26, 25)",
    onBackground: "rgb(237, 224, 221)",
    surface: "rgb(32, 26, 25)",
    onSurface: "rgb(237, 224, 221)",
    surfaceVariant: "rgb(83, 67, 65)",
    onSurfaceVariant: "rgb(216, 194, 190)",
    outline: "rgb(160, 140, 137)",
    outlineVariant: "rgb(83, 67, 65)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(237, 224, 221)",
    inverseOnSurface: "rgb(54, 47, 46)",
    inversePrimary: "rgb(192, 0, 0)",
    elevation: {
      level0: "transparent",
      level1: "rgb(43, 34, 32)",
      level2: "rgb(50, 38, 36)",
      level3: "rgb(57, 43, 41)",
      level4: "rgb(59, 45, 42)",
      level5: "rgb(63, 48, 45)",
    },
    surfaceDisabled: "rgba(237, 224, 221, 0.12)",
    onSurfaceDisabled: "rgba(237, 224, 221, 0.38)",
    backdrop: "rgba(59, 45, 43, 0.4)",
  },
  roundness: 1,
  mode: "exact",
};

export default function RootLayout() {
  return (
    <>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>

      <StatusBar style="auto" backgroundColor={Colors.secondary.dark} />
    </>
  );
}

// TODO: Add index.tsx to /app as a one-time welcome screen
