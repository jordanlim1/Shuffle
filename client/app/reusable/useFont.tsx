import { useFonts } from "expo-font";

export function useFont() {
  const [fontsLoaded] = useFonts({
    NotoSansMono: require("../../assets/fonts/NotoSansMono.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
}
