import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { router, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const orientation = () => {

const [preferences, setPreferences] = useState("") 
    const options = [
        {value:"Men", icon: ""},
        {value:"Women", icon: ""},
        {value: "Both", icon: ""}, 
        
    ]

  return (
    <SafeAreaView>
    <View>
      <Text>I am interested in...</Text>
      {options.map((preference, idx) => {
        return (
            <TouchableOpacity>
                {preference.value}
            </TouchableOpacity>
        )
      })}

      <TouchableOpacity onPress={() => router.push("/images")}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

export default orientation

const styles = StyleSheet.create({})