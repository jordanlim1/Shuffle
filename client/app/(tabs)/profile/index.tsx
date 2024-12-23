import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import ProfileCard from "../../Reusable/ProfileCard";

const UserProfile = () => {
  const [location, setLocation] = useState("");
  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    (async () => {
      const profile_id = await AsyncStorage.getItem("profileId");
      setProfileId(profile_id!);
    })();
  }, []);

  // const getLocationName = async (
  //   latitude: number,
  //   longitude: number
  // ): Promise<void> => {
  //   try {
  //     let address = await Location.reverseGeocodeAsync({ latitude, longitude });
  //     const { city, district, region, country } = address[0];

  //     const locationText = district
  //       ? `${district}, ${region}`
  //       : `${city}, ${region}`;

  //     setLocation(locationText);
  //   } catch (error) {
  //     console.error("Error fetching location name:", error);
  //   }
  // };

  return (
    <ScrollView style={styles.safeArea}>
      <SafeAreaView>
        {profileId ? (
          <ProfileCard profileId={profileId} />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: "100%",
    backgroundColor: "#f9f9f9",
  },
  profileName: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },

  name: {
    paddingLeft: 20,
    fontSize: 30,
    fontWeight: "bold",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  imageWrapper: {
    width: "80%",
    aspectRatio: 1,
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
