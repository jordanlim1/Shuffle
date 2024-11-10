import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import "react-native-get-random-values";
import CryptoJS from "crypto-js";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { saveRegistrationInfo } from "../reusable/registrationUtils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [codeChallenge, setCodeChallenge] = useState("");
  const logo = require("../../assets/images/logo.png");

  const clientId = process.env.EXPO_PUBLIC_CLIENT_ID;
  const authorizationEndpoint = process.env.EXPO_PUBLIC_AUTHORIZATION_ENDPOINT;
  const tokenEndpoint = process.env.EXPO_PUBLIC_TOKEN_ENDPOINT;

  function handleChange(key: string, value: string) {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  }

  const discovery = {
    authorizationEndpoint: authorizationEndpoint,
    tokenEndpoint: tokenEndpoint,
  };

  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain: string) => {
    const hash = CryptoJS.SHA256(plain);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  const base64encode = (input: string) => {
    return input.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  async function handleAuthentication() {
    const codeVerifier = generateRandomString(64);
    const encodedCodeVerifier = base64encode(btoa(codeVerifier));

    const hashed = await sha256(encodedCodeVerifier);
    const codeChallenge = base64encode(hashed);

    await AsyncStorage.setItem("code_verifier", encodedCodeVerifier);

    setCodeChallenge(codeChallenge);
  }

  useEffect(() => {
    handleAuthentication();
  }, []);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId!,
      scopes: [
        "user-top-read",
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
      ],
      usePKCE: true,
      redirectUri: makeRedirectUri({
        scheme: "shuffle",
      }),
      codeChallenge: codeChallenge || "",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      getAccessToken(code);
    }
  }, [response]);

  async function getAccessToken(code: string) {
    let codeVerifier = await AsyncStorage.getItem("code_verifier");

    if (!codeVerifier) {
      throw new Error("Code verifier not found");
    }

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId!,
        grant_type: "authorization_code",
        code,
        redirect_uri: makeRedirectUri({
          scheme: "shuffle",
        }),
        code_verifier: request?.codeVerifier!,
      }).toString(),
    };

    const body = await fetch(tokenEndpoint!, payload);
    const response = await body.json();

    if (response.access_token) {
      await SecureStore.setItemAsync("access_token", response.access_token);

      getProfile(response.access_token);
    } else {
      throw new Error("Failed to retrieve access token");
    }
  }

  async function getProfile(accessToken: string) {
    try {
      const artistsData = await fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=5",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      const playlistData = await fetch(
        "https://api.spotify.com/v1/me/playlists?limit=5",
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      const credentialsData = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      if (!artistsData.ok || !credentialsData.ok) {
        console.error(
          "Spotify API returned an error:",
          artistsData.status,
          artistsData.statusText
        );
        const errorData = await artistsData.json();
        console.error("Error details:", errorData);
        throw new Error(
          `Spotify API Error: ${errorData.error.message || "Unknown error"}`
        );
      }

      const artists = await artistsData.json();
      const credentials = await credentialsData.json();
      const playlists = await playlistData.json();

      // console.log(playlists);
      await saveRegistrationInfo("name", credentials.display_name);
      await saveRegistrationInfo("email", credentials.email);
      await saveRegistrationInfo("user_id", credentials.id);

      const topArtists = [];

      for (let i = 0; i < artists.items.length; i++) {
        const artistIcons = artists.items[i].images;

        topArtists.push({
          name: artists.items[i].name as string,
          icon: artistIcons[artistIcons.length - 1].url,
        });
      }

      saveRegistrationInfo("artists", topArtists);
      router.push("/filler");
    } catch (err) {
      console.log("Error" + err);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Image source={logo} style={styles.icon} />
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#333"}
            onChangeText={(text) => handleChange("email", text)}
            value={credentials.email}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"#333"}
            secureTextEntry={true}
            onChangeText={(text) => handleChange("password", text)}
            value={credentials.password}
          />

          <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
            <Image
              source={require("../../assets/images/spotifylogo.png")}
              style={styles.logo}
            />
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>LOGIN WITH SPOTIFY</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/about")}
            style={styles.button}
          >
            <MaterialCommunityIcons
              name="account-reactivate-outline"
              style={styles.logo}
              size={40}
              color="#d3d3d3"
            />
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#faf8f6",
    width: "100%",
    justifyContent: "center",
  },
  linkText: {
    color: "#1e90ff", // Blue color for the link
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  signup: {
    fontSize: 16,
  },
  icon: {
    height: 300,
    width: 300,
    marginRight: 20,
  },
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 30,
    borderRadius: 16, // Rounded corners
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff5a79", // A fun, romantic color for the labels
    marginBottom: 8,
    fontFamily: "NotoSansMono",
  },
  input: {
    height: 50,
    width: "90%",
    borderColor: "#d3d3d3",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 40,
    marginTop: 10,
    width: "90%",
    borderColor: "#d3d3d3",
    borderWidth: 2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  logo: {
    width: 40,
    height: 40,
    left: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  title: {
    fontSize: 50, // Large font size for the title
    fontWeight: "bold", // Bold text
    color: "#ffb6c1", // Custom color for a unique look
    textAlign: "center",
    marginBottom: 80,
    fontFamily: "NotoSansMono",
  },
});
