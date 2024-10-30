import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDistance } from "geolib";
import * as Location from "expo-location";
import { saveRegistrationInfo } from "../registrationUtils";
import Slider from "@react-native-community/slider";

const location = () => {
  const [locationError, setLocationError] = useState("");
  const [location, setLocation] = useState({
    city: "",
    district: "",
    region: "",
    postalCode: "",
    isoCountryCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);

  const getLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError(
          "Location permissions denied, please update settings."
        );
        setLoading(false);
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
      setLocationError("Failed to retrieve location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Where are you located?</Text>

        {locationError ? (
          <View>
            <Text>{locationError}</Text>
          </View>
        ) : (
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : location.city ? (
              <Text>
                {`${location.district} ${location.city}, ${location.region} ${location.postalCode} ${location.isoCountryCode} `}
              </Text>
            ) : (
              <TouchableOpacity onPress={getLocation}>
                <Text>Press here to grab your location</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View>
          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={0}
            maximumValue={300}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#0000FF"
            value={value}
            onValueChange={(newValue) => setValue(Math.floor(newValue))}
          />
          <Text>Value: {value}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default location;

const styles = StyleSheet.create({});
