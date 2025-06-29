import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const BinanceChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchChartData = async () => {
    try {
      const res = await fetch(
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=30'
      );
      const data = await res.json();
      const closePrices = data.map(item => parseFloat(item[4]));

      setChartData(closePrices);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Grafik verisi alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || chartData.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff99" />
      </View>
    );
  }

  // Simplified data formatting without unnecessary string conversion
  const formattedData = chartData.map(value => Number(value));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartText}>
        Binance son güncelleme {lastUpdated?.toLocaleTimeString('tr-TR')}
      </Text>
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: formattedData,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 48}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#0d1520',
          backgroundGradientTo: '#0d1520',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 255, 153, ${opacity})`,
          labelColor: () => '#8899aa',
          propsForDots: {
            r: '1.5',
            strokeWidth: '1',
            stroke: '#00ff7f',
          },
          formatYLabel: (value) => `$${Number(value).toLocaleString('en-US')}`,
        }}
        withHorizontalLines={true}
        withVerticalLines={false}
        withInnerLines={false}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    backgroundColor: '#0d1520',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartText: {
    color: '#8899aa',
    fontSize: 12,
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
    marginRight: -16,
  },
});

export default BinanceChart;