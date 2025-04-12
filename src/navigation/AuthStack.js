import { View, Text } from 'react-native'
import React from 'react'
import SignInScreen from '../screens/authScreens/SignInScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

const AuthStack = () => {
   
    return (
        <Stack.Navigator initialRouteName={"SignInScreen"}>
            <Stack.Screen name='SignInScreen' component={SignInScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AuthStack