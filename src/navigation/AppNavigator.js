import { View, Text } from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react'
import { COLORS } from '../styles/theme'
import { TabBarProvider } from '../contexts/TabBarContext'
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/userSlice';

const AppNavigator = () => {
    const Stack = createNativeStackNavigator();
    const currentUser = useSelector(selectCurrentUser);
    console.log(currentUser, 'currentuser');
    
  return (
    // <TabBarProvider>
        <NavigationContainer
        // ref={navigationRef}
        >
            <Stack.Navigator
                screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                }}
                initialRouteName={currentUser ? 'Home' : 'Auth'}>
                    <Stack.Screen
                        name="Auth"
                        component={AuthStack}
                        options={{gestureEnabled: false, navigationBarColor:COLORS.background}}
                    />
                    <Stack.Screen
                        name="Home"
                        component={HomeStack}
                        options={{gestureEnabled: false , navigationBarColor:COLORS.background}}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    // </TabBarProvider>
  )
}

export default AppNavigator