import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { saveRegistrationInfo } from "../registrationUtils";

const password = () => {
  const [password, setPassWord] = useState("");

  return (
    <SafeAreaView>
      <View>
        <Text>New Password</Text>
        <TextInput
          textContentType="password"
          onChangeText={(text) => {
            setPassWord(text);
            saveRegistrationInfo("password", password);
          }}
        />

        <Text>Confirm Password</Text>
        <TextInput textContentType="password" />
      </View>

      <TouchableOpacity onPress={() => router.push("/gender")}>
        <Text>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default password;

const styles = StyleSheet.create({});
