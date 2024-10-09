import { Text, View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import Login from "./login";

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Login />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1, // Makes ScrollView take full screen height
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally,
  },

});
