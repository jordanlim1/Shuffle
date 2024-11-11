import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileCard from "@/app/Reusable/ProfileCard";
import { Match } from "@/Interfaces/interfaces";

const Main = () => {
  const [matches, setMatches] = useState<Match[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getMatches();
  }, []);

  async function getMatches() {
    try {
      const profileId = await AsyncStorage.getItem("profileId");

      const response = await fetch(
        `http://192.168.137.245:3000/query/matches/${profileId}`
      );

      const data = await response.json();
      const filteredData = data.filter(
        (match: Match) => match._id !== profileId
      );

      setMatches(filteredData);
    } catch (error) {
      console.log("Error in getting matches", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView>
      <SafeAreaView>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          matches && <ProfileCard profileId={matches![index]._id} />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Main;

const styles = StyleSheet.create({});
