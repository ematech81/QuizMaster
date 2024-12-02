


import AppNavigator from './navigation/appNavigator';
import { QuizProvider } from './QuizContext';

export default function App() {
  return (
       <QuizProvider>
         <AppNavigator />
      </QuizProvider>
  );
}

