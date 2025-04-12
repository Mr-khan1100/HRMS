import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
import { BlueButton } from '../../sharedComponents/BlueButton';
import eyeOpen from '../../assets/images/eye-open.jpg';
import eyeClose from '../../assets/images/eye-close.jpg';
import { COLORS } from '../../styles/theme';
import InputFields from '../../sharedComponents/InputFields';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers, signInUser } from '../../redux/slices/userSlice';

const SignInScreen = ({navigation}) => {
  const [userCred, setUserCred] = useState({email:'', password:''});
  const [error, setError] = useState({email:null, password:null});
  const [secureText, setSecureText] = useState(true);
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);

  const toggleSecureEntry = () => {
    setSecureText(!secureText);
  };

  const handleSignIn = () =>{
    if(!validateInputs()) return;
    const existingUser = allUsers.find(user => user.email === userCred.email);
    
    if (existingUser) {
      if (existingUser.password !== userCred.password) {
        setError({ ...error, password: 'Incorrect password' });
        return;
      }
    }
    
    dispatch(signInUser(userCred));
    navigation.navigate('Home');

  }

  const handleChange = (field, value) => {
    const trimmedValue = value.replace(/\s+/g, '');
    setUserCred(prev => ({ ...prev, [field]: trimmedValue }));
    setError(prev => ({ ...prev, [field]: '' }));
  };

  const validateInputs = (field, value) => {
    const newErrors = { ...error };

    if (!field || field === 'email') {
      const emailValue = value || userCred.email;
      if (!emailValue) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        newErrors.email = 'Invalid email format';
      }else if (!emailValue.startsWith('User_') && !emailValue.startsWith('Manager_')) {
        newErrors.email = 'Email must start with either User_ or Manager_';
      } else {
        delete newErrors.email;
      }
    }

    if (!field || field === 'password') {
      const passwordValue = value || userCred.password;
      if (!passwordValue) {
        newErrors.password = 'Password is required';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*["'+,.:;<>_`|~!@#?£\-$%^&*{}()\$%\^&\*\{}\()\-\]\\/[])(?=.{8,})/.test(passwordValue)) {
        newErrors.password =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
      } else {
        delete newErrors.password;
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <InputFields 
            label={'Email'} 
            value={userCred.email} 
            keyboardType={'email-address'}
            onFocus={() => {
              setError(prev => ({...prev, email:null}));
            }} 
            onBlur={() => validateInputs('email', userCred.email)}
            onChangeText={value => handleChange('email', value)}
            secureTextEntry={false}
            editable={true}
            maxLength={50}
            placeholder={'Enter Email'}
            error={error?.email}
        />

        <InputFields 
            label={'Password'} 
            value={userCred.password} 
            keyboardType={'default'}
            onFocus={() => {setError(prev => ({...prev, password:null}));}} 
            onBlur={() => validateInputs('password', userCred.password)}
            onChangeText={value => handleChange('password', value)}
            onIconPress={toggleSecureEntry}
            iconSource={secureText ? eyeClose : eyeOpen}
            editable={true}
            secureTextEntry={secureText}
            maxLength={20}
            placeholder={'Enter Password'}
            error={error?.password}
        />

      <BlueButton 
        label={'Sign In'}
        onPress={handleSignIn}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: COLORS.blue,
  },
  buttonContainer:{
    marginTop:10
  }
});
