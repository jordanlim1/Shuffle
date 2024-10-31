import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import "react-native-get-random-values";
import CryptoJS from "crypto-js";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { saveRegistrationInfo } from "../registrationUtils";
export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [codeChallenge, setCodeChallenge] = useState("");
  const [artists, setArtists] = useState<{ [key: string]: string }[]>();

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
      await AsyncStorage.setItem("access_token", response.access_token);
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

      saveRegistrationInfo("name", credentials.display_name);
      saveRegistrationInfo("email", credentials.email);

      const topArtists = [];

      for (let i = 0; i < artists.items.length; i++) {
        const artistIcons = artists.items[i].images;

        topArtists.push({
          name: artists.items[i].name as string,
          icon: artistIcons[artistIcons.length - 1].url,
        });
      }

      saveRegistrationInfo("artists", JSON.stringify(topArtists));
      router.push("/personalInfo");
    } catch (err) {
      console.log("Error" + err);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {" "}
        <Text style={styles.title}>Shuffle</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => handleChange("email", text)}
          value={credentials.email}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => handleChange("password", text)}
          value={credentials.password}
        />

        <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
          <View style={styles.buttonContent}>
            <Image
              source={require("../../assets/images/spotifylogo.png")}
              style={styles.logo}
            />
            <Text style={styles.buttonText}>Login with Spotify</Text>
          </View>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text> Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/personalInfo")}>
            <Text style={styles.linkText}> Sign up now! </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  },
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
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
  },
  input: {
    height: 48,
    width: "85%",
    borderColor: "#ff5a79",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 50, // Large font size for the title
    fontWeight: "bold", // Bold text
    color: "#ffb6c1", // Custom color for a unique look
    textAlign: "center",
    marginBottom: 80,
  },
});
