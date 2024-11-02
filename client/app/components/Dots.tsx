import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Dots = () => {
  const dotScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    const animateDots = () => {
      // Create an array of animations for each dot
      const animations = dotScales.map((scale, index) =>
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 500,
            delay: index * 400, // Stagger each dot's animation
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all animations in parallel and loop
      Animated.loop(Animated.parallel(animations)).start();
    };

    animateDots();
  }, [dotScales]);

  return (
      <View style={styles.dotContainer}>
        {dotScales.map((scale, index) => (
          <Animated.Text
            key={index}
            style={[styles.dot, { transform: [{ scale }] }]}>
            .
          </Animated.Text>
        ))}
      </View>
  );
};

export default Dots;

const styles = StyleSheet.create({
  dotContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: -5
  },
  dot: {
    fontSize: 60,
    color: "#333",
    marginHorizontal: 2,
  },
});
