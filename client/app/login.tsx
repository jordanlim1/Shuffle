import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { Linking } from "react-native"; // For opening external URLs
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import "react-native-get-random-values";
import CryptoJS from "crypto-js";
import { useRouter } from "expo-router"; // Use Expo Router for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigation();
  const router = useRouter(); // Get the router object from Expo Router

  function handleChange(key: string, value: string) {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  }

  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const authEndpoint = "https://accounts.spotify.com/authorize";

  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  // Performs SHA-256 hashing
  const sha256 = async (plain: string) => {
    const hash = CryptoJS.SHA256(plain);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  // URL-safe Base64 encoding
  const base64encode = (input: string) => {
    return input.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };

  // Spotify authentication function using Expo AuthSession
  async function handleAuthentication() {
    // Generate code verifier and code challenge
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // Store the code verifier in AsyncStorage
    await AsyncStorage.setItem("code_verifier", codeVerifier);

    return codeChallenge;
  }

  const codeChallenge = handleAuthentication();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "7425c2416852448a94bb199a9f49c0ba", // Replace with your actual Spotify client ID
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: "shuffle",
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log("Authorization Code:", code);

      router.push("/signup"); // This redirects to the signup page after login
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          onChangeText={(text) => handleChange("email", text)}
          value={credentials.email}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(text) => handleChange("password", text)}
          value={credentials.password}
        />

        <TouchableOpacity onPress={() => promptAsync()} style={styles.button}>
          <Text style={styles.buttonText}>Login with Spotify</Text>
        </TouchableOpacity>

        <Link href="/signup" style={styles.link}>
          <Text> Create Account </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensures SafeAreaView takes full height
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  container: {
    width: "100%", // Full width container
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: "80%", // Input takes 80% of available width
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    color: "#1e90ff",
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
  },
});
