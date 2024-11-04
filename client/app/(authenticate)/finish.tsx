import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  getResgistrationInfo,
  saveRegistrationInfo,
} from "../registrationUtils";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { useFonts } from "expo-font";
import { useFont } from "../reusable/useFont";

const finish = () => {
  async function registerUser() {
    const name = await getResgistrationInfo("name");
    const email = await getResgistrationInfo("email");
    const age = await getResgistrationInfo("age");
    const gender = await getResgistrationInfo("gender");
    const race = await getResgistrationInfo("race");
    const password = await SecureStore.getItemAsync("password");
    const height = await getResgistrationInfo("height");
    const location = await getResgistrationInfo("location");
    const distance = await getResgistrationInfo("distance");
    const preference = await getResgistrationInfo("preference");
    const orientation = await getResgistrationInfo("orientation");
    const artists = await getResgistrationInfo("artists");
    const images = await getResgistrationInfo("images");

    const body = {
      name: name,
      email: email,
      password: password,
      age: age,
      location: location,
      distance: distance,
      preference: preference,
      height: height,
      race: race,
      gender: gender,
      orientation: orientation,
      artists: artists,
      images: images,
    };


    const res = await fetch("http://192.168.1.78:3000/auth/createProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) clearAllScreenData();
  }

  const clearAllScreenData = async () => {
    try {
      const screens = [
        "name",
        "age",
        "password",
        "email",
        "artists",
        "preference",
        "location",
        "distance",
        "height",
        "gender",
        "orientation",
        "race",
        "images",
      ];
      // Loop through each screen and remove its data from AsyncStorage
      for (const screenName of screens) {
        if (screenName === "password") {
          SecureStore.deleteItemAsync("password");
        }
        const key = `registration_progress_${screenName}`;
        await AsyncStorage.removeItem(key);
      }
      console.log("All screen data cleared successfully");
    } catch (error) {
      console.error("Error clearing screen data:", error);
    }
  };

  useFont();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ marginTop: 60, width: "100%" }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "NotoSansMono",
            marginLeft: 20,
          }}
        >
          All set to register!
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "NotoSansMono",
            marginLeft: 20,
            marginRight: 10,
            marginTop: 20,
            width: " 90%",
          }}
        >
          Setting up your profile for you
        </Text>
      </View>

      <View>
        <LottieView
          source={require("../../assets/love.json")}
          style={{
            height: 260,
            width: 300,
            alignSelf: "center",
            marginTop: 70,
            justifyContent: "center",
          }}
          autoPlay
          loop={true}
          speed={0.7}
        />
      </View>

      <Pressable
        onPress={registerUser}
        style={{ backgroundColor: "#ff5a79", padding: 15, marginTop: "auto" }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Create Profile
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default finish;

const styles = StyleSheet.create({});
