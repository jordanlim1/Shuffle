import { Button, StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const images = () => {
  const [images, setImages] = useState<string[]>(["", "", "", "", "", ""]);
  const formData = new FormData();

  const pickImage = async (index: number) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri; // Replace empty slot at specified index
      setImages(newImages);
    }
  };

  const addImages = async () => {
    try {
      console.log(images);
      const formData = new FormData();
      for (const uri of images) {
        if (uri) {
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append("images", blob, `photo-${Date.now()}.jpg`);
        }
      }

      // Send the FormData to the backend
      const res = await fetch("http://localhost:3000/query/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      await AsyncStorage.setItem("images", data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {images.map((imageUri: string | null, idx: number) =>
          imageUri !== "" ? (
            <Image key={idx} source={{ uri: imageUri! }} style={styles.image} />
          ) : (
            <Pressable key={idx} onPress={() => pickImage(idx)}>
              <Text>Upload Image</Text>
            </Pressable>
          )
        )}

        <Button title="post" onPress={addImages} />
        <Pressable>Finish Profile</Pressable>
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
