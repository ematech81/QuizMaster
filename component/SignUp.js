import React, { useState, useContext } from 'react';
import { QuizContext } from '../QuizContext';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import CheckBox from '@react-native-community/checkbox';




function SignUp() {


  const navigation = useNavigation();
  // State to store error messages
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');
  const [firebaseVissible, setFirebaseVissible] = useState(true);

  const [loading, setLoading] = useState(false);
   const [isChecked, setIsChecked] = useState(false);
   const [privacyError, setPrivacyError] = useState(false);

  const {
    signUp,
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    confirmPassword,
    setConfirmPassword
  } = useContext(QuizContext);


  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

    const openPrivacyPolicy = () => {
      Linking.openURL(
        'https://ematech81.github.io/privacyPolicy/#privacy-policy'
      );
    };

    const openTermsAndConditions = () => {
      Linking.openURL(
        'https://ematech81.github.io/privacyPolicy/#terms-and-conditions'
      );
    };

const handleSignUp = async () => {
  if (isChecked) {
  setEmailError('');
  setUsernameError('');
  setPasswordError('');
  setConfirmPasswordError('');
  setFirebaseError('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let hasError = false;

  if (!emailRegex.test(email)) {
    setEmailError('Please enter a valid email address');
    hasError = true;
  } else if (email.trim() === '') {
    setEmailError('Email field cannot be empty');
    hasError = true;
  }

  if (username.trim() === '') {
    setUsernameError('Please enter a username');
    hasError = true;
  }

  if (password.length < 6) {
    setPasswordError('Password length cannot be less than 6 characters');
    hasError = true;
  }

  if (confirmPassword !== password) {
    setConfirmPasswordError('Passwords do not match');
    hasError = true;
  }

  if (hasError) return;

  try {
    setLoading(true);
    await signUp(username, email, password);
    navigation.navigate('MainApp');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      setFirebaseError(
        'This email is already registered. Please log in instead.'
      );
    } else if (error.code === 'auth/invalid-email') {
      setFirebaseError('Invalid email address. Please enter a valid email.');
    } else if (error.message === 'auth/username-already-in-use') {
      setFirebaseError('Username is already taken.');
    } else {
      setFirebaseError('An error occurred during sign-up. Please try again.');
    }
    console.error('Sign-up error:', error);
  } finally {
    setLoading(false);
  }
  } else {
    setPrivacyError(
      'Please agree to the Privacy Policy and Terms and Conditions.'
    );
  }
  
};




  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {firebaseError && (
          <View style={styles.fireBaseError}>
            <Text
              style={{
                color: 'red',
                fontWeight: '600',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              {firebaseError}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignInScreen')}
            >
              <Text
                style={{
                  marginVertical: 20,
                  color: 'blue',
                  fontWeight: 'bold',
                }}
              >
                Login Here
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text
                style={{
                  marginVertical: 20,
                  color: 'blue',
                  fontWeight: 'bold',
                }}
              >
                close
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ padding: 16, marginTop: 40 }}>
          <Text style={styles.signUp}>Welcome</Text>

          <View style={styles.formWrapper}>
            <Text style={styles.signUp}>Sign Up</Text>
            <View style={{ width: '90%', margin: 'auto', marginVertical: 20 }}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text.trim())}
                style={styles.input}
                autoCapitalize="none" // Prevents accidental capitalization on mobile
                keyboardType="email-address" // Suggests email keyboard on mobile
              />
              {emailError && (
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 14 }}>
                  {emailError}
                </Text>
              )}
            </View>
            <View style={{ width: '90%', margin: 'auto', marginVertical: 20 }}>
              <Text style={styles.label}>Username:</Text>
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
              {usernameError && (
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 14 }}>
                  {usernameError}
                </Text>
              )}
            </View>
            <View style={{ width: '90%', margin: 'auto', marginVertical: 15 }}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text.trim())}
                secureTextEntry
                style={styles.input}
              />
              {passwordError && (
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 14 }}>
                  {passwordError}
                </Text>
              )}
            </View>
            <View style={{ width: '90%', margin: 'auto', marginVertical: 15 }}>
              <Text style={styles.label}> Confirm Password:</Text>
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text.trim())}
                secureTextEntry
                style={styles.input}
              />
              {confirmPasswordError && (
                <Text style={{ color: 'red', fontWeight: '600', fontSize: 14 }}>
                  {confirmPasswordError}
                </Text>
              )}
            </View>
            <View style={styles.checkboxContainer}>
              {/* <CheckBox
                value={isChecked}
                onValueChange={handleCheckBoxChange}
              /> */}
              <Text style={styles.labelPrivacy}>
                I agree to the{' '}
                <Text style={styles.link} onPress={openPrivacyPolicy}>
                  Privacy Policy
                </Text>{' '}
                and{' '}
                <Text style={styles.link} onPress={openTermsAndConditions}>
                  Terms and Conditions
                </Text>
                .
              </Text>
            </View>

            <TouchableOpacity style={styles.submit} onPress={handleSignUp}>
              <Text
                style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            {privacyError && <Text>{setPrivacyError}</Text>}

            <View style={styles.prompt}>
              <Text style={styles.promptText1}>Already have an account?</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <Pressable onPress={() => navigation.navigate('SignInScreen')}>
                  <Text style={styles.promptText}>Sign In here</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default SignUp;




const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d2331',
    textAlign: 'center',
    marginVertical: 20,
  },
  signUp: {
    

    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
 
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    paddingLeft: 15,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#525252',
  },
  submit: {
   height:50,
   width: "90%",
    padding: 6,
    marginVertical: '15',
    backgroundColor: '#60a5fa',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  formWrapper: {
    
    
    // padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 10,
  },
  prompt: {
    width: '90%',
    margin: 'auto',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  promptText: {
    color: 'blue',
    textDecorationLine: 'black',
    fontWeight: 'bold',
  },
  promptText1: {
    fontWeight: 'bold',
    marginLeft: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  fireBaseError: {
    width: '90%',
    height: 200,
    backgroundColor: '#FFF',
    elevation: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '10%',
    zIndex: 10,
    margin: 'auto',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
  },
  labelPrivacy: {
    marginLeft: 10,
    color: '#34495e',
  },
  link: {
    color: '#1A2D85',
    textDecorationLine: 'underline',
  },
});