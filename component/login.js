import React, { useState, useContext } from 'react';
import { QuizContext } from '../QuizContext';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View , Alert, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  // https://www.youtube.com/watch?v=ZGIU5aIRi9M

  const navigation = useNavigation();
  const { signIn } = useContext(QuizContext);

  const handleSignIn = async () => {
    setFirebaseError(''); // Clear any previous Firebase errors

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      navigation.navigate('MainApp');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setFirebaseError('This email is not registered. Please sign up.');
        Alert.alert(
          'User Not Found',
          'This email is not registered. Please sign up.',
          [{ text: 'Sign Up', onPress: () => navigation.navigate('SignUpScreen') }]
        );
      } else if (error.code === 'auth/wrong-password') {
        setFirebaseError('Incorrect password. Please try again.');
        Alert.alert('Incorrect Password', 'Please enter the correct password.');
      } else if (error.code === 'auth/invalid-email') {
        setFirebaseError('Invalid email format. Please try again.');
        Alert.alert('Invalid Email', 'The email address format is incorrect.');
      } else {
        setFirebaseError('An error occurred. Please try again.');
        console.error('Login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <View style={styles.formWrapper}>
          <Text style={styles.headerText}>Sign In</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password:</Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Display Firebase error if present */}
          {firebaseError ? (
            <Text style={{ color: 'red', marginBottom: 10 }}>
              {firebaseError}
            </Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.6 }]}
            onPress={handleSignIn}
            disabled={loading} // Disable button during loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.prompt}>
            <Text style={styles.promptText1}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={styles.promptText}> Sign Up here</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 40,
    flex: 1,
    alignItems: 'center',
  },
  welcomeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
  },
  formWrapper: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  inputWrapper: {
    width: '90%',
    marginVertical: 10,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#525252',
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#60a5fa',
    padding: 12,
    width: '90%',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 20,
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  prompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    color: 'blue',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  promptText1: {
    fontWeight: 'bold',
  },
});
