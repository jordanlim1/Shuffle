import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const password = () => {
    useEffect(() => {
        (async () => {
            const auth = await AsyncStorage.getItem("code_verifier")
            if (auth) router.push("/gender")
        })
    }, [])
    return (
        <SafeAreaView>
            <View>
                <Text>New Password</Text>
                <TextInput textContentType='password' />

                <Text>Confirm Password</Text>
                <TextInput textContentType='password' />
            </View>


            <TouchableOpacity onPress={() => router.push("/gender")}>
                <Text>
                    Next
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default password

const styles = StyleSheet.create({})