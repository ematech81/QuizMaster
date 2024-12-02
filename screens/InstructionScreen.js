import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
// import { StatusBar } from 'expo-status-bar'

const InstructionScreen = () => {
  return (
    <View  style={styles.container}>
      <LinearGradient
        colors={['#5D1A99', '#1A2D85']}
        start={{ x: 0, y: 0 }} // Gradient starts from the top-left corner
        end={{ x: 1, y: 1 }}   // Gradient ends at the bottom-right corner
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, color: 'orange'}}>
            The following guidelines will help you understand the earning process:
          </Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • You will earn <Text style={styles.highlight}>$0.10</Text> for each correct answer.
            </Text>
            <Text style={styles.listItem}>
              • Once your correct answers accumulate to 10, <Text style={styles.highlight}>$0.50</Text> reward will be added to your earning.
            </Text>
            <Text style={styles.listItem}>
             • If you accumulate 20 correct answers, you will receive a <Text style={styles.highlight}>$1</Text> reward.
            </Text>
             <Text style={styles.listItem}>
              • Any question not answered within time interval is considered void(no earning). 
            </Text>
             <Text style={styles.listItem}>
              • Watching an advertisement will earn you <Text style={styles.highlight}>$0.50.</Text> 
            </Text>
             <Text style={styles.listItemLast}>
             Note: Only fully watched ads will be eligible for the reward.
            </Text>
             <Text style={styles.listItem}>
           The Minimum Withdrawal is <Text style={styles.highlight}>$50</Text> 
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Disable the status bar */}
      <StatusBar barStyle="light-content" backgroundColor='#5D1A99' />
      </View>
  )
}

export default InstructionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 80,
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    color: '#fff',
    lineHeight: 20,
    marginBottom: 10,
    fontSize: 17,
    lineHeight: 20
  },
  listItemLast: {
    color: 'orange',
    lineHeight: 20,
    marginVertical: 10,
    fontSize: 14
  },
  highlight: {
    color: '#9ee86f',
    fontWeight: 'bold',
  },
})
