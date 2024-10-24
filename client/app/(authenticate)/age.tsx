import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { saveRegistrationInfo } from "../registrationUtils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs, { Dayjs } from "dayjs";
const age = () => {
  const [age, setAge] = useState();

  function handleAge(e?: Dayjs | null) {
    console.log(e);
  }

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <SafeAreaView>
        {/* <TextInput
          style={styles.textInput}
          placeholder="Input Your Birthday"
          placeholderTextColor={"#000"}
          keyboardType="numeric"
          onChange={handleAge}
        /> */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker disableFuture onChange={handleAge} />
        </LocalizationProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default age;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensures SafeAreaView takes full height
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    backgroundColor: "#f9f9f9",
    width: "100%",
  },

  textInput: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
  },
});
