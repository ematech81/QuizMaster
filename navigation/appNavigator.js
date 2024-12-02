
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Welcome from '../screens/Welcome';
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import InstructionScreen from '../screens/InstructionScreen';
import ActivityScreen from '../screens/ActivityScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { QuizContext } from '../QuizContext';
import AnsweredQuestions from '../screens/AnsweredQuestions';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabNavigator() {
  const { user, isLoggedIn } = useContext(QuizContext);

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Question') {
            return (
              <MaterialIcons name="question-answer" size={size} color={color} />
            );
          } else if (route.name === 'Instruction') {
            iconName = 'book';
            return <Icon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Withdraw') {
            iconName = 'activity';
            return <Feather name={iconName} size={size} color={color} />;
          }
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
          textTransform: 'capitalize',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 2,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#173',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Instruction"
        component={InstructionScreen}
        options={{ headerShown: false }}
      />
      {user && ( 
        <>
          <BottomTab.Screen
            name="Question"
            component={QuestionScreen}
            options={{ headerShown: false }}
          />
          <BottomTab.Screen
            name="Withdraw"
            component={ActivityScreen}
            options={{ headerShown: false }}
          />
        </>
      )} 
    </BottomTab.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn, user } = useContext(QuizContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
       
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignInScreen"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUpScreen"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
        
            <Stack.Screen
              name="MainApp"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="QuestionScreen"
              component={QuestionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AnsweredQuestions"
              component={AnsweredQuestions}
              options={{ headerShown: false }}
            />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

