


import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../DataBase/fireBaseConfig';
import { AllQuestions } from '../DataBase/Qestions';
import { View, Text, Button } from 'react-native';
import React, { useEffect } from 'react';

// Utility function to shuffle the options array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function Upload() {

  const uploadCategoryQuestions = async (categoryName) => {
    try {
      const categoryQuestions = AllQuestions[categoryName];

      // If category has more than 500 questions, split them into batches
      const chunkSize = 500;

      for (let i = 0; i < categoryQuestions.length; i += chunkSize) {
        const batch = writeBatch(db);  // Initialize a new batch for every 500 questions
        const questionsChunk = categoryQuestions.slice(i, i + chunkSize);  // Slice 500 questions or less

        // Loop through each question in the chunk and add to the batch
        for (const question of questionsChunk) {

          // Ensure the correct structure and shuffle options
          const formattedQuestion = {
            questionText: question.questionText || question.question || "No question! Wait For Next Question",  // Handle old/new keys
            options: shuffleArray([...question.options, question.answer]),  // Combine correct and incorrect answers and shuffle
            answer: question.answer || question.correctAnswer,  // Handle both key names
            category: question.category || categoryName  // Use provided category or default to the category being uploaded
          };

          // Create a reference to the specific document in the questionList sub-collection
          const questionRef = doc(collection(db, 'questions', categoryName, 'questionList'));
          batch.set(questionRef, formattedQuestion);
        }

        // Commit the batch to Firestore
        await batch.commit();
        console.log(`Uploaded a batch of questions for category: ${categoryName}`);
      }

      console.log(`All questions uploaded for category: ${categoryName}`);
    } catch (error) {
      console.error(`Error uploading questions for category ${categoryName}: `, error);
    }
  };

  useEffect(() => {
    // Call the function to upload a specific category when the component mounts (optional)
    // uploadCategoryQuestions('General');
  }, []);

  return (
    <View>
      <Text>Upload Question</Text>
      <Button title="Upload Now" onPress={() => uploadCategoryQuestions('Music')} />
     
      {/* Add more buttons for each category you want to upload */}
    </View>
  );
}
