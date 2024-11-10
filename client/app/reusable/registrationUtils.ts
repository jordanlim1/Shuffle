import AsyncStorage from "@react-native-async-storage/async-storage";


export const saveRegistrationInfo = async <T>(screenName: string, data: T) => {
  try {
    const key = `registration_progress_${screenName}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.log("Error", err);
  }
};

export const getResgistrationInfo = async (screenName: string) => {
  try {
    const key = `registration_progress_${screenName}`;
    const res = await AsyncStorage.getItem(key);

    return res !== null ? JSON.parse(res) : null;
  } catch (err) {
    console.log("Error", err);
  }
};


