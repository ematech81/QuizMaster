import { View, Text, SafeAreaView, StatusBar, Pressable, Modal } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { QuizContext } from '../QuizContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { EarningsChart } from '../component/dailyChart';
import Upload from '../component/upload';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExternalApi from '../component/externalApi';
import BackArrow from '../custom/backArrow';
import Login from '../component/login';


const ActivityScreen = ({navigation}) => {

  const [WithdrawMessage, setWithdrawMessage] = useState(false);
  const [isModalVissible, setIsModalVissible] = useState(false)
  const [withdrawalErrorMessage, setWithdrawalErrorMessage] = useState('')
  
  const {
    // loadStoredData,
    stats,
    username,
    formatTime,
  } = useContext(QuizContext);


 
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#e2e8f0',
        position: 'relative'
      }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* header */}
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text style={styles.title}>QuizMaster</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {username ? username.charAt(0).toUpperCase() : 'on'}
            </Text>
          </View>
        </View>

        {/* earning Block */}
        <View style={styles.earningBlock}>
          <View style={styles.earning}>
            <Text style={styles.earningText}>Total Earning</Text>
            <Text style={styles.earningAmount}>
              ${stats.totalEarnings.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.touchable}
            className="bg-orange-200"
            onPress={() => {
              if (stats.totalEarnings >= 50) {
                navigation.navigate('PaymentScreen');
              } else {
                setWithdrawMessage(true)
                const amountNeeded = 50 - stats.totalEarnings;
                setWithdrawalErrorMessage(
                  `Minimum withdrawal is $50. You need ${amountNeeded.toFixed(
                    2
                  )} more to withdraw.`
                );
              }
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'green' }}>Withdraw</Text>
          </TouchableOpacity>

          <Text style={{ color: 'white', textAlign: 'center' }}>
            Minimum withdrawal:
            <Text style={{ fontWeight: '900', color: '#fff' }}> $50</Text>
          </Text>
        </View>

        {WithdrawMessage && (
          <TouchableOpacity
            onPress={() => setWithdrawMessage(false)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              backgroundColor: 'white',
              borderRadius: 20,
             
              zIndex: 20
            }}
          >
            <Text
              style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}
            >
              {withdrawalErrorMessage}
            </Text>
            <Text style={{ marginTop: 20, fontSize: 18,color: 'blue' }}>Ok</Text>
          </TouchableOpacity>
        )}

        <View style={styles.ActivityBlock}>
          <Text style={{ fontSize: 20, color: '#f97316', fontWeight: 'bold' }}>
            Activities
          </Text>
        </View>

        {/* activities */}
        <View style={styles.historyContainer}>
          <View style={styles.historyContent}>
            <Text style={styles.historyText}>Attempted Questions</Text>
            <Text style={styles.figures}>{stats.totalAttemptedQuestions}</Text>
            <TouchableOpacity>
              <Text style={styles.viewAnswer}>View Questions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyContent}>
            <Text style={styles.historyText}>Correct Answers</Text>
            <Text style={styles.figures}>{stats.correctAnswers}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AnsweredQuestions')}
            >
              <Text style={styles.viewAnswer}>View Answers</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyContent}>
            <Text style={styles.historyText}>Missed Questions</Text>
            <Text style={styles.figures}>{stats.wrongAnswers}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AnsweredQuestions')}
            >
              <Text style={styles.viewAnswer}>View Questions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyContent}>
            <Text style={styles.historyText}>Total Time Spent</Text>
            <Text style={styles.figures}>
              {formatTime(stats.timeSpent.toFixed(0))}
            </Text>
            {/* <TouchableOpacity><Text style={styles.viewAnswer}></Text></TouchableOpacity> */}
          </View>
        </View>

        {/* daily earning */}
        <View style={styles.historyContent1}>
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => setIsModalVissible(true)}
          >
            <Text style={{ fontWeight: 'bold', color: 'white' }}>
              Compare Your Daily Earnings
            </Text>
          </TouchableOpacity>
        </View>
        {/* withdraw container */}

        {/* <View>
           <Upload/>
           </View>
          */}
        {/* <View><ExternalApi/></View>  */}
      </ScrollView>
      <View>
        {isModalVissible && (
          <Modal
            onRequestClose={() => setIsModalVissible(false)}
            presentationStyle="slide"
            hidden
            style={{ flex: 1 }}
          >
            <View>
              <BackArrow onPress={() => setIsModalVissible(false)} />
              <EarningsChart />
            </View>
          </Modal>
        )}
      </View>
      <StatusBar backgroundColor="#e2e8f0" barStyle="dark-content" />
    </SafeAreaView>
  );
}

export default ActivityScreen;


const styles = StyleSheet.create({

   title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d2331',
    
  },
  nameContainer:{
            borderRadius: 100,
            borderColor: '#4ca771',
            width: 30, height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            borderWidth: 3
  },
   name: {
    color: '#0d2331',
    fontSize: 14,
    fontWeight: '900',
    // paddingLeft: 16,
  },
   container:{
     padding: 16,
     marginTop: 20,
     paddingBottom: 50
  },
   earningBlock: {
          backgroundColor: 'green',
          // height: 150,
          elevation: 20,
           borderRadius: 10,
     marginVertical: 20,
          padding:16
         
  },
  earning: {
     justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row'
  },
  earningText:{
              fontWeight: 'bold',
    fontSize: 18,
              color: 'white'
  },
  earningAmount: {
              fontWeight: '900',
            fontSize: 16,
              color:'white'
  },
  touchable: {
            backgroundColor: '#fed7aa',
            alignSelf: 'center',
            width: 150,
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
           marginVertical: 20,
            borderRadius: 10
           
  },
  ActivityBlock:{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 20,
          padding: 8,
          borderBottomWidth: 1,
          borderColor: '#ccc'
  },
  historyContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center', padding: 8,
    flexDirection: 'row',
     gap:10
  },
  historyContent: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    width: 160,
    height: 100,
    backgroundColor: '#cdd5e1',
    padding: 2,
    
   
  },
  historyContent1: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    height: 50,
    backgroundColor: 'green',
    // backgroundColor: '#bfdbfe',
    padding: 2,
    marginTop: 30
    
   
  },
  historyText: {
    color: '#525252',
    fontWeight: 'bold',
    fontSize: 13
    
  },
  viewAnswer: {
    color: 'green',
    marginVertical: 7,
    fontSize: 10,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
   popupContainer: {
    position: 'absolute',
    top: '20%',
    left: '5%',
    right: '20%',
    backgroundColor: '#fff',
    padding:1,
    borderRadius: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    width: 300,
    height: 200,
    elevation: 50
  },
  figures: {
    color: '#f97316',
    fontWeight: 'bold',
    fontSize: 14,
  }
})