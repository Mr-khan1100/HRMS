import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUser } from '../../redux/slices/userSlice';
import { CommonActions } from '@react-navigation/native';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.currentUser);

  const handleLogout = () => {
    props.navigation.navigate('Auth');
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Auth'}, 
            ],
          })
        )
    dispatch(signOutUser());

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>User Profile</Text>

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

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    marginBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0076BD',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
