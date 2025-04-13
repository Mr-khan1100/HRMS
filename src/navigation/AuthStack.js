import React from 'react'
import SignInScreen from '@screens/authScreens/SignInScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { screenLabel } from '@constants/appConstant';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
   
    return (
        <Stack.Navigator initialRouteName={screenLabel.SIGNINSCREEN}>
            <Stack.Screen name={screenLabel.SIGNINSCREEN} component={SignInScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AuthStack