import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  function handleChange(key: string, value: string) {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  }

  async function authenticateUser() {
    const res = await fetch(); 
  }

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

        <TouchableOpacity onPress={authenticateUser} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
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
    width: "100%"
    
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
