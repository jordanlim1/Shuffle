
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import React from "react";


export default function Index() {
  return (
    <View>
    <Text> Hello </Text>
    </View>
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
