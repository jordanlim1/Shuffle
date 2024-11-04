import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { saveRegistrationInfo } from "../registrationUtils";
import Dots from "../reusable/Dots";
import NextButton from "../reusable/NextButton";

const Orientation = () => {
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

  const [orientation, setOrientation] = useState("");

  const handleOptionSelect = (option: string) => {
    setOrientation(option);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Orientation</Text>
          <Dots />
        </View>
        <View>
          {options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <Checkbox
                value={orientation === option}
                onValueChange={() => handleOptionSelect(option)}
                style={styles.checkbox}
                color={orientation === option ? "#ff5a79" : undefined}
              />
              <Text style={styles.optionText}>{option}</Text>
            </View>
          ))}
        </View>
        <NextButton state={orientation} route="race" screenName="orientation" />
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
    top: 40,
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
    fontSize: 40,
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
});

export default Orientation;
