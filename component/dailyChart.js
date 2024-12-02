import { useContext, useEffect, useState } from 'react';
import { Dimensions, View, Text, ActivityIndicator, Modal, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LineChart,  BarChart  } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizContext } from '../QuizContext';
import BackArrow from '../custom/backArrow';
import { useNavigation } from '@react-navigation/native';

  import { format, parseISO } from 'date-fns';

export const EarningsChart = () => {

    const navigation = useNavigation();
  const { stats, username, yesterdayEarnings } = useContext(QuizContext);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [loading, setLoading] = useState(true); // New loading state



useEffect(() => {
  const loadDailyEarnings = async () => {
    try {
      let earningsData = await AsyncStorage.getItem('dailyEarnings');
      earningsData = earningsData ? JSON.parse(earningsData) : [];

      // Sort data by date and prepare it for the chart
      earningsData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Format dates explicitly using parseISO to avoid timezone shifts
      const labels = earningsData.map(
        (entry) => format(parseISO(entry.date), 'MMM d') // Parses as UTC to avoid timezone issues
      );
      const data = earningsData.map((entry) => entry.earnings);

      setChartData({
        labels,
        datasets: [{ data }],
      });
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  loadDailyEarnings();
}, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading Earnings Data...</Text>
      </View>
    );
  };

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100, }}
      
    >
      <View style={{ marginTop: 10 }}>
        {/* Header */}
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 16,
          }}
        >
          <Text style={styles.title}>QuizMaster</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {username ? username.charAt(0).toUpperCase() : ''}
            </Text>
          </View>
        </View>

        <View style={{ padding: 8, marginTop: 20 }}>
          {/* Earnings Display */}
          <View
            style={{
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row',
              padding: 4,
              marginVertical: 10,
            }}
          >
            <Text style={styles.statsText2}>Your Earnings Today :</Text>
            <Text style={styles.statsText2}> ${stats.earnings.toFixed(2)}</Text>
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 18,
              marginVertical: 20,
            }}
          >
            The Data Shows Your Daily Earning Behaviour
          </Text>
          <View>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 16} // Full width of the screen minus some padding
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: 'blue',
                backgroundGradientTo: '#f5f5f5',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>

        {/* Mini Detail Section */}
        <View
          style={{
            backgroundColor: '#0d2331',
            borderRadius: 16,
            height: 200,
            padding: 10,
            marginHorizontal: 10,
          }}
        >
          <View>
            <Text style={styles.statsText}>
              Total Earnings: ${stats.totalEarnings.toFixed(2)}
            </Text>
            <Text style={styles.statsText}>
              Today's Earning: ${stats.earnings.toFixed(2)}
            </Text>
            <Text style={styles.statsText}>
              Yesterday's Earning: {yesterdayEarnings.toFixed(2)}
            </Text>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 30,
              }}
            >
              <Text style={styles.statsText3}>Total Withdrawal:</Text>
              <Text style={styles.statsText4}>No withdrawal yet</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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
    statsText: {
    color: '#9ee86f',
    fontSize: 18,
    textAlign: 'start',
    marginTop: 10,
  },
    statsText2: {
    color: 'green',
    fontSize: 22,
    textAlign: 'start',
      marginTop: 10,
    fontWeight: '700'
  },
    statsText3: {
    color: '#9ee86f',
    fontSize: 18,
    textAlign: 'start',
      marginTop: 10,
    fontWeight: '700'
  },
     statsText4: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'start',
       marginTop: 10,
    marginLeft: 20
  },
})