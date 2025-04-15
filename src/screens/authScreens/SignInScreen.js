import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { BlueButton } from '@sharedComponents/BlueButton';
import eyeOpen from '@assets/images/eye-open.jpg';
import eyeClose from '@assets/images/eye-close.jpg';
import logo from '@assets/images/logo.jpg'
import { COLORS } from '@styles/theme';
import InputFields from '@sharedComponents/InputFields';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers, signInUser } from '@redux/slices/userSlice';
import { generalConst, keyboardType, labelConstants, placeholder, regex, screenLabel, validationMessage } from '@constants/appConstant';

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
        setError({ ...error, password: validationMessage.INCORRECT_PASSWORD });
        return;
      }
    }
    
    dispatch(signInUser(userCred));
    navigation.navigate(screenLabel.HOME);

  }

  const handleChange = (field, value) => {
    const trimmedValue = value.replace(/\s+/g, '');
    setUserCred(prev => ({ ...prev, [field]: field === 'email' ? trimmedValue.toLowerCase() : trimmedValue }));
    setError(prev => ({ ...prev, [field]: null }));
  };

  const validateInputs = (field, value) => {

    const newErrors = { ...error };

    if (!field || field === generalConst.EMAIL) {
      const emailValue = value || userCred.email;
      if (!emailValue) {
        newErrors.email = validationMessage.EMAIL_IS_REQUIRED;
      } else if (!regex.EMAIL.test(emailValue)) {
        newErrors.email = validationMessage.IVALID_EMAIL_FORMAT;
      }else if (!emailValue.startsWith(generalConst.USER_) && !emailValue.startsWith(generalConst.MANAGER_)) {
        newErrors.email = validationMessage.EMAIL_START_WITH;
      } else {
        delete newErrors.email;

      }
    }
    if (!field || field === generalConst.PASSWORD) {
      const passwordValue = value || userCred.password;
      if (!passwordValue) {
        newErrors.password = validationMessage.PASSWORD_IS_REQUIRED;
      } else if (!regex.PASSWORD.test(passwordValue)) {
        newErrors.password = validationMessage.PASSWORD_MUST_BE;
      } else {
        delete newErrors.password;
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <View style={styles.container} >
      <Image
        source={logo}
        style ={styles.logo}
      />
      <Text style={styles.title}>{labelConstants.SIGNIN}</Text>

      <InputFields 
            label={labelConstants.EMAIL} 
            value={userCred.email} 
            keyboardType={keyboardType.EMAIL}
            onFocus={() => {
              setError(prev => ({...prev, email:null}));
            }} 
            onBlur={() => validateInputs(generalConst.EMAIL, userCred.email)}
            onChangeText={value => handleChange(generalConst.EMAIL, value)}
            secureTextEntry={false}
            editable={true}
            maxLength={50}
            placeholder={placeholder.ENTER_EMAIL}
            error={error?.email}
        />

        <InputFields 
            label={labelConstants.PASSWORD} 
            value={userCred.password} 
            keyboardType={keyboardType.DEFAULT}
            onFocus={() => {setError(prev => ({...prev, password:null}));}} 
            onBlur={() => validateInputs(generalConst.PASSWORD, userCred.password)}
            onChangeText={value => handleChange(generalConst.PASSWORD, value)}
            onIconPress={toggleSecureEntry}
            iconSource={secureText ? eyeClose : eyeOpen}
            editable={true}
            secureTextEntry={secureText}
            maxLength={20}
            placeholder={placeholder.ENTER_PASSWORD}
            error={error?.password}
        />

      <BlueButton 
        label={labelConstants.SIGNIN}
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
    color: COLORS.headerLabel,
  },
  buttonContainer:{
    marginTop:10
  },
  logo:{
    width: '50%',
    height:'30%',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    resizeMode: 'contain',
  }
});
