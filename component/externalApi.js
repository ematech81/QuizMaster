import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

export default function ExternalApi() {
 
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState([])



//  'GET /?search=cat&category=entertainment&type=multiple&difficulty=medium&limit=10';



// const url = 'https://api-football-v1.p.rapidapi.com/v3/leagues';

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'a8fbcfa433msh7bbb4f7c2509480p186f56jsna70182c698bf',
		'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
	}
};




  // Function to fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch(url, options );
      const data = await response.json();
      setQuestion(data);
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trivia questions: ', error);
    }
  };

  // Use effect to fetch questions on component mount
  useEffect(() => {
    // fetchQuestions();
  }, []);

  if (loading) {
    return <Text>Loading questions...</Text>;
  }

  return (
    <View>
      <Text>Trivia Questions</Text>
      {/* <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.question}</Text>
            <Text>Options: {item.correctAnswer}, {item.incorrectAnswers.join(', ')}</Text>
          </View>
        )}
      /> */}
    </View>
  );
}
