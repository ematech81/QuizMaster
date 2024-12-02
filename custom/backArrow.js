import AntDesign from '@expo/vector-icons/AntDesign';


import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react'
import {} from 'react-native-gesture-handler';

const BackArrow = ({color,onPress}) => {
  return (
    <TouchableOpacity style={{padding: 8}} onPress={onPress}>
    <AntDesign name="arrowleft" size={30} color={color}  />
    </TouchableOpacity>
  )
}

export default BackArrow