
import React, { createContext, useState, useEffect, useRef } from 'react';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './DataBase/fireBaseConfig';
import { Alert, AppState } from 'react-native';
// import { storeData, getData } from './custom/AsyncStorage';
import {  signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';



const USER_STATS_KEY = '@user_stats';

const defaultStats = {
  rewards: 0,
  earnings: 0,
  totalEarnings: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalAttemptedQuestions: 0,
  timeSpent: 0,
 
};



const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(15);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState(defaultStats);
  const [yesterdayEarnings, setYesterdayEarnings] = useState(0);
  const [gottenAnswers, setGottenAnswers] = useState([]);
  const [missedAnswers, setMissedAnswers] = useState([]);

  const [categories, setCategories] = useState([
    { id: '1', name: 'General', icon: 'earth' },
    { id: '2', name: 'Sports', icon: 'soccer' },
    { id: '3', name: 'Science', icon: 'flask' },
    { id: '4', name: 'History', icon: 'book' },
    { id: '5', name: 'Art', icon: 'palette' },
    { id: '6', name: 'Music', icon: 'music' },
    { id: '7', name: 'Technology', icon: 'laptop' },
  ]);
  // function to clear storage

  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('Storage successfully cleared!');
      } catch (error) {
        console.error('Failed to clear storage:', error);
      }
    };

    // Call the clearStorage function when the component mounts
    //clearStorage()
  }, []);

  // Sign-up function
