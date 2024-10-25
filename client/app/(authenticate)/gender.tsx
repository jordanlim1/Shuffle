import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const gender = () => {
const [gender, setGender] = useState("")
const router = useRouter()

const genders = [
    {value: "Male", icon: ""},
    {value: "Female", icon: ""},
    {value: "Non-Binary", icon: ""},
    {value: "Non-conforming", icon: ""}

]

  return (
    <SafeAreaView>
    <View>
      <Text>I am ...</Text>
      {genders.map((gender, idx) => {
        return (
            <TouchableOpacity key={idx}>
                <Text>{gender.value}</Text>
            </TouchableOpacity>
        )
      })}

      <TouchableOpacity style={styles.button}onPress={() => router.push("/orientation")}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default gender

const styles = StyleSheet.create({
    button: {
    padding: 10,
    backgroundColor: '#007bff', // Button background color
    borderRadius: 5,
  },})