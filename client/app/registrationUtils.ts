import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveRegistrationInfo = async (screenName: string, data: string) => {
  try {
    const key = `registration_progress_${screenName}`
    await AsyncStorage.setItem(screenName, JSON.stringify(data));
  } catch (err) {
    console.log("Error", err);
  }
};

export const getResgistrationInfo = async (screenName: string) => {
  try {
    const key = `registration_progress_${screenName}`
    const res = await AsyncStorage.getItem(key);

    return res !== null ? JSON.parse(res) : null
  } catch (err) {
    console.log("Error", err);
  }
};
