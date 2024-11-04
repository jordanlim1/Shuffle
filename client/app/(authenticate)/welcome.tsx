import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { useFont } from "../reusable/useFont";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

export default function Welcome() {
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const lottieOpacity = useRef(new Animated.Value(0)).current;

  const logo = require("../../assets/images/logo.png");

  useEffect(() => {
    // Animation sequence for logo and text
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 1000,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(lottieOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.push("/login");
      }, 1300);
    });
  }, [logoScale, logoOpacity, textOpacity, lottieOpacity]);

  useFont();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: logoScale }], opacity: logoOpacity },
          ]}
        >
          <Image source={logo} style={styles.logo} />
        </Animated.View>
        <Animated.Text style={[styles.welcomeText, { opacity: textOpacity }]}>
          Welcome to Shuffle
        </Animated.Text>

        <Animated.View
          style={[styles.lottieContainer, { opacity: lottieOpacity }]}
        >
          <LottieView
            source={require("../../assets/music.json")}
            style={styles.lottie}
            autoPlay
            loop={false}
            speed={0.6}
          />
          <LottieView
            source={require("../../assets/hearts.json")}
            style={styles.lottieOverlay}
            autoPlay
            loop={false}
            speed={0.9}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    position: "absolute",
  },
  logo: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "NotoSansMono",
    color: "#333",
    textAlign: "center",
  },
  lottieContainer: {
    position: "absolute",
    top: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    height: 260,
    width: 300,
  },
  lottieOverlay: {
    height: 260,
    width: 300,
    position: "absolute",
  },
});
