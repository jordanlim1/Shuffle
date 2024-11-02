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
  Alert,
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
import Dots from "../components/Dots";
import NextButton from "../components/NextButton";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const personalInfo = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [birthdayPlaceholder, setBirthdayPlaceholder] = useState(
    "Enter your birthday"
  );
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    age: false,
    height: false,
  });
  const [showHeight, setShowHeight] = useState(false);

  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [height, setHeight] = useState<{
    feet: Number | null;
    inches: Number | null;
  }>({
    feet: null,
    inches: null,
  });

  //if user signed in w/ spotify oauth, this fields should be prepopulated
  useEffect(() => {
    {
      async () => {
        const storedName = await getResgistrationInfo("name");
        const storedEmail = await getResgistrationInfo("email");

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
      };
    }
  }, []);

  const handleNextPress = async () => {
    const errors = {
      name: !name,
      email: !email,
      age: birthdayPlaceholder === "Enter your birthday",
      height: height.feet === null || height.inches === null,
    };

    setValidationErrors(errors);

    // Only proceed if all fields are filled
    if (!Object.values(errors).includes(true)) {
      if (!email.includes("@")) {
        alert("Invalid email format.");
        return;
      }
      const verified = await getStoredAccessToken();
      saveRegistrationInfo("name", name);
      saveRegistrationInfo("email", email);
      router.push(verified ? "/location" : "/password");
    }
  };

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
    setValidationErrors((prev) => ({ ...prev, age: false }));
  };

  async function getStoredAccessToken() {
    const token = await AsyncStorage.getItem("access_token");
    const timestamp = await AsyncStorage.getItem("token_timestamp");

    if (token && timestamp) {
      const tokenAge = new Date().getTime() - JSON.parse(timestamp);
      const expiryTime = 30 * 60 * 60 * 1000; // 30 hours in milliseconds

      if (tokenAge < expiryTime) {
        return token; // Token is still valid
      } else {
        // Token expired
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("token_timestamp");
        console.log("Access token has expired. Please re-authenticate.");
        return null; // Token expired, return null to indicate this
      }
    } else {
      console.log("No token found. Please authenticate.");
      return null;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>About</Text>
          <Dots />
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={30}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setValidationErrors((prev) => ({ ...prev, name: false }));
              }}
              placeholder="Enter your first name"
              placeholderTextColor={"#333"}
              style={styles.textInput}
            />
            {validationErrors.name && <Text style={styles.errorText}>*</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Fontisto
              name="email"
              size={30}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationErrors((prev) => ({ ...prev, email: false }));
              }}
              placeholder="Enter your email"
              placeholderTextColor={"#333"}
              style={styles.textInput}
            />
            {validationErrors.email && <Text style={styles.errorText}>*</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Fontisto name="date" size={30} color="black" style={styles.icon} />

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}>
              <Text style={styles.dateText}>{birthdayPlaceholder}</Text>
            </TouchableOpacity>
            {validationErrors.age && <Text style={styles.errorText}>*</Text>}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="resize-outline"
            size={30}
            color="black"
            style={styles.icon}
          />
          <TouchableOpacity
            onPress={() => {
              setShowHeightPicker(true);
              if(!height.feet && !height.inches) setHeight({feet: 3, inches: 0})
            }}
            style={styles.dateInput}>
            <Text style={styles.dateText}>
              {showHeight
                ? `${height.feet} ft ${height.inches} in`
                : "Enter your height"}
            </Text>
          </TouchableOpacity>
          {validationErrors.height && <Text style={styles.errorText}>*</Text>}
        </View>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleNextPress}>
          <AntDesign name="arrowright" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onChange}
                textColor="#333"
                maximumDate={new Date()} // This disables future dates
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  saveRegistrationInfo("age", age);
                  setShowDatePicker(false);
                }}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showHeightPicker}
        onRequestClose={() => setShowHeightPicker(false)}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}>
                <View style={styles.pickerContainer}>
                  <Text style={styles.sliderLabel}>Feet</Text>
                  <Picker
                    selectedValue={height.feet}
                    onValueChange={(value) =>
                      setHeight((prev) => ({ ...prev, feet: value }))
                    }
                    style={styles.picker}>
                    {[...Array(5)].map((_, i) => (
                      <Picker.Item
                        key={i + 3}
                        label={`${i + 3}`}
                        value={i + 3}
                      />
                    ))}
                  </Picker>
                </View>

                {/* Inches Picker */}
                <View style={styles.pickerContainer}>
                  <Text style={styles.sliderLabel}>Inches</Text>
                  <Picker
                    selectedValue={height.inches}
                    onValueChange={(value) =>
                      setHeight((prev) => ({ ...prev, inches: value }))
                    }
                    style={styles.picker}>
                    {[...Array(12)].map((_, i) => (
                      <Picker.Item key={i} label={`${i}`} value={i} />
                    ))}
                  </Picker>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  saveRegistrationInfo("height", height);
                  setShowHeight(true);
                  setShowHeightPicker(false);
                }}>
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
    paddingHorizontal: 10,
    alignItems: "flex-start",
    width: "100%",
    top: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -30,
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 30,
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
    fontSize: 20,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    flex: 1,
  },
  locationTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationTouchable: {
    width: "92.5%", // Ensure it takes full width within locationContainer
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
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
    fontWeight: "bold",
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  dateInput: {
    flex: 1,
  },
  dateText: {
    fontSize: 20,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: "90%",
  },
  pickerContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 50,
  },
  picker: {
    width: 100,
    height: 150,
    backgroundColor: "#f9f9f9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    marginLeft: 5,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "#ff5a79",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
