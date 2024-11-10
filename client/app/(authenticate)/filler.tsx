import React, { useEffect, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useFont } from "../Reusable/useFont";

const words = ["Let's", "Finish", "Your", "Profile!"];

const FillerScreen = () => {
  const navigation = useNavigation();
  const [animatedValues] = useState(words.map(() => new Animated.Value(0)));

  useEffect(() => {
    const fadeInAnimations = words.map((_, i) =>
      Animated.timing(animatedValues[i], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    );

    const fadeOutAnimations = words.map((_, i) =>
      Animated.timing(animatedValues[i], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      Animated.stagger(300, fadeInAnimations),
      Animated.stagger(100, fadeOutAnimations),
    ]).start(() => {
      router.push("/about");
    });
  }, [animatedValues, navigation]);

  useFont();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        {words.map((word, index) => (
          <Animated.Text
            key={index}
            style={[styles.word, { opacity: animatedValues[index] }]}
          >
            {word}
          </Animated.Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default FillerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  word: {
    fontSize: 45,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "NotoSansMono",
  },
});
