

import React, { useContext, useEffect, useState,  useCallback  } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, SafeAreaView, StatusBar, Alert,  BackHandler, Pressable } from 'react-native';
import BackArrow from '../custom/backArrow';
import { QuizContext } from '../QuizContext';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

const QuestionScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    fetchQuestions,
    quizStarted,
    setQuizStarted,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    selectedOption,
    setSelectedOption,
    popupMessage,
    popupVisible,
    remainingTime,
    handleSubmit,
    // handleStartQuiz,
    currentCategory,
    isTimeUp,
    isSubmitted,
    stopTimer,
    startTrackingTime,
    stopAndSaveTime,
    setIsFetchingQuestions,
    isFetchingQuestions,
    user,
    stats,
    //  saveCategoryProgress
  } = useContext(QuizContext);

  navigation = useNavigation();

  const { categoryName } = route.params || {};
  const [startTime, setStartTime] = useState(null); // Track the start time of the question

  // Initialize startTime when a question is displayed
  useEffect(() => {
    const startTime = startTrackingTime();
    setStartTime(startTime);

    // Stop timer and save when the screen is exited
    return () => stopAndSaveTime(startTime);
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // startTimer();
    } else {
      stopTimer();
    }

    // Cleanup function to ensure the timer is stopped on unmount
    return () => stopTimer();
  }, [isFocused]);

  // Call handleSubmit when the user answers a question (pass whether they were correct or not)
  const onQuestionAnswered = (isCorrect) => {
    handleSubmit(isCorrect); // Update correct/failed answers and attempted questions

    // Stop the timer and save the time spent on this question
    stopAndSaveTime(startTime);
  };

  // Start Quiz function to handle quiz initiation
  const handleStartQuiz = async () => {
    try {
      setIsLoading(true); // Start loading
      // Fetch questions for the selected category
      await fetchQuestions(categoryName);

      // Reset the quiz state and start the quiz timer
      setQuizStarted(true); // This triggers the quiz UI to appear
      // setCurrentQuestionIndex(0); // Start from the first question
      setIsLoading(false); // End loading
    } catch (error) {
      console.log('Error starting quiz:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // Show loading indicator while loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ marginTop: 10, color: 'black', fontWeight: 'bold' }}>
          Loading Question...
        </Text>
        <Text>Please wait a seconds...</Text>
      </View>
    );
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       // Stop the timer when the screen loses focus
  //       stopTimer();
  //     };
  //   }, [])
  // );

  const decodeHtmlEntities = (text) => {
    if (!text) {
      return ''; // Return an empty string if the input is undefined or null
    }

    return text
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#039;/g, "'"); // Replace &#039; with '
    text.replace(/&amp;/g, '&'); // Replace &amp; with &
    text.replace(/&lt;/g, '<'); // Replace &lt; with <
    text.replace(/&gt;/g, '>'); // Replace &gt; with >
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d2331' }}>
      <View
        style={{
          alignSelf: 'flex-start',
          marginHorizontal: 5,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 30,
        }}
      >
        <BackArrow
          color="orange"
          onPress={() => {
            navigation.goBack(); // Navigate back
            stopTimer(); // Stop the timer
          }}
        />
        <Text style={styles.headerText}>QuizMaster</Text>
      </View>

      {!quizStarted ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: 16,
          }}
        >
          <Text style={{ color: 'white', fontSize: 22, textAlign: 'center' }}>
            NOTE:
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              textAlign: 'center',
              lineHeight: 28,
            }}
          >
            The quiz will start immediately after you press the{' '}
            <Text style={{ color: '#60a5fa', fontWeight: 'bold' }}>
              Start Quiz Now
            </Text>
            . You will have <Text style={{ color: '#9ee86f' }}>15 seconds</Text>{' '}
            to answer each question.
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: 'green',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={handleStartQuiz}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Start Quiz Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        currentQuestion && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <View style={styles.statsContainer}>
              <View>
                <Text style={styles.statsText}>
                  Earnings: ${stats.earnings.toFixed(2)}
                </Text>
                <Text style={styles.statsText}>
                  Rewards: ${stats.rewards.toFixed(2)}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timerText}>{remainingTime}s</Text>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 18,
                }}
              >
                <Text style={styles.questionText}>
                  QUE: {currentQuestionIndex + 1}/{questions.length}
                </Text>
                <Text style={styles.questionText}>
                  CATEG:{' '}
                  <Text style={{ color: '#9ee86f', fontSize: 17 }}>
                    {currentQuestion.category}
                  </Text>
                </Text>
              </View>
              {isFetchingQuestions && (
                // Show loading indicator while loading
                <View
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  <ActivityIndicator size="large" color="white" />
                  <Text
                    style={{
                      marginTop: 10,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    Loading Question...
                  </Text>
                </View>
              )}

              <Text style={styles.questionTitle}>
                {decodeHtmlEntities(currentQuestion.questionText)}
              </Text>

              {currentQuestion.options?.map((option) => (
                <TouchableOpacity
                  key={option} // Use option text as the key
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOption,
                    isSubmitted &&
                      selectedOption === option &&
                      selectedOption === currentQuestion.answer &&
                      styles.correctOption,
                    isSubmitted &&
                      selectedOption === option &&
                      selectedOption !== currentQuestion.answer &&
                      styles.wrongOption,
                  ]}
                  onPress={() => setSelectedOption(option)}
                  disabled={isSubmitted || isTimeUp}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}

              {selectedOption && (
                <View style={styles.submitButtonContainer}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitText}>
                      {isTimeUp || isSubmitted ? 'Next Question' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* pop up messages */}
              {popupVisible && (
                <View style={styles.popupContainer}>
                  <Text
                    style={{ fontSize: 16, color: 'black', fontWeight: '900' }}
                  >
                    {popupMessage.includes('Correct! You earned $0.1') ? (
                      <Text style={{ fontSize: 20 }}>
                        Correct! You earned{' '}
                        <Text style={{ fontWeight: '900', color: 'green' }}>
                          $0.1
                        </Text>
                      </Text>
                    ) : popupMessage.includes('Wrong! You lost $0.01') ? (
                      <Text style={{ fontSize: 20 }}>
                        Wrong answer! You lose{' '}
                        <Text style={{ fontWeight: '900', color: 'red' }}>
                          $0.01
                        </Text>
                      </Text>
                    ) : popupMessage.includes(
                        'Bonus! 10 correct answers! You earned $0.5'
                      ) ? (
                      <Text style={{ fontSize: 18 }}>
                        Bonus! 10 correct answers You earned{' '}
                        <Text
                          style={{
                            fontWeight: '900',
                            color: 'green',
                            fontSize: 25,
                          }}
                        >
                          $0.5
                        </Text>
                      </Text>
                    ) : popupMessage.includes(
                        'Amazing! 20 correct answers! You earned $1'
                      ) ? (
                      <Text style={{ fontSize: 18 }}>
                        Amazing! 20 correct answers in a row! You earned{' '}
                        <Text
                          style={{
                            fontWeight: '900',
                            color: 'green',
                            fontSize: 22,
                          }}
                        >
                          $1
                        </Text>
                      </Text>
                    ) : popupMessage.includes('Time Up! No Earning.') ? (
                      <Text style={{ fontSize: 18 }}>Time Up! No Earning.</Text>
                    ) : null}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )
      )}

      <StatusBar backgroundColor="#0d2331" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default QuestionScreen;



const styles = StyleSheet.create({
  headerText: {
    color: '#9ee86f',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 50,
    color: 'white'
  },
  scoreContainer: {
    marginTop: 10,
    padding: 16,
  },
  scoreLabel: {
    color: '#9ee86f',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scoreValue: {
    color: 'green',
    fontWeight: '900',
    fontSize: 18,
  },
  levelLabel: {
    color: '#cccccc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  questionContainer: { 
    marginVertical: 10,
    paddingHorizontal: 16
  },
  questionText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#ccc',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionTitle: {
    color: 'orange',
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 6,
  },
  optionButton: {
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginVertical: 8,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#9ee8',
  },
  optionText: {
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
    paddingLeft: 10,
    fontSize: 17
  },
  submitButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10// Ensure the container has full width
  },
  submitButton: {
    width: '80%',  // You can also try a percentage width for responsiveness
    backgroundColor: 'blue',  // Correct the background color
    padding: 10,  // Increase padding for a larger button
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  },
  popupContainer: {
    position: 'absolute',
    top: '0%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // 
    // height: 100
  },
  popupText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  
  },
  statsText: {
    color: '#9ee86f',
    fontSize: 18,
    textAlign: 'start',
    marginTop: 10,
  },
  timerText: {
    fontSize: 22,
    fontWeight: '900',
    color:'red'
  },
  timeContainer:{
          borderRadius: 50,
          backgroundColor: 'white',
          padding: 10,
          marginRight: 20,
          height: 100,
    width: 100,
    justifyContent: 'center',
          alignItems: 'center'
  },
    //  selectedOption: {
    // backgroundColor: '#d3d3d3',  // Highlight for selected option
   correctOption: {
    backgroundColor: 'green',  // Correct answer background after submission
  },
  wrongOption: {
    backgroundColor: 'red',  // Wrong answer background after submission
  },
});