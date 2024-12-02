import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Import the Picker


const BankTransferForm = () => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(84700);



  const banks = [
    { label: 'First Bank of Nigeria', value: 'First Bank' },
    { label: 'Access Bank', value: 'Access Bank' },
    { label: 'GTBank', value: 'GTBank' },
    { label: 'Zenith Bank', value: 'Zenith Bank' },
    { label: 'UBA', value: 'UBA' },
    // Add more banks as needed
  ]

  
 const handleSubmit = () => {
    if (!bankName || !accountNumber || !accountName || !withdrawAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validation: Account number should be numeric and exactly 10 digits
    if (accountNumber.length !== 10 || isNaN(accountNumber)) {
      Alert.alert('Error', 'Account Number must be a valid 10-digit number');
      return;
    }

    // Show a confirmation dialog
    Alert.alert(
      'Confirm Withdrawal',
      `You are about to withdraw ₦${withdrawAmount} to ${accountName} (${bankName}).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            console.log({
              bankName,
              accountNumber,
              accountName,
              withdrawAmount,
            });
            Alert.alert('Success', 'Your withdrawal request has been submitted!');
            // Reset form fields
            setBankName('');
            setAccountNumber('');
            setAccountName('');
            setWithdrawAmount('');
          },
        },
      ]
    );
  };





  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nigerian Bank Transfer</Text>

      <Text style={styles.label}>Bank Name</Text>

       <RNPickerSelect
        onValueChange={(value) => setBankName(value)}
        items={banks}
        placeholder={{ label: 'Select your bank', value: null }}
        style={pickerSelectStyles}
        value={bankName}
      />

      {/* <TextInput
        style={styles.input}
        value={bankName}
        onChangeText={setBankName}
        placeholder="Enter your bank name"
      /> */}

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Enter your account number"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Account Name</Text>
      <TextInput
        style={styles.input}
        value={accountName}
        onChangeText={setAccountName}
        placeholder="Enter your account name"
      />

      <Text style={styles.label}>Amount to Withdraw</Text>
      <TextInput
        style={styles.input}
        value={withdrawAmount}
        onChangeText={setWithdrawAmount}
        placeholder="₦84,700"
        keyboardType="numeric"
        placeholderTextColor='green'
      />
      <Text style={{color: 'red', marginTop: -20}}>Minimum withdrawal converted to naira</Text>
      <View style={{marginVertical: 20}}>
           <Button title="Submit Payment Request" onPress={handleSubmit} />
       </View>
     
    </View>
  );
};


// Styles for Picker Select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is not obscured
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is not obscured
    marginBottom: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default BankTransferForm;
