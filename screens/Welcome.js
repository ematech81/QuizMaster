import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  
} from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { StatusBar } from 'expo-status-bar';

export default function Welcome({ navigation }) {

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
      if (hasSeenWelcome) {
        navigation.replace('MainApp'); // Redirect to MainApp if welcome was already seen
      }
    };
    checkFirstVisit();
  }, []);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true'); // Set flag
    navigation.replace('MainApp'); // Navigate to main app
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5D1A99', '#1A2D85']}
        start={{ x: 0, y: 0 }} // Gradient starts from the top-left corner
        end={{ x: 1, y: 1 }} // Gradient ends at the bottom-right corner
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            Welcome to <Text style={{ color: '#9ee86f' }}>QuizMaster</Text>!
          </Text>
          <Text style={styles.subtitle}>
            Test your knowledge and earn rewards! From sports to science,
            challenge yourself with questions that cover every aspect of life.
            Answer correctly, earn cash, and unlock bonus rewards!
          </Text>
          <Text style={styles.question}>Ready to take on the challenge?</Text>
          <Button title="Get Started" onPress={handleGetStarted} />
        </View>
      </LinearGradient>

      {/* Disable the status bar */}
      <StatusBar barStyle="light-content" backgroundColor="#5D1A99" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
      },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 26
  },
  question: {
    fontSize: 18,
    color: '#9ee86f',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
