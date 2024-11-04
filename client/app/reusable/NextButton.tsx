import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { saveRegistrationInfo } from "../registrationUtils";

const NextButton = ({state, route, screenName} : {state: any, route: string, screenName: string}) => {
    async function handleNext() {
        if(!state){
            alert("Please select an option.")
            return
        }
        await saveRegistrationInfo(screenName, state)
        router.push(`/${route}`);
      }
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={handleNext}>
      <AntDesign name="arrowright" size={30} color="white" />
    </TouchableOpacity>
  );
};

export default NextButton;

const styles = StyleSheet.create({
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