const signUp = async (username, email, password) => {
  try {
    const userQuery = query(
      collection(db, 'users'),
      where('username', '==', username)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      throw new Error('auth/username-already-in-use'); // Custom error
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, 'users', email), {
      username,
      email,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    throw error; // Re-throw Firebase error for handling in handleSignUp
  }
};



  // Sign-in function
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch user data from Firestore using email
      const userDocRef = doc(db, 'users', email);
      const userDoc = await getDoc(userDocRef);

      
    if (!userDoc.exists()) {
      throw new Error('auth/invalid-credential'); // Custom error
    }

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data:', userData);

        // Store username in state (assuming setUsername is defined)
        setUsername(userData.username || 'Unknown');
      }else {
        // console.log('No user data found in Firestore for this email');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  // sign out function
  const logOut = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //  console.log('User is logged in:', user);
      // User is signed in, you can access user info like user.uid, user.email, etc.
    } else {
      // console.log('No user is logged in');
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Retrieve user document from Firestore based on email
          const userDocRef = doc(db, 'users', currentUser.email);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Set the complete user data to the state, including username
            setUser({
              ...currentUser,
              ...userData,
            });
          } else {
            // Set only the current user data if Firestore data does not exist
            setUser(currentUser);
          }

          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // If user is logged out, reset user state
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
      console.log('Cleaned up auth listener');
    };
  }, [auth, db]); // Ensure auth and db are dependencies

  const intervalIdRef = useRef(null); // Use ref to store interval ID

  const saveQuizStateLocally = async (
    categoryName,
    questionIndex,
    remainingTime
  ) => {
    try {
      const state = {
        questionIndex,
        remainingTime,
      };
      await AsyncStorage.setItem(
        `quizState-${categoryName}`,
        JSON.stringify(state)
      );
      // console.log('Quiz state saved locally!');
    } catch (error) {
      console.error('Error saving quiz state locally:', error);
    }
  };

  const loadQuizStateLocally = async (categoryName) => {
    try {
      const savedState = await AsyncStorage.getItem(
        `quizState-${categoryName}`
      );
      if (savedState) {
        return JSON.parse(savedState); // Return the saved quiz state if found
      } else {
        return null; // No saved state found
      }
    } catch (error) {
      console.error('Error loading quiz state locally:', error);
      return null;
    }
  };

  const fetchQuestions = async (categoryName) => {
    setIsFetchingQuestions(true);
    try {
      setIsLoading(true);
      if (categoryName) {
        const questionListRef = collection(
          db,
          'questions',
          categoryName,
          'questionList'
        );
        const snapshot = await getDocs(questionListRef);

        const fetchedQuestions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setQuestions(fetchedQuestions);

        // Check if there's a saved state for this category locally
        const savedState = await loadQuizStateLocally(categoryName);
        if (savedState) {
          setCurrentQuestionIndex(savedState.questionIndex); // Start from the saved question index
          setRemainingTime(savedState.remainingTime); // Restore the remaining time
        } else {
          setCurrentQuestionIndex(0); // Start from the first question if no saved state
        }
      } else {
        console.error('No category provided for fetching questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsFetchingQuestions(false);
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    intervalIdRef.current = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1; // Countdown
        } else {
          clearInterval(intervalIdRef.current); // Clear interval when time runs out
          handleTimeUp(); // Automatically submit the answer when time runs out
          return prevTime;
        }
      });
    }, 1000); // Run every second
  };

  const stopTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current); // Stop the timer
      intervalIdRef.current = null; // Reset the ref
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setPopupMessage('Time Up! No Earning.');
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      moveToNextQuestion();
    }, 2000);
  };

  // AsyncStorage keys
  const STORAGE_KEY_GOTTEN_ANSWERS = '@gottenAnswers';
  const STORAGE_KEY_MISSED_ANSWERS = '@missedAnswers';

  // Function to save answers to AsyncStorage
  const saveAnswersToStorage = async (gottenAnswers, missedAnswers) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_GOTTEN_ANSWERS,
        JSON.stringify(gottenAnswers)
      );
      await AsyncStorage.setItem(
        STORAGE_KEY_MISSED_ANSWERS,
        JSON.stringify(missedAnswers)
      );
    } catch (error) {
      console.error('Error saving answers to storage:', error);
    }
  };

  // Function to fetch gotten answers from AsyncStorage
  const fetchGottenAnswers = async () => {
    try {
      const storedAnswers = await AsyncStorage.getItem(
        STORAGE_KEY_GOTTEN_ANSWERS
      );
      return storedAnswers ? JSON.parse(storedAnswers) : [];
    } catch (error) {
      console.error('Error fetching gotten answers:', error);
      return [];
    }
  };

  // Function to fetch missed answers from AsyncStorage
  const fetchMissedAnswers = async () => {
    try {
      const storedAnswers = await AsyncStorage.getItem(
        STORAGE_KEY_MISSED_ANSWERS
      );
      return storedAnswers ? JSON.parse(storedAnswers) : [];
    } catch (error) {
      console.error('Error fetching missed answers:', error);
      return [];
    }
  };

  const handleSubmit = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    const answeredQuestion = {
      question: currentQuestion.questionText,
      correctAnswer: currentQuestion.answer,
      selectedAnswer: selectedOption, // Track the user's selected answer
    };

    // Store correctly or incorrectly answered questions
    if (isCorrect) {
      setGottenAnswers((prev) => {
        const updatedGottenAnswers = [...prev, answeredQuestion];
        saveAnswersToStorage(updatedGottenAnswers, missedAnswers); // Save to storage
        return updatedGottenAnswers;
      });
    } else {
      setMissedAnswers((prev) => {
        const updatedMissedAnswers = [...prev, answeredQuestion];
        saveAnswersToStorage(gottenAnswers, updatedMissedAnswers); // Save to storage
        return updatedMissedAnswers;
      });
    }

    // Increment total attempted questions and update stats
    const updatedStats = {
      ...stats,
      totalAttemptedQuestions: stats.totalAttemptedQuestions + 1,
    };

    // Initialize earnings and rewards
    let newEarnings = updatedStats.earnings;
    let newRewards = updatedStats.rewards;

    if (isCorrect) {
      updatedStats.correctAnswers += 1;
      newEarnings += 0.1;
      setPopupMessage('Correct! You earned $0.1');

      // Bonus rewards for milestones
      if (updatedStats.correctAnswers === 10) {
        newRewards += 0.5;
        setPopupMessage('Bonus! 10 correct answers! You earned $0.5');
      } else if (updatedStats.correctAnswers === 20) {
        newRewards += 1.0;
        setPopupMessage('Amazing! 20 correct answers! You earned $1');
      }
    } else {
      updatedStats.wrongAnswers += 1;
      newEarnings -= 0.01;
      setPopupMessage('Wrong! You lost $0.01');
    }

    // Update total earnings and stats
    const newTotalEarnings = parseFloat((newEarnings + newRewards).toFixed(2));
    updatedStats.earnings = parseFloat(newEarnings.toFixed(2));
    updatedStats.rewards = parseFloat(newRewards.toFixed(2));
    updatedStats.totalEarnings = newTotalEarnings;

    // Save stats to AsyncStorage
    await saveUserStatsAsync(updatedStats);

    // Display popup and move to next question
    setIsSubmitted(true);
    setPopupVisible(true);
    clearInterval(intervalIdRef.current);

    setTimeout(() => {
      setPopupVisible(false);
      setIsSubmitted(false);
      moveToNextQuestion();
    }, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats from AsyncStorage
        const fetchedStats = await getUserStatsAsync();
        setStats(fetchedStats);
        console.log('Stats fetched successfully:', fetchedStats);

        // Load yesterday's earnings
        let earningsData = await AsyncStorage.getItem('dailyEarnings');
        earningsData = earningsData ? JSON.parse(earningsData) : [];

        // Verify that earningsData is an array
        if (!Array.isArray(earningsData)) {
          console.warn(
            'Expected earningsData to be an array, received:',
            typeof earningsData
          );
          earningsData = []; // Fallback to empty array if not an array
        }

        // Get yesterday's date in YYYY-MM-DD format
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDateString = yesterday.toISOString().split('T')[0];

        // Find yesterday's entry and set the earnings if it exists
        const yesterdayEntry = earningsData.find(
          (entry) => entry.date === yesterdayDateString
        );
        setYesterdayEarnings(yesterdayEntry ? yesterdayEntry.earnings : 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Separate useEffect for saving daily earnings to AsyncStorage based on stats change
  useEffect(() => {
    const saveEarnings = async () => {
      if (stats.earnings !== undefined && stats.rewards !== undefined) {
        await saveDailyEarnings();
        console.log('Daily earnings updated based on stats change.');
      }
    };

    saveEarnings();
  }, [stats]);

  // Fetch stats from AsyncStorage
  const getUserStatsAsync = async () => {
    try {
      const statsString = await AsyncStorage.getItem(USER_STATS_KEY);
      return statsString ? JSON.parse(statsString) : defaultStats;
    } catch (error) {
      console.error('Error fetching user stats from AsyncStorage:', error);
      return defaultStats;
    }
  };

  // Save updated stats to AsyncStorage and state
  const saveUserStatsAsync = async (newStats) => {
    try {
      const updatedStats = { ...stats, ...newStats };
      await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(updatedStats));
      setStats(updatedStats); // Update context state
      console.log('User stats saved to AsyncStorage:', updatedStats);
    } catch (error) {
      console.error('Error saving user stats to AsyncStorage:', error);
    }
  };

  // 1. Function to track and save time spent

  // Helper function to format time in hh:mm:ss
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to track and save time spent
  const startTrackingTime = () => Date.now(); // Return the start time when the question is displayed

  const stopAndSaveTime = async (startTime) => {
    try {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds

      // Fetch current stats from AsyncStorage
      const currentStats = await getUserStatsAsync();

      // Update timeSpent in stats
      const updatedTimeSpent = (currentStats.timeSpent || 0) + timeTaken;
      const updatedStats = { ...currentStats, timeSpent: updatedTimeSpent };

      // Save updated stats to AsyncStorage
      await saveUserStatsAsync(updatedStats);

      // Log the formatted time
      console.log(
        'Time spent in hh:mm:ss format:',
        formatTime(updatedTimeSpent)
      );
      console.log('Updated stats with timeSpent:', updatedStats);
    } catch (error) {
      console.error('Error updating timeSpent:', error);
    }
  };


  // Function to save daily earnings

  const saveDailyEarnings = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      let earningsData = await AsyncStorage.getItem('dailyEarnings');
      earningsData = earningsData ? JSON.parse(earningsData) : [];

      const todayIndex = earningsData.findIndex(
        (entry) => entry.date === currentDate
      );
      const previousEarnings =
        todayIndex >= 0 ? earningsData[todayIndex].earnings : 0;

      // Calculate only the difference since the last saved earnings
      const newEarnings = stats.earnings + stats.rewards - previousEarnings;
      const roundedNewEarnings = parseFloat(newEarnings.toFixed(2));

      if (todayIndex >= 0) {
        earningsData[todayIndex].earnings = parseFloat(
          (previousEarnings + roundedNewEarnings).toFixed(2)
        );
      } else {
        // No entry for today, so create one
        earningsData.push({ date: currentDate, earnings: roundedNewEarnings });
      }

      await AsyncStorage.setItem('dailyEarnings', JSON.stringify(earningsData));
      console.log('Daily earnings saved successfully:', earningsData);
    } catch (error) {
      console.error('Error saving daily earnings:', error);
    }
  };

  const moveToNextQuestion = () => {
    // Save the quiz state locally
    saveQuizStateLocally(
      currentCategory,
      currentQuestionIndex + 1,
      remainingTime
    );
    // Reset state for the next question
    setSelectedOption(null);
    setRemainingTime(15); // Reset time for the next question
    setIsTimeUp(false);
    startTimer(); // Restart the timer for the next question

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // Move to the next question
    } else {
      // Quiz finished for this category
      return; // End of quiz for the current category
    }
  };

  // saving to storage
  const saveQuizState = async (categoryName, questionIndex, timeLeft) => {
    try {
      if (categoryName) {
        await storeData('currentCategory', categoryName);
      }

      await storeData('currentQuestionIndex', questionIndex);
      await storeData('remainingTime', timeLeft); // Save remaining time
    } catch (error) {
      console.error('Error saving quiz state:', error);
    }
  };

  // Function to pause the timer
  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear the timer
      timerRef.current = null; // Reset the interval reference
    }
  };

  // Function to resume the timer
  const resumeTimer = () => {
    startTimer(); // Restart the timer
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        saveQuizState(currentCategory, currentQuestionIndex, remainingTime);
        // pauseTimer(); // Pause the timer when app goes into background
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      clearInterval(timerRef.current); // Ensure timer is cleared when component unmounts
      subscription.remove();
    };
  }, []);

  return (
    <QuizContext.Provider
      value={{
        quizStarted,
        setQuizStarted,
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        selectedOption,
        setSelectedOption,
        backgroundColor,
        setBackgroundColor,
        popupMessage,
        setPopupMessage,
        popupVisible,
        setPopupVisible,
        remainingTime,
        setRemainingTime,
        isTimeUp,
        setIsTimeUp,
        isLoading,
        setIsLoading,
        currentCategory,
        setCurrentCategory,
        isSubmitted,
        setIsSubmitted,
        categories,
        setCategories,
        fetchQuestions,
        startTimer,
        pauseTimer, // Pause timer added to context
        saveQuizState,
        handleSubmit,
        moveToNextQuestion,
        stopTimer,
        startTrackingTime,
        stopAndSaveTime,
        handleSubmit,
        isLoading,
        setIsLoading,
        setIsFetchingQuestions,
        isFetchingQuestions,
        fetchQuestions,
        user,
        signUp,
        signIn,
        logOut,
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername,
        confirmPassword,
        setConfirmPassword,
        stats,
        yesterdayEarnings,
        gottenAnswers,
        missedAnswers,
        fetchGottenAnswers,
        fetchMissedAnswers,
        formatTime,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export { QuizContext, QuizProvider };
