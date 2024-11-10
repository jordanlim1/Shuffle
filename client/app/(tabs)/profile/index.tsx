import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import ProfileCard from "../../Reusable/ProfileCard";
import { Profile } from "@/Interfaces/interfaces";

const UserProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const [location, setLocation] = useState("");
  const [profileId, setProfileId] = useState("");
  useEffect(() => {
    async () => {
      const profile_id = await AsyncStorage.getItem("profileId");
      setProfileId(profile_id!);
    };
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
        <View style={styles.profileName}>
          <Text style={styles.name}>{`${profile?.name.split(" ")[0]}`}</Text>
        </View>

        <View style={styles.profileContent}>
          <ProfileCard profileId={profileId!} />
          {/* <View style={styles.imagesContainer}>
          {profile?.images.map((image, idx) => (
            <View key={idx} style={styles.imageWrapper}>
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </View> */}
        </View>
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
    width: "80%", // Adjust width as needed
    aspectRatio: 1, // Maintain square aspect ratio
    margin: 10,
    borderRadius: 8,
    overflow: "hidden", // Ensures rounded corners
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
