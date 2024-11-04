import { Button, StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { saveRegistrationInfo } from "../registrationUtils";
import Dots from "../reusable/Dots";
import Feather from "@expo/vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

const Images = () => {
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
            type: "image/jpeg",
            name: `photo-${Date.now()}.jpg`,
          } as any);
        }
      }

      const res = await fetch("http://192.168.1.78:3000/query/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data) {
        await saveRegistrationInfo("images", data);
        return res.ok;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  function handleDelete(idx: number) {
    const updatedImages = [...images];
    updatedImages[idx] = "";
    setImages(updatedImages);
  }

  async function handleNext() {
    const uploadedImagesCount = images.filter((uri) => uri !== "").length;

    if (uploadedImagesCount < 5) {
      alert("Upload at least 5 photos to continue.");
      return;
    }

    const uploadImages = await addImages();
    if (uploadImages) router.push("/finish");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Images</Text>
          <Dots />
        </View>
        <View style={styles.gridContainer}>
          {images.map((imageUri: string | null, idx: number) => (
            <View key={idx} style={styles.imageBox}>
              {imageUri ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDelete(idx)}
                  >
                    <Text style={styles.deleteText}>
                      <Feather name="x-circle" size={36} color="black" />
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.uploadBox}
                  onPress={() => pickImage(idx)}
                >
                  <Text style={styles.uploadText}>Upload Image</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.floatingButton} onPress={handleNext}>
          <AntDesign name="arrowright" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Images;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  titleContainer: {
    position: "absolute",
    alignItems: "flex-start",
    width: "100%",
    top: 50,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    marginBottom: -30,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 25,
  },
  imageBox: {
    width: "45%",
    aspectRatio: 1,
    marginBottom: 15,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadBox: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  uploadText: {
    color: "#333",
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 9,
    padding: 2,
  },
  deleteText: {
    color: "white",
    fontSize: 10,
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 40,
    backgroundColor: "#ff5a79",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
});
