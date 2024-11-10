import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Dots from "../Reusable/Dots";
import NextButton from "../Reusable/NextButton";
const Gender = () => {
  const [gender, setGender] = useState("");

  const genders = [
    {
      value: "Male",
      icon: (
        <MaterialCommunityIcons name="gender-male" size={36} color="black" />
      ),
    },
    {
      value: "Female",
      icon: (
        <MaterialCommunityIcons name="gender-female" size={36} color="black" />
      ),
    },
    {
      value: "Non-Binary",
      icon: (
        <MaterialCommunityIcons
          name="gender-non-binary"
          size={36}
          color="black"
        />
      ),
    },
    {
      value: "Transgender",
      icon: <MaterialIcons name="transgender" size={36} color="black" />,
    },
    {
      value: "Genderless",
      icon: <FontAwesome name="genderless" size={36} color="black" />,
    },
    {
      value: "Other",
      icon: <MaterialIcons name="more-horiz" size={36} color="black" />,
    },
  ];

  function handlePress(genderValue: string) {
    setGender(genderValue);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Gender </Text>
          <Dots />
        </View>
        <View style={styles.gridContainer}>
          {genders.map((genders, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.genderButton,
                genders.value === gender ? styles.selected : null,
              ]}
              onPress={() => handlePress(genders.value)}
            >
              {genders.icon}
              <Text style={styles.genderText}>{genders.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <NextButton state={gender} route={"preference"} screenName="gender" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -30,
  },
  titleContainer: {
    position: "absolute",
    paddingHorizontal: 10,
    alignItems: "flex-start",
    width: "100%",
    top: 40,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  genderButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%", 
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selected: {
    backgroundColor: "#fde",
    borderColor: "#ffb6c1",
    borderWidth: 2,
  },
  genderText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
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
  buttonContainer: {
    position: "absolute",
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    bottom: 20,
    flexDirection: "row",
  },
});

export default Gender;
