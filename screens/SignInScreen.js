import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Login from '../component/login'

const SignInScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}} >
     <Login/>
    </SafeAreaView >
  )
}

export default SignInScreen;