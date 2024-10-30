import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDistance } from "geolib";
import * as Location from "expo-location";
import { saveRegistrationInfo } from "../registrationUtils";

const location = () => {
  const [locationError, setLocationError] = useState("");
  const [location, setLocation] = useState({
    city: "",
    district: "",
    region: "",
    postalCode: "",
    isoCountryCode: "",
  });

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError(
          "Location permissions denied, please update settings."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log(address[0]);
      const { city, district, region, postalCode, isoCountryCode } = address[0];

      setLocation({
        city: city as string,
        district: district as string,
        region: region as string,
        postalCode: postalCode as string,
        isoCountryCode: isoCountryCode as string,
      });

      saveRegistrationInfo("location", location);
    } catch (err) {
      console.log("Error requesting location: ", err);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Where are you located?</Text>
        {locationError ? (
          <View>
            <Text> {locationError} </Text>
          </View>
        ) : (
          <View>
            <Text>
              {`${location.district} ${location.city}, ${location.region} ${location.postalCode} ${location.isoCountryCode} `}
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={getLocation}>
          <Text>Press here to grab your location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default location;

const styles = StyleSheet.create({});
