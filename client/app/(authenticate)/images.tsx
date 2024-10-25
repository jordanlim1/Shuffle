import { Button, StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

const images = () => {
  const [image, setImage] = useState<string | null>(null);
  const formData = new FormData();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      try {
        // Fetch the image as a Blob
        const response = await fetch(image!);
        const blob = await response.blob();

        // Create FormData and append the Blob
        const formData = new FormData();
        formData.append("image", blob);

        // Send the FormData to the backend
        const res = await fetch("http://localhost:3000/query/images", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  async function handlePress() {
    console.log("clicked");
    console.log(formData);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>images</Text>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button title="post" onPress={handlePress} />
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
    backgroundColor: "black",
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: "black",
  },
});
