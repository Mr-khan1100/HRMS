import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useTabBar } from '../contexts/TabBarContext';
import ProfileScreen from '../screens/homeScreens/ProfileScreen'
import { COLORS } from '../styles/theme';
import LeaveHistory from '../screens/homeScreens/LeaveHistory';
import ApplyLeave from '../screens/homeScreens/ApplyLeave';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/slices/userSlice';
import ApproveLeave from '../screens/homeScreens/ApproveLeave';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
    return(
        <Stack.Navigator
        screenOptions={{
        animationEnabled: false,
        }}>
        <Stack.Screen
        name="ProfileScreen"
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
        name="LeaveHistory"
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
        name="ApplyLeave"
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
        name="ApproveLeave"
        component={ApproveLeave}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
    )
}

const HomeStack = () => {
    // const {isTabBarVisible} = useTabBar();
    const currentUser = useSelector(selectCurrentUser);


  return (
    <View style={styles.container}>
      <Tab.Navigator
        // ref={tabNavigatorRef}
        screenOptions={{
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            display:  'flex',
          },
        }}
        initialRouteName="Profile">
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? '#0076BD' : '#4E4E4E',
                  fontSize: 10,
                }}>
                Profile
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? require('../assets/images/Home-active.jpg')
                    : require('../assets/images/Home-inactive.jpg')
                }
                style={styles.logo}
                resizeMode="contain"
              />
            ),
          }}
        />
       {currentUser?.role === 'manager' && <Tab.Screen
          name="Approve Leave"
          component={ApproveLeaveStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? '#0076BD' : '#4E4E4E',
                  fontSize: 10,
                }}>
                Approve History
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? require('../assets/images/leave-active.png')
                    : require('../assets/images/leave-inactive.png')
                }
                style={styles.logo}
                resizeMode="contain"
              />
            ),
          }}
        />}
        <Tab.Screen
          name="Leave History"
          component={LeaveHistoryStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? '#0076BD' : '#4E4E4E',
                  fontSize: 10,
                }}>
                Leave History
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? require('../assets/images/leave-history-active.jpg')
                    : require('../assets/images/leave-history-inactive.jpg')
                }
                style={styles.logo}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Apply Leave"
          component={ApplyLeaveStack}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: focused ? '#0076BD' : '#4E4E4E',
                  fontSize: 10,
                }}>
                Apply Leave
              </Text>
            ),
            headerShown: false,
            tabBarIcon: ({focused}) => (
                <Image
                source={
                  focused
                    ? require('../assets/images/leave-active.png')
                    : require('../assets/images/leave-inactive.png')
                }
                style={styles.logo}
                resizeMode="contain"
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
    logo:{
        width: 24, 
        height: 24,
        // tintColor: COLORS.background
    }
  });