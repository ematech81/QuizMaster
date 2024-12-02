
// QuizContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './DataBase/fireBaseConfig';
import { Alert, AppState } from 'react-native';




const QuizContext = createContext();


const QuizProvider = ({ children }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [categories, setCategories] = useState([
    { id: '1', name: 'General', icon: 'earth' },
    { id: '2', name: 'Sports', icon: 'soccer' },
    { id: '3', name: 'Science', icon: 'flask' },
    { id: '4', name: 'History', icon: 'book' },
    { id: '5', name: 'Art', icon: 'palette' },
    { id: '6', name: 'Music', icon: 'music' },
    { id: '7', name: 'Technology', icon: 'laptop' },
    { id: '8', name: 'Literature', icon: 'book-open-variant' },
    { id: '9', name: 'Geography', icon: 'earth' },
    { id: '10', name: 'Math', icon: 'calculator' },
  ]);


  const fetchQuestions = async (categoryName) => {
    try {
      setIsLoading(true);
      if (categoryName) {
        const questionListRef = collection(db, 'questions', categoryName, 'questionList');
        const snapshot = await getDocs(questionListRef);

        const fetchedQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(fetchedQuestions);
      } else {
        console.error('No category provided for fetching questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

 const startTimer = () => {
  setIsTimeUp(false);
  clearInterval(timerRef.current); // Clear any existing interval
  timerRef.current = setInterval(() => {
    setRemainingTime(prev => {
      if (prev === 1) {
        clearInterval(timerRef.current);
        handleTimeUp(); // Trigger when time runs out
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setPopupMessage(' Time Up! No Earning.');
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      moveToNextQuestion();
    }, 2000);
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setEarnings(prev => prev + 0.1);
      setPopupMessage('Correct! You earned $0.1');
      setIsSubmitted(true);
    } else {
      setWrongAnswers(prev => prev + 1);
      setPopupMessage('Wrong answer!');
       setIsSubmitted(true);
    }

    setPopupVisible(true);

   setTimeout(() => {
   setPopupVisible(false);
   setIsSubmitted(false);
   moveToNextQuestion();
}, 2000); // increased time

  };


  const moveToNextQuestion = () => {
  saveQuizState(currentCategory, currentQuestionIndex + 1);

  setSelectedOption(null);
  setRemainingTime(15); // reset time to 15 seconds for next question
  setIsTimeUp(false);

  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
  } else {
    Alert.alert('Quiz completed!');
  }
};

 
 const saveQuizState = async (category, questionIndex, timeLeft) => {
  try {
    await AsyncStorage.setItem('currentCategory', category);
    await AsyncStorage.setItem('currentQuestionIndex', JSON.stringify(questionIndex));
    await AsyncStorage.setItem('remainingTime', JSON.stringify(timeLeft)); // Save remaining time
  } catch (error) {
    console.error('Error saving quiz state:', error);
  }
};


const loadQuizState = async () => {
  try {
    const storedCategory = await AsyncStorage.getItem('currentCategory');
    const storedQuestionIndex = await AsyncStorage.getItem('currentQuestionIndex');
    const storedRemainingTime = await AsyncStorage.getItem('remainingTime');

    if (storedCategory && storedQuestionIndex !== null) {
      setCurrentCategory(storedCategory);
      setCurrentQuestionIndex(JSON.parse(storedQuestionIndex));
       setRemainingTime(storedRemainingTime ? JSON.parse(storedRemainingTime) : 20);
    } else {
      setCurrentQuestionIndex(0);
      setRemainingTime(20); 
    }
  } catch (error) {
    console.error('Error loading quiz state:', error);
  }
  };
  


  // Function to pause the timer
  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the timer
      intervalRef.current = null; // Reset the interval reference
      setIsPaused(true); // Set paused state to true
    }
  };

  // Function to resume the timer
  const resumeTimer = () => {
    if (isPaused) {
      setIsPaused(false); // Unpause and restart the timer
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        saveQuizState(currentCategory, currentQuestionIndex, remainingTime);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
    clearInterval(timerRef.current); // Ensure timer is cleared when component unmounts
    subscription.remove();
  };
  }, []);

//  const clearSpecificQuizState = async () => {
//     try {
//       await AsyncStorage.removeItem('currentCategory');
//       await AsyncStorage.removeItem('currentQuestionIndex');
//       await AsyncStorage.removeItem('remainingTime');
//       console.log('Quiz state cleared.');
//     } catch (error) {
//       console.error('Error clearing quiz state:', error);
//     }
//   };

  
// const clearQuizState = async () => {
//   try {
//     await AsyncStorage.clear(); // This will remove all the data in AsyncStorage
//     console.log('Quiz state cleared from AsyncStorage.');
//   } catch (error) {
//     console.error('Error clearing AsyncStorage:', error);
//   }
// };

  
 return (
  <QuizContext.Provider
    value={{
       quizStarted,
      setQuizStarted,
      questions,
      setCurrentQuestionIndex,
      currentQuestionIndex,
      selectedOption,
      setSelectedOption,
      correctAnswers,
      wrongAnswers,
      earnings,
      rewards,
      backgroundColor,
      popupMessage,
      popupVisible,
      remainingTime,
      setIsTimeUp,
      isTimeUp,
      handleSubmit,
      handleStartQuiz: () => setQuizStarted(true),
      moveToNextQuestion,
      categories,
      currentCategory,
      setCurrentCategory,
      setCategories,
      isSubmitted,
      setIsSubmitted,
      saveQuizState,
      loadQuizState,
      isLoading,
      setIsLoading,
       fetchQuestions,
      //  clearQuizState,
      startTimer,
    }}
  >
    {children}
  </QuizContext.Provider>
);
};


export { QuizContext, QuizProvider };









// // Create the context
// const QuizContext = createContext();

// const QuizProvider = ({ children }) => {
//   const [quizStarted, setQuizStarted] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [wrongAnswers, setWrongAnswers] = useState(0);
//   const [earnings, setEarnings] = useState(0);
//   const [rewards, setRewards] = useState(0);
//   const [backgroundColor, setBackgroundColor] = useState('#0d2331');
//   const [popupMessage, setPopupMessage] = useState('');
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(20);
//   const [isTimeUp, setIsTimeUp] = useState(false);
//   const [startTime, setStartTime] = useState(Date.now());
//   const [totalTimeSpent, setTotalTimeSpent] = useState(0);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);




  
//   useEffect(() => {
//   const fetchQuestions = async () => {
//     try {
//       if (currentCategory) {
//         const questionListRef = collection(db, 'questions', currentCategory, 'questionList');
//         const snapshot = await getDocs(questionListRef);
//         const fetchedQuestions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setQuestions(fetchedQuestions);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   fetchQuestions();
//   }, [currentCategory]);
  
//   const timerRef = useRef(null);
  
//   const handleStartQuiz = () => {
//     setQuizStarted(true);
//     startTimer();
//     setSelectedOption(null);
//   };

// const saveQuizState = async (category, questionIndex, remainingTime) => {
//   try {
//     // Save the current category, question index, and timer state
//     await AsyncStorage.setItem('currentCategory', category);
//     await AsyncStorage.setItem('currentQuestionIndex', JSON.stringify(questionIndex));
//     await AsyncStorage.setItem('remainingTime', JSON.stringify(remainingTime));
//   } catch (error) {
//     console.error('Error saving quiz state:', error);
//   }
// };

//    const startTimer = () => {
//   setIsTimeUp(false);
//   clearInterval(timerRef.current);

//   timerRef.current = setInterval(() => {
//     setRemainingTime(prev => {
//       if (prev === 1) {
//         clearInterval(timerRef.current);
//         handleTimeUp(); // Trigger when time runs out
//         return 0;
//       }
//       return prev - 1;
//     });
//   }, 1000);
// };

  
//   const loadQuizState = async () => {
//   try {
//     const storedCategory = await AsyncStorage.getItem('currentCategory');
//     const storedQuestionIndex = await AsyncStorage.getItem('currentQuestionIndex');
//     const storedRemainingTime = await AsyncStorage.getItem('remainingTime');

//     if (storedCategory && storedQuestionIndex !== null && storedRemainingTime !== null) {
//       setCurrentCategory(storedCategory);
//       setCurrentQuestionIndex(JSON.parse(storedQuestionIndex));
// //        if (storedRemainingTime !== null && storedRemainingTime !== undefined) {
//         setRemainingTime(JSON.parse(storedRemainingTime));
//       } else {
//         setRemainingTime(20); // Default to 20 seconds if no valid time is stored
//       }
//     } else {
//       // No saved state, start a fresh quiz
//       setCurrentQuestionIndex(0);
//       setRemainingTime(20); // default time for new questions
//     }
//   } catch (error) {
//     console.error('Error loading quiz state:', error);
//   }
// };

//   const handleTimeUp = () => {
//     setIsTimeUp(true);
//     setPopupMessage('Time’s up! Please move to the next question.');
//     setPopupVisible(true);

//     setTimeout(() => {
//       setPopupVisible(false);
//       moveToNextQuestion();
//     }, 2000);
//   };

//   // Example usage on question submit
// const handleSubmit = () => {
//   const currentQuestion = questions[currentQuestionIndex];
//   const isCorrect = selectedOption === currentQuestion.answer;

//   if (isCorrect) {
//     setCorrectAnswers(prev => prev + 1);
//     setEarnings(prev => prev + 0.1);
//     setPopupMessage('Correct! You earned $0.1');
//     setBackgroundColor('green');
//   } else {
//     setWrongAnswers(prev => prev + 1);
//     setPopupMessage('Wrong answer!');
//     setBackgroundColor('red');
//   }

//   setPopupVisible(true);

//   setTimeout(() => {
//     setPopupVisible(false);
//     moveToNextQuestion();
//   }, 2000);
// };
  
//   // Example usage when moving to the next question
// const moveToNextQuestion = () => {
//   saveQuizState(currentCategory, currentQuestionIndex + 1, 20); // Reset time to 20 for next question

//   setSelectedOption(null);
//   setRemainingTime(20);
//   setIsTimeUp(false);

//   if (currentQuestionIndex < questions.length - 1) {
//     setCurrentQuestionIndex(prev => prev + 1);
//     startTimer(); // Start timer for the next question
//   } else {
//     Alert.alert(`Quiz completed!`);
//   }
// };

//   useEffect(() => {
//   const loadStateAndStartQuiz = async () => {
//     await loadQuizState(); // Ensure state is fully loaded

//     if (quizStarted) {
//       startTimer(); // Start the timer after quiz state has loaded
//     }
//   };

//   loadStateAndStartQuiz(); // Load quiz state and possibly start the quiz

//   const handleAppStateChange = (nextAppState) => {
//     if (nextAppState === 'background' || nextAppState === 'inactive') {
//       saveQuizState(currentCategory, currentQuestionIndex, remainingTime);
//     }
//   };

//   // Subscribe to AppState changes
//   const subscription = AppState.addEventListener('change', handleAppStateChange);

//   return () => {
//     // Proper cleanup with the subscription remove method
//     subscription.remove();
//   };
// }, [currentCategory, currentQuestionIndex, remainingTime, quizStarted]);

//   return (
//     <QuizContext.Provider
//       value={{
//         quizStarted,
//         questions,
//          setCurrentQuestionIndex,
//         currentQuestionIndex,
//         selectedOption,
//         setSelectedOption,
//         loading,
//         correctAnswers,
//         wrongAnswers,
//         earnings,
//         backgroundColor,
//         popupMessage,
//         popupVisible,
//         remainingTime,
//          setIsTimeUp,
//         isTimeUp,
//         handleSubmit,
//         handleStartQuiz,
//         moveToNextQuestion,
//         categories,
//         currentCategory,
//          setCurrentCategory,
//         currentQuestionIndex,
//         saveQuizState,
//         rewards,
//         isSubmitted,
//         setIsSubmitted
//       }}
//     >
//       {children}
//     </QuizContext.Provider>
//   );
// };

// export { QuizContext, QuizProvider };






  
// Fetch Questions
const fetchQuestions = async (categoryName) => {
  setIsFetchingQuestions(true);
  try {
    setIsLoading(true);

    if (categoryName) {
      // Fetch questions from Firestore
      const questionListRef = collection(db, 'questions', categoryName, 'questionList');
      const snapshot = await getDocs(questionListRef);

      const fetchedQuestions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setQuestions(fetchedQuestions);

      // Load last saved question index for this category
      const storedProgress = await loadCategoryProgress(categoryName);

      if (storedProgress) {
        setCurrentQuestionIndex(storedProgress); // Start from saved question index
      } else {
        setCurrentQuestionIndex(0); // Start from the first question if no progress
      }

      // Check if there's additional saved state (like time) for this category
      const savedState = await loadQuizState(categoryName);
      if (savedState) {
        setRemainingTime(savedState.remainingTime); // Restore the remaining time
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