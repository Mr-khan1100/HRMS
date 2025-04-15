import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUser } from '@redux/slices/userSlice';
import { CommonActions } from '@react-navigation/native';
import { COLORS } from '@styles/theme';
import { BlueButton } from '@sharedComponents/BlueButton';
import { labelConstants, screenLabel } from '@constants/appConstant';
import { useConfirmationModal } from '../../contexts/ConfirmationModalContext';
import CustomHeader from '@sharedComponents/CustomHeader';


const ProfileScreen = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.users.currentUser);
    const { showConfirmation } = useConfirmationModal();
  

    const handleLogout = async() => {
        const confirmed = await showConfirmation(
            'Confirm Logout',
            `Are you sure you want to Logout?`
        );
        if(confirmed){
            props.navigation.navigate(screenLabel.AUTH);
                props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                    { name: screenLabel.AUTH}, 
                    ],
                })
                )
            dispatch(signOutUser());
        }
    };

  return (
    <>
        <CustomHeader title={screenLabel.PROFILE_SCREEN_LABEL}/>
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
            {/* <Text style={styles.heading}>User Profile</Text> */}

            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{user.id}</Text>

            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{user.age}</Text>

            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{user.gender}</Text>

            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{user.role}</Text>

            <Text style={styles.label}>Join Date:</Text>
            <Text style={styles.value}>
            {new Date(user.joinDate).toLocaleDateString()}
            </Text>

            <Text style={styles.label}>Leave Applied:</Text>
            <Text style={styles.value}>
            {user.leaveApplied?.length ?? 0} leaves
            </Text>
        </View>

            <BlueButton
                label={labelConstants.LOGOUT}
                onPress={handleLogout}
                buttonStyle={styles.logoutButton}
                textStyle={styles.logoutText}
            />
        </ScrollView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.offWhite,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    marginBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.headerLabel,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.labelText,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: COLORS.value,
  },
  logoutButton: {
    backgroundColor: COLORS.maroon,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
