import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Dots from "../Reusable/Dots";
import * as SecureStore from "expo-secure-store";
import { TouchableWithoutFeedback } from "react-native";

const Password = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);

  useEffect(() => {
    validatePassword(password);
  }, [password, confirmPassword]);

  async function handleNext() {
    if (
      (confirmPassword && password !== confirmPassword) ||
      !confirmPassword ||
      !password
    ) {
      alert("Please fill out all fields.");
      return -1;
    }
    await SecureStore.setItemAsync("password", password);

    router.push("/location");
  }

  const validatePassword = (text: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    let message = "";

    if (password === "") {
      message =
        "Must contain a capital letter, a special character, a number, and be at least 8 characters.";
    } else {
      if (text.length < 8 && password !== "")
        message = "Password must be at least 8 characters.";
      else if (!specialCharRegex.test(text))
        message = "Password must include a special character.";
      else if (!uppercaseRegex.test(text))
        message = "Password must include an uppercase letter.";
      else message = ""; // No validation errors
    }

    seterrorMessage(message);

    if (!message) return true;
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Password</Text>
            <Dots />
          </View>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-open-outline"
                size={30}
                color="black"
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                textContentType="password"
                secureTextEntry={!show}
                onChangeText={(text) => setPassword(text)}
                placeholder="New Password"
                placeholderTextColor={"#D3D3D3"}
              />
              <TouchableOpacity onPress={() => setShow(!show)}>
                <Feather
                  name={show ? "eye" : "eye-off"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.validationMessage}>{errorMessage}</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={30}
                color="black"
                style={styles.icon}
              />
              <TextInput
                style={styles.textInput}
                textContentType="password"
                secureTextEntry={!confirmShow}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor={"#D3D3D3"}
              />
              <TouchableOpacity onPress={() => setConfirmShow(!confirmShow)}>
                <Feather
                  name={confirmShow ? "eye" : "eye-off"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {confirmPassword && password !== confirmPassword && (
              <Text style={styles.validationMessage}>
                Passwords do not match.
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.floatingButton} onPress={handleNext}>
            <AntDesign name="arrowright" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    fontSize: 40,
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
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
  validationMessage: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },

  errorText: {
    color: "red",
    fontSize: 18,
    marginLeft: 5,
  },
});
