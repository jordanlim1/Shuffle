import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Button,
  Animated,
  ActivityIndicator,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import {
  saveRegistrationInfo,
  getResgistrationInfo,
} from "../registrationUtils";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import * as Location from "expo-location";

const personalInfo = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [birthdayPlaceholder, setBirthdayPlaceholder] = useState(
    "Enter your birthday"
  );

  const dotScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  useEffect(() => {
    const animateDots = () => {
      // Create an array of animations for each dot
      const animations = dotScales.map((scale, index) =>
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.5,
            duration: 500,
            delay: index * 400, // Stagger each dot's animation
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all animations in parallel and loop
      Animated.loop(Animated.parallel(animations)).start();
    };

    animateDots();
  }, [dotScales]);
  //if user signed in w/ spotify oauth, this fields should be prepopulated
  useEffect(() => {
    prefill();
  }, []);

  async function prefill() {
    const name = await getResgistrationInfo("name");
    const email = await getResgistrationInfo("email");
    setName(name);
    setEmail(email);
  }

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

  const saveRegistrationInfoDebounced = debounce(
    (screenName: string, value: number) => {
      saveRegistrationInfo(screenName, value);
    },
    300
  );

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

      console.log(address);
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

  // Handle date picker value changes
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    const formattedDate = dayjs(currentDate).format("YYYY-MM-DD");
    setBirthdayPlaceholder(formattedDate);

    const currentYear = dayjs().year();
    const birthYear = dayjs(currentDate).year();
    const calculatedAge = currentYear - birthYear;
    setAge(calculatedAge);
    saveRegistrationInfo("age", age);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Tell Us About Yourself</Text>
          <View style={styles.dotContainer}>
            {dotScales.map((scale, index) => (
              <Animated.Text
                key={index}
                style={[styles.dot, { transform: [{ scale }] }]}
              >
                .
              </Animated.Text>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                saveRegistrationInfo("name", text);
              }}
              placeholder="Enter your name"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputContainer}>
            <Fontisto
              name="email"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                saveRegistrationInfo("email", text);
              }}
              placeholder="Enter your email"
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputContainer}>
            <Fontisto name="date" size={24} color="black" style={styles.icon} />
            <TextInput
              placeholder={birthdayPlaceholder}
              style={styles.textInput}
              onFocus={() => setShow(true)}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.locationContainer}>
          {locationError ? (
            <View>
              <Text style={styles.locationError}>{locationError}</Text>
              <TouchableOpacity onPress={getLocation}>
                <Text>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : location.city ? (
            <Text>
              {`${location.district} ${location.city}, ${location.region} ${location.postalCode} ${location.isoCountryCode}`}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={getLocation}
              style={styles.locationTouchable}
            >
              <View style={styles.locationContent}>
                <Ionicons name="location-outline" size={24} color="black" />
                <Text style={styles.locationText}>
                  Press here to grab your location
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={{ width: "100%" }}
            minimumValue={0}
            maximumValue={300}
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

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={async () => {
            const verified = await AsyncStorage.getItem("access_token");
            router.push(verified !== null ? "/gender" : "/password");
          }}
        >
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={show}
        onRequestClose={() => setShow(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShow(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onChange}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShow(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};
export default personalInfo;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
    width: "100%",
  },
  titleContainer: {
    position: "absolute",
    paddingHorizontal: 20,
    alignItems: "flex-start",
    width: "100%",
    top: 20,
    marginLeft: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  inputSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 60,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTouchable: {
    width: "100%", // Ensure it takes full width within locationContainer
  },
  locationError: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  sliderContainer: {
    width: "90%",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#ff5a79",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#ff5a79",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dotContainer: {
    display: "flex",
    flexDirection: "row",
  },
  dot: {
    fontSize: 40,
    color: "#333",
    marginHorizontal: 2,
  },
});
