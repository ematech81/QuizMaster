import { View, Text, SafeAreaView, StyleSheet, ScrollViewBase, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { QuizContext } from '../QuizContext';
import BackArrow from '../custom/backArrow';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AnsweredQuestions = ({navigation}) => {
  const [loadedGottenAnswers, setLoadedGottenAnswers] = useState([]);
  const [loadedMissedAnswers, setLoadedMissedAnswers] = useState([]);
  const [showGottenQuestions, setShowGottenQuestions] = useState(false);
  const [showMissedQuestions, setShowMissedQuestions] = useState(true);
  const [activeButton, setActiveButton] = useState('missed');
  const {
    username,
    fetchGottenAnswers,
    fetchMissedAnswers,
  } = useContext(QuizContext);

  
  // Fetch answers when the component mounts
  useEffect(() => {
    const loadAnswers = async () => {
      const fetchedGottenAnswers = await fetchGottenAnswers();
      const fetchedMissedAnswers = await fetchMissedAnswers();
      setLoadedGottenAnswers(fetchedGottenAnswers);
      setLoadedMissedAnswers(fetchedMissedAnswers);
    };

    loadAnswers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BackArrow onPress={() => navigation.goBack()} />
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>QuizMaster</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {username ? username.charAt(0).toUpperCase() : ''}
          </Text>
        </View>
      </View>
      <View>
        <View>
          <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 40 }}>
            History
          </Text>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              style={[
                styles.questionButton,
                activeButton === 'gotten' ? styles.Active : null,
              ]}
              onPress={() => {
                setShowMissedQuestions(false);
                setShowGottenQuestions(true);
                setActiveButton('gotten');
              }}
            >
              <Text style={[styles.buttonText]}>Show Right Answers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.questionButton,
                activeButton === 'missed' ? styles.Active : null,
              ]}
              onPress={() => {
                setShowGottenQuestions(false);
                setShowMissedQuestions(true);
                setActiveButton('missed');
              }}
            >
              <Text style={styles.buttonText}>Show Missed Questions</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ScrollView>
            {showGottenQuestions && (
              <View style={{ padding: 16 }}>
                {loadedGottenAnswers.length === 0 ? (
                  <View>
                    <Text style={styles.titleText}>
                      Your correct answers will appear here
                    </Text>
                    <Text style={{ marginVertical: 20, textAlign: 'center' }}>
                      You have not answered any questions yet
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.titleText}>
                      Here is the list of your correctly answered questions
                    </Text>
                    {loadedGottenAnswers.map((item, index) => (
                      <View key={index} style={{ marginVertical: 10 }}>
                        <Text>
                          <Text>{index + 1}. </Text>
                          <Text>Question:</Text> {item.question}
                        </Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          Correct Answer:{' '}
                          <Text style={{ color: 'blue' }}>
                            {item.correctAnswer}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}

            {showMissedQuestions && (
              <View style={{ padding: 16 }}>
                {loadedMissedAnswers.length === 0 ? (
                  <View>
                    <Text style={styles.titleText}>
                      Your missed questions will appear here
                    </Text>
                    <Text style={{ marginVertical: 20, textAlign: 'center' }}>
                      No missed questions yet
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.titleText}>
                      Here are the list of your wrongly answered questions
                    </Text>
                    {loadedMissedAnswers.map((item, index) => (
                      <View key={index} style={{ marginVertical: 10 }}>
                        <Text>
                          <Text>{index + 1}. </Text>
                          <Text>Question:</Text> {item.question}
                        </Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          Correct Answer:{' '}
                          <Text style={{ color: 'blue' }}>
                            {item.correctAnswer}
                          </Text>
                        </Text>
                        <Text style={{ fontWeight: 'bold' }}>
                          Your Answer:{' '}
                          <Text style={{ color: 'red' }}>
                            {item.selectedAnswer}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d2331',
  },
  nameContainer: {
    borderRadius: 100,
    borderColor: '#4ca771',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    borderWidth: 3,
  },
  name: {
    color: '#0d2331',
    fontSize: 14,
    fontWeight: '900',
    // paddingLeft: 16,
  },
  questionButton: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    padding: 5,
    width: 160,
    marginVertical: 20,
    //  backgroundColor: '#bfdbfe',
     backgroundColor: '#525252',
    // paddingHorizontal: 10
    // className='bg-neutral-600'
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
  },
  Active: {
    backgroundColor: 'blue',
  },

  titleText: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 18,
  },
});
export default AnsweredQuestions