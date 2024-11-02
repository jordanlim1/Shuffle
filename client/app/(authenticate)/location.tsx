import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, {
  Region,
  MarkerDragStartEndEvent,
  Circle,
} from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { saveRegistrationInfo } from "../registrationUtils";
import { Animated } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Dots from "../components/Dots";
import NextButton from "../components/NextButton";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";

const LocationScreen = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 13.0451,
    longitude: 77.6269,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState(10);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      setRegion({
        ...region,
        latitude,
        longitude,
      });
      getLocationName(latitude, longitude);
      setLoading(false);
    })();
  }, []);

  const getLocationName = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    try {
      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const { city, district, region, country } = address[0];
      district
        ? setLocation(`${district}, ${region}, ${country}`)
        : setLocation(`${city}, ${region}, ${country}`);
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region): void => {
    setRegion(newRegion);
    getLocationName(newRegion.latitude, newRegion.longitude);
  };

  const saveRegistrationInfoDebounced = debounce(
    (screenName: string, value: number) => {
      saveRegistrationInfo(screenName, value);
    },
    300
  );

  const handleNext = () => {
    if (loading) {
      alert("Please select your location.");
      return;
    }
    saveRegistrationInfo("location", region);
    router.push("/gender");
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Location</Text>
          <Dots />
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#581845" />
        ) : (
          <View
            style={{
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}>
            <MapView
              style={{
                width: "100%",
                height: 450,
                marginTop: 20,
              }}
              region={region}
              onRegionChangeComplete={handleRegionChangeComplete}>
              <Circle
                center={region}
                radius={value * 1609.34} // Adjust the radius as needed
                strokeColor="rgba(0, 122, 255, 0.5)" // Customize the border color
                fillColor="rgba(0, 122, 255, 0.2)" // Customize the fill color
              />
            </MapView>

            <View style={styles.pinContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={40}
                color="#ff5a79"
              />
            </View>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
        )}
        {loading ? null : (
          <View style={styles.sliderContainer}>
            <Slider
              style={{ width: "100%" }}
              minimumValue={0}
              maximumValue={200}
              minimumTrackTintColor="#d3d3d3"
              maximumTrackTintColor="#000000"
              thumbTintColor="#ff5a79"
              value={value}
              onValueChange={(newValue) => {
                const roundedValue = Math.floor(newValue);
                setValue(roundedValue);
                saveRegistrationInfoDebounced("distance", roundedValue);
              }}
            />
            <Text style={styles.sliderLabel}>
              Show me matches within: {value} miles
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.floatingButton} onPress={handleNext}>
          <AntDesign name="arrowright" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -30,
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20, // Adjust half of icon width
    marginTop: -20, // Adjust half of icon height
    zIndex: 10,
  },

  locationContainer: {
    alignContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    zIndex: 10,
    alignItems: "center",
    marginTop: 40,
    position: "absolute",
    bottom: 20,
  },
  locationText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  sliderContainer: {
    width: "90%",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  sliderLabel: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
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

export default LocationScreen;
