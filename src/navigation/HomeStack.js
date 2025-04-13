import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProfileScreen from '@screens/homeScreens/ProfileScreen'
import LeaveHistory from '@screens/homeScreens/LeaveHistory';
import ApplyLeave from '@screens/homeScreens/ApplyLeave';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@redux/slices/userSlice';
import ApproveLeave from '@screens/homeScreens/ApproveLeave';
import { COLORS } from '@styles/theme';
import activeHome from '@assets/images/Home-active.jpg';
import inactiveHome from '@assets/images/Home-inactive.jpg';
import activeLeave from '@assets/images/leave-active.png';
import inactiveLeave from '@assets/images/leave-inactive.png';
import activeHistory from '@assets/images/leave-history-active.jpg';
import inactiveHistory from '@assets/images/leave-history-inactive.jpg';
import { screenLabel } from '@constants/appConstant';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={screenLabel.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const LeaveHistoryStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={screenLabel.LEAVE_HISTORY}
        component={LeaveHistory}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const ApplyLeaveStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={screenLabel.APPLY_LEAVE}
        component={ApplyLeave}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const ApproveLeaveStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name={screenLabel.APPROVE_LEAVE}
        component={ApproveLeave}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const HomeStack = () => {
    const currentUser = useSelector(selectCurrentUser);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={styles.tabBarStyle}
        initialRouteName={screenLabel.PROFILE}>
        <Tab.Screen
          name={screenLabel.PROFILE}
          component={ProfileStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? COLORS.darkBlack : COLORS.grey,
                  fontSize: 10,
                }}>
                {screenLabel.PROFILE}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? activeHome
                    : inactiveHome
                }
                style={styles.logo}
                
              />
            ),
          }}
        />
       {currentUser?.role === 'manager' && <Tab.Screen
          name={screenLabel.APPROVE_LEAVE_LABEL}
          component={ApproveLeaveStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                    color: focused ? COLORS.darkBlack : COLORS.grey,
                    fontSize: 10,
                }}>
                {screenLabel.APPROVE_LEAVE_LABEL}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? activeLeave
                    : inactiveLeave
                }
                style={styles.logo}
              />
            ),
          }}
        />}
        <Tab.Screen
          name={screenLabel.LEAVE_HISTORY_LABEL}
          component={LeaveHistoryStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                    color: focused ? COLORS.darkBlack : COLORS.grey,
                    fontSize: 10,
                }}>
                {screenLabel.LEAVE_HISTORY_LABEL}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? activeHistory
                    : inactiveHistory
                }
                style={styles.logo}
              />
            ),
          }}
        />
        <Tab.Screen
          name={screenLabel.APPLY_LEAVE_LABEL}
          component={ApplyLeaveStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                    color: focused ? COLORS.darkBlack : COLORS.grey,
                    fontSize: 10,
                }}>
                {screenLabel.APPLY_LEAVE_LABEL}
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? activeLeave
                    : inactiveLeave
                }
                style={styles.logo}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default HomeStack

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBarStyle: {
        height: 60,
        paddingBottom: 5,
        display:  'flex',
    },
    logo:{
        width: 24, 
        height: 24,
        resizeMode : "contain",
    }
  });