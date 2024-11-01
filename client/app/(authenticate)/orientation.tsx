import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Checkbox from 'expo-checkbox';
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const Orientation = () => {
    
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

  const options = [
    "Asexual",
    "Bisexual",
    "Gay",
    "Heterosexual",
    "Lesbian",
    "Pansexual",
    "Queer",
    "I prefer to self-describe",
    "I don't wish to answer",
  ];

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  function handleNext() {
  
    router.push("/race");
  }
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}> 
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Orientation</Text>
          <View style={styles.dotContainer}>
            {dotScales.map((scale, index) => (
              <Animated.Text
                key={index}
                style={[styles.dot, { transform: [{ scale }] }]}
              >
                .
              </Animated.Text>
            ))}
          </View>
        </View>
      <View >
        {options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <Checkbox
              value={selectedOption === option}
              onValueChange={() => handleOptionSelect(option)}
              style={styles.checkbox}
              color={selectedOption === option ? "#ff5a79" : undefined}
            />
            <Text style={styles.optionText}>{option}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleNext}
        >
          <AntDesign name="arrowright" size={30} color="white" />
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  titleContainer: {
    position: "absolute",
    alignItems: "flex-start",
    width: "100%",
    top: 50,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -30,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 12,
    
  },
  optionText: {
    fontSize: 25,
    color: "#333",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 40,
    backgroundColor: "#ff5a79",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },  
  dotContainer: {
    display: "flex",
    flexDirection: "row",
  },
  dot: {
    fontSize: 60,
    color: "#333",
    marginHorizontal: 2,
  },
});

export default Orientation;
