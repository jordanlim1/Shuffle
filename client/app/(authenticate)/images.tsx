import { Button, StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getResgistrationInfo } from "../registrationUtils";

const images = () => {
  const [images, setImages] = useState<string[]>(["", "", "", "", "", ""]);

  const pickImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const addImages = async () => {
    try {
      const formData = new FormData();
      for (const uri of images) {
        if (uri) {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append("images", {
            uri: uri,
            type: "image/jpeg", // Set correct MIME type
            name: `photo-${Date.now()}.jpg`, // Unique filename
          } as any);
        }
      }

      const res = await fetch("http://192.168.1.5:3000/query/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  function handleDelete(idx: number) {
    const updatedImages = [...images];
    updatedImages[idx] = "";

    setImages(updatedImages);
  }

  async function finishProfile() {
    const name = await getResgistrationInfo("name");
    const email = await getResgistrationInfo("email");
    const age = await getResgistrationInfo("age");
    const gender = await getResgistrationInfo("gender");
    const orientation = await getResgistrationInfo("orientation");
    const password = await getResgistrationInfo("password");
    const artists = await getResgistrationInfo("artists");

    console.log(name, email, gender, age, orientation, artists);

    const body = {
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender,
      orientation: orientation,
      artists: artists,
      images: images,
    };

    const res = await fetch("http://192.168.1.35:3000/query/createProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {images.map((imageUri: string | null, idx: number) =>
          imageUri !== "" ? (
            <View key={idx}>
              <Image source={{ uri: imageUri! }} style={styles.image} />
              <Pressable onPress={() => handleDelete(idx!)}>
                <Text>Delete</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable key={idx} onPress={() => pickImage(idx)}>
              <Text>Upload Image</Text>
            </Pressable>
          )
        )}

        <Button title="post" onPress={addImages} />
        <Pressable onPress={finishProfile}>
          <Text>Finish Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default images;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: "black",
  },
});
