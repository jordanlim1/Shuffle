import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData() {
    try {
      const profileId = await AsyncStorage.getItem("profileId");
      //   console.log("profileId", profileId);

      const response = await fetch(
        `http://192.168.1.5:3000/query/getProfile/${profileId}`
      );
      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      console.log("Error in fetching profile data");
      return;
    }
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
