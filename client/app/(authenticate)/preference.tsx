import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getResgistrationInfo,
  saveRegistrationInfo,
} from "../registrationUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Dots from "../reusable/Dots";
import NextButton from "../reusable/NextButton";

const Preference = () => {
  const [preferences, setPreferences] = useState("");

  const options = [
    {
      value: "Men",
      icon: <Ionicons name="man-outline" size={36} color="black" />,
    },
    {
      value: "Women",
      icon: <Ionicons name="woman-outline" size={36} color="black" />,
    },
    {
      value: "Both",
      icon: (
        <View style={styles.bothIcons}>
          <Ionicons name="woman-outline" size={36} color="black" />
          <Ionicons name="man-outline" size={36} color="black" />
        </View>
      ),
    },
    {
      value: "Transgender",
      icon: <MaterialIcons name="transgender" size={36} color="black" />,
    },
    {
      value: "All Genders",
      icon: <Ionicons name="people-outline" size={36} color="black" />,
    },
    {
      value: "Non-binary",
      icon: (
        <MaterialCommunityIcons
          name="gender-non-binary"
          size={36}
          color="black"
        />
      ),
    },
  ];

  function handlePress(preference: string) {
    setPreferences(preference);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Preference</Text>
          <Dots />
        </View>
        <View style={styles.gridContainer}>
          {options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionButton,
                option.value === preferences ? styles.selected : null,
              ]}
              onPress={() => handlePress(option.value)}
            >
              {option.icon}
              <Text style={styles.optionText}>{option.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <NextButton
          state={preferences}
          route="orientation"
          screenName="preference"
        />
      </View>
    </SafeAreaView>
  );
};

export default Preference;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
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

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  optionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%", // Allows two buttons per row with some spacing
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selected: {
    backgroundColor: "#fde",
    borderColor: "#ffb6c1",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  bothIcons: {
    flexDirection: "row",
    alignItems: "center",
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
