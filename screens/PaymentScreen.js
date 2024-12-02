import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, Image, TextInput } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrow from '../custom/backArrow';
import BankTransferForm from '../component/BankTransferForm';
import { StatusBar } from 'react-native';



const PaymentScreen = ({navigation}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const papalLogo = require('../assets/PayPal.png')

  const handleLocalPayment = () => {
    setSelectedMethod('local');
  };

  const handleInternationalPayment = () => {
    setSelectedMethod('international');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e2e8f0' }}>
      <StatusBar backgroundColor='#e2e8f0' barStyle='dark-content'/> 
      <View>
      <BackArrow onPress={() =>navigation.goBack()}/>

      </View>
      <View style={{marginTop: 20, backgroundColor: 'green'}} >
        <Text style={{textAlign: 'center', fontSize: 18, fontWeight: '600',color: '#fff', marginTop: 10}}>Please Select Your Withdrawal Method</Text>
      <View style={styles.paymentContainer}>
        {/* local trqansfer */}
        <TouchableOpacity onPress={handleLocalPayment} style={styles.paymentButton}>
          <Text style={styles.paymentTex}>Nigerian Bank Transfer</Text>
        </TouchableOpacity>

        {/* international */}
          <TouchableOpacity onPress={handleInternationalPayment} style={styles.paymentButton2} >
            <Image
              source={papalLogo}
              style={{width: 50, height: 50}}
            />
          <Text style={styles.paymentTex2}>(International)</Text>
        </TouchableOpacity>
        </View>
      </View>
      {/* payment details */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
      >
      {selectedMethod === 'local' && (
        <View style={{
          marginTop: 80
        }}>
            {/* Add bank account details input and submission button */}
            <BankTransferForm/>
        </View>
      )}

      {selectedMethod === 'international' && (
        <View style={{
          marginTop: 80
        }}>
          <Text style={styles.title}>Proceed with PayPal Payment</Text>
          {/* Call PayPal API for payment */}
          <Button title="Withdraw with PayPal" onPress={() => Alert.alert('Proceed to PayPal')} />
            </View>
            
          )}
          </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;


const styles = StyleSheet.create({
  paymentContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        flexDirection: 'row',
        paddingHorizontal: 5
      },
      paymentButton: {
          backgroundColor: '#fedfaa',
            borderRadius: 10,
          padding: 8
        },
      paymentButton2: {
          // backgroundColor: '#fff',
            borderRadius: 10,
        // padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
       
        flexDirection: 'row',
        borderBottomWidth: 1,
          borderBottomColor: '#fedfaa'
  },
  paymentTex: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 12,
  },
  paymentTex2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
    title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
})