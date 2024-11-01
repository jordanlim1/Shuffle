import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="password" options={{ headerShown: false }} />

      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="preference" options={{ headerShown: false }} />
      <Stack.Screen name="orientation" options={{ headerShown: false }} />

    </Stack>
  );
}
