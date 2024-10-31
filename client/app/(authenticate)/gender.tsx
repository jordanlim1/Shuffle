import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveRegistrationInfo } from "../registrationUtils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

const Gender = () => {
  const [gender, setGender] = useState("");
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
    saveRegistrationInfo("gender", genderValue);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Your Gender </Text>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={async () => {
              router.push("/password");
            }}
          >
            <AntDesign name="arrowleft" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={async () => {
              router.push("/orientation");
            }}
          >
            <AntDesign name="arrowright" size={30} color="white" />
          </TouchableOpacity>
        </View>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -30,
  },
  titleContainer: {
    position: "absolute",
    paddingHorizontal: 10,
    alignItems: "flex-start",
    width: "100%",
    top: 50,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
  },
  genderButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%", // Allows two buttons per row with some spacing
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selected: {
    backgroundColor: "#ff5a79",
    borderColor: "#d3d3d3",
    borderWidth: 2,
  },
  genderText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  floatingButton: {
    // position: "absolute",
    // bottom: 20,
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
  dotContainer: {
    display: "flex",
    flexDirection: "row",
  },
  dot: {
    fontSize: 70,
    color: "#333",
    marginHorizontal: 2,
  },
});

export default Gender;
