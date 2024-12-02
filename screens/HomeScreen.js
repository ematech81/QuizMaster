import { View, Text, SafeAreaView, StatusBar,  FlatList, TouchableOpacity, Image, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native'; 
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
import { QuizContext } from '../QuizContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EarningsChart } from '../component/dailyChart';



const HomeScreen = ({navigation, route}) => {

    const [dateTime, setDateTime] = useState({
    date: '',
    time: '',
    });
  
  const { categories, setCurrentCategory, rewards, earnings, totalEarnings, startTimer, stopTimer, clearQuizState, loadStoredData,setQuestions, setCurrentQuestionIndex,setRemainingTime, fetchQuestions, logOut, user, username, stats} = useContext(QuizContext);
 
  

 
  useFocusEffect(
    React.useCallback(() => {
      startTimer(); // Start timer when screen is focused

      return () => {
        stopTimer(); // Stop timer when screen loses focus
      };
    }, [])
  );



  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(2);
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

      const date = `${day}-${month}-${year}`;
      const time = `${hours}:${minutes} ${ampm}`;

      setDateTime({ date, time });
    };

    const intervalId = setInterval(updateTime, 1000); // Update every second

    // Cleanup
    return () => clearInterval(intervalId); 
  }, []);


  const handleSignOut = async() => {
    await logOut();
   }

   const switchCategory = async (categoryName) => {
  setCurrentCategory(categoryName);
  setQuestions([]); // Clear previous questions
  //  setCurrentQuestionIndex(0);
  setRemainingTime(15); // Reset the timer for the new category

  await fetchQuestions(categoryName); // Fetch new questions
};

  const handleCategorySelect = (categoryName) => {

      if (!user) {
    navigation.navigate('SignInScreen');
  } else {
    setCurrentCategory(categoryName); // Set the selected category in context
    switchCategory(categoryName);
    navigation.navigate('QuestionScreen',{categoryName}); // Navigate to the Question screen
  }
   
  };

useEffect(() => {
  if (route.params?.category) {
    switchCategory(route.params.category);
  }
}, [route.params?.category]);

  const renderCategoryItem = ({ item }) => {
  
  return (
    <TouchableOpacity
      style={styles.categoryItem}
    onPress={() => handleCategorySelect(item.name)}
      >
      <Icon name={item.icon} size={30} color="green" strokeWidth='10' />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* user */}
        {user && (
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 10,
            }}
          >
            <View
              style={{
                borderRadius: 100,
                borderColor: '#4ca771',
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                borderWidth: 3,
                marginTop: 10,
              }}
            >
              <Text style={styles.name}>
                {username ? username.charAt(0).toUpperCase() : 'on'}
              </Text>
            </View>
            <Pressable onPress={handleSignOut}>
              <Text style={{ color: 'white' }}>Logout</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.headerContent}>
          <View style={{}}>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>QuizMaster</Text>
              {user ? (
                <View>
                  <Text style={styles.label}> Earnings</Text>
                  <Text style={styles.amount}>
                    ${stats.earnings.toFixed(2)}
                  </Text>
                  <Text style={styles.label}>Total Rewards</Text>
                  <Text style={styles.amount}>${stats.rewards.toFixed(2)}</Text>
                  <Text style={styles.label}>Withdrawable</Text>
                  <Text style={styles.amountLarge}>
                    ${stats.totalEarnings.toFixed(2)}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.label}> Earnings</Text>
                  <Text style={styles.amount}>$0.00</Text>
                  <Text style={styles.label}>Total Rewards</Text>
                  <Text style={styles.amount}>$0.00</Text>
                  <Text style={styles.label}>Withdrawable</Text>
                  <Text style={styles.amountLarge}>$0.00</Text>
                </View>
              )}
            </View>
          </View>
          {/* Logo */}
          <View>
            <Image
              // source={require('../assets/silver.png')}
              source={require('../assets/formatedLogo.png')}
              style={styles.logo}
            />
          </View>
        </View>
      </View>
      {/* body */}
      <View style={{ paddingBottom: 20 }}>
        <View style={styles.searchBar}>
          <Text style={{ fontWeight: '700' }}>{dateTime.date}</Text>
          <Text style={{ fontWeight: '700' }}>{dateTime.time}</Text>
        </View>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryHeaderText}>Question By Categories</Text>
        </View>
        {/* Horizontal Category List */}
        <View style={{ height: 120 }}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoryList}
          />
        </View>
        <View style={{ paddingHorizontal: 16, marginVertical: -7 }}>
          <Text style={{ fontWeight: '900', fontSize: 18 }}>Progress</Text>
          <View
            style={{
              height: 110,
              backgroundColor: '#0d2331',
              borderRadius: 8,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                flexDirection: 'row',
              }}
              className=" h-full"
            >
              <View
                style={{
                  width: '50%',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: 8,
                  height: '100%',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Level
                </Text>
                <Text style={{ color: '#9ee86f', fontWeight: 'bold' }}>
                  SILVER
                </Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Earnings
                </Text>
                {user ? (
                  <Text style={{ color: '#9ee86f', fontWeight: 'bold' }}>
                    ${stats.totalEarnings.toFixed(2)}
                  </Text>
                ) : (
                  <Text style={{ color: '#9ee86f', fontWeight: 'bold' }}>
                    $0.00
                  </Text>
                )}

                {/*  */}
              </View>
              {/* level image */}
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  width: '50%',
                  height: '100%',
                }}
              >
                <Image
                  source={require('../assets/silver.png')}
                  style={{ width: 100, height: '100%' }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <StatusBar barStyle="light-content" backgroundColor="#0d2331" />
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    // backgroundColor: '#173300',
    backgroundColor: '#0d2331',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 16,
  },
   gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#9ee86f',
    fontSize: 14,
    fontWeight: '900',
    // paddingLeft: 16,
  },
  infoContainer: {
    marginTop: 20,
    paddingLeft:2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    // color: '#4ca771',
     color: '#9ee86f',
    fontWeight: '900',
  },
  amount: {
    fontWeight: '900',
    color: 'white',
  },
  amountLarge: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
  },
  logo: {
    width: 200,
    height: 200,
  },
  searchBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -15,
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    height: 40,
    elevation: 5,
 fontWeight: 'bold'
  },
  categoryHeader: {
    marginTop: 30,
    marginBottom: 8,
    paddingHorizontal:16
  },
  categoryHeaderText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
    textAlign: 'left',
  },
  categoryList: {
    paddingVertical: 20,
  
  },
  categoryItem: {
    backgroundColo: '#6A1B9A',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    // height: 100,
  },
  categoryText: {
    color: 'black',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold'
  },
});
