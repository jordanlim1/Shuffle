import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

interface Profile {
  age: number;
  artists: string[];
  distance: number;
  gender: string;
  height: string;
  images: string[];
  location: { latitude: number; longitude: number };
  name: string;
  race: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [location, setLocation] = useState("");

  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData() {
    try {
      const profile_id = await AsyncStorage.getItem("profileId");

      const response = await fetch(
        `http://192.168.1.75:3000/query/profile/${profile_id}`
      );
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.log("Error in fetching profile data");
      return;
    }
  }

  const getLocationName = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    try {
      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const { city, district, region, country } = address[0];

      const locationText = district
        ? `${district}, ${region}`
        : `${city}, ${region}`;

      setLocation(locationText);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.profileName}>
          <Text style={styles.name}>{`${profile?.name.split(" ")[0]}`}</Text>
        </View>
        <View style={styles.imagesContainer}>
          {profile?.images.map((image, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
        <View></View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    paddingLeft: 25,
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
    width: "60%", // Adjust width as needed
    aspectRatio: 1, // Maintain square aspect ratio
    margin: 5,
    borderRadius: 8,
    overflow: "hidden", // Ensures rounded corners
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
