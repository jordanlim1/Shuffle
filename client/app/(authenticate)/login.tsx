import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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
      router.push("/age");
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

      saveRegistrationInfo("name", credentials.display_name)
      saveRegistrationInfo("email", credentials.email)

      const topArtists = [];

      for (let i = 0; i < artists.items.length; i++) {
        const artistIcons = artists.items[i].images;

        topArtists.push({
          name: artists.items[i].name as string,
          icon: artistIcons[artistIcons.length - 1].url,
        });
      }

      setArtists(topArtists);
    } catch (err) {
      console.log("Error" + err);
    }
  }

  // async function createProfile() {
  //   try {
  //     const response = await fetch(
  //       "http://192.168.1.5:3000/auth/createProfile",
  //       {
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           artists: artists,
  //           email: email,
  //           name: name,
  //         }),
  //       }
  //     );
  //   } catch (err) {
  //     console.log("Error in create profile", err);
  //   }
  // }

  // useEffect(() => {
  //   if (!artists) return;
  //   else createProfile();
  // }, [artists]);

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

        <TouchableOpacity>
          <Text> Create Account </Text>
        </TouchableOpacity>
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
