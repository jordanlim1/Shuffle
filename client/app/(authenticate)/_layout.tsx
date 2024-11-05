import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="filler" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="password" options={{ headerShown: false }} />
      <Stack.Screen name="location" options={{ headerShown: false }} />
      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="preference" options={{ headerShown: false }} />
      <Stack.Screen name="orientation" options={{ headerShown: false }} />
      <Stack.Screen name="race" options={{ headerShown: false }} />
      <Stack.Screen name="images" options={{ headerShown: false }} />
      <Stack.Screen name="registerUser" options={{ headerShown: false }} />
    </Stack>
  );
}
