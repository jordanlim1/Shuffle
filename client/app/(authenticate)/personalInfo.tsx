import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Button,
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

const personalInfo = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [age, setAge] = useState<number>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //if user signed in w/ spotify oauth, this fields should be prepopulated
  useEffect(() => {
    prefill();
  }, []);

  async function prefill() {
    const name = await getResgistrationInfo("name");
    const email = await getResgistrationInfo("email");
    setName(name!);
    setEmail(email!);
  }

  // Handle date picker value changes
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    const currentYear = dayjs().year();
    const birthYear = dayjs(currentDate).year();
    const calculatedAge = currentYear - birthYear;
    setAge(calculatedAge);
    saveRegistrationInfo("age", JSON.stringify(age));
  };

  return (
    <View style={styles.container}>
      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.textInput}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.textInput}
      />

      <Text>Enter Your Birthday</Text>
      <TouchableOpacity onPress={() => setShow(true)} style={styles.button}>
        <Text style={styles.buttonText}>
          {dayjs(date).format("YYYY-MM-DD")}
        </Text>
      </TouchableOpacity>

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
                textColor="black"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          const verified = await AsyncStorage.getItem("access_token");
          verified !== null ? router.push("/gender") : router.push("/password");
        }}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default personalInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textInput: {
    borderColor: "black",
    width: "100%",
    borderWidth: 2,
  },
  button: {
    padding: 10,
    backgroundColor: "#007bff", // Button background color
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff", // Button text color
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
