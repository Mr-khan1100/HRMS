import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react'
import { COLORS } from '@styles/theme'
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@redux/slices/userSlice';
import { screenLabel } from '@constants/appConstant';
import { ConfirmationModalProvider } from '../contexts/ConfirmationModalContext';

const AppNavigator = () => {
    const Stack = createNativeStackNavigator();
    const currentUser = useSelector(selectCurrentUser);
    
  return (
    <ConfirmationModalProvider>
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                headerShown: false,
                gestureEnabled: false,
                }}
                initialRouteName={currentUser ? screenLabel.HOME : screenLabel.AUTH}>
                    <Stack.Screen
                        name = {screenLabel.AUTH}
                        component={AuthStack}
                        options={{gestureEnabled: false, navigationBarColor:COLORS.background}}
                    />
                    <Stack.Screen
                        name={screenLabel.HOME}
                        component={HomeStack}
                        options={{gestureEnabled: false , navigationBarColor:COLORS.background}}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    // </ConfirmationModalProvider>
  )
}

export default AppNavigator