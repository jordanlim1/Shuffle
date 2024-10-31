import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { saveRegistrationInfo } from "../registrationUtils";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

const Password = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set Your Password</Text>
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
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-open-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              textContentType="password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text);
                saveRegistrationInfo("password", text);
              }}
              placeholder="New Password"
              placeholderTextColor={"#D3D3D3"}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              textContentType="password"
              secureTextEntry={true}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor={"#D3D3D3"}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.push("/personalInfo")}
          >
            <AntDesign name="arrowleft" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.push("/gender")}
          >
            <AntDesign name="arrowright" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Password;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
  inputSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  floatingButton: {
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
  buttonContainer: {
    position: "absolute",
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    bottom: 20,
    flexDirection: "row",
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
