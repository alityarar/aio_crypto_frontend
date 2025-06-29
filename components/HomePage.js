import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useExchangeData } from '../hooks/useExchangeData';
import BinanceChart from '../components/BinanceChart'; // doğru dizin olduğuna emin ol
import React, { useEffect, useState } from 'react'; // <== useState ve useEffect eklendi


const chartData = {
  labels: [],
  datasets: [
    {
      data: [40500, 40600, 40400, 40700, 40900, 40800, 41000],
      strokeWidth: 2,
    },
  ],
};

const screenWidth = Dimensions.get('window').width;

const HomePage = () => {
  const navigation = useNavigation();
  const { data: exchanges, loading, previousData } = useExchangeData('btcusdt');

  const [trendArrows, setTrendArrows] = useState({});
  useEffect(() => {
  if (!previousData || previousData.length === 0 || !exchanges || exchanges.length === 0) return;

  const updatedArrows = { ...trendArrows };

  exchanges.forEach((item) => {
    const previous = previousData.find((p) => p.name === item.name);
    const currentPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
    const previousPrice = previous ? parseFloat(previous.price.replace(/[^0-9.-]+/g, '')) : null;

    if (previousPrice !== null) {
      if (currentPrice > previousPrice) {
        updatedArrows[item.name] = 'up';
      } else if (currentPrice < previousPrice) {
        updatedArrows[item.name] = 'down';
      }
      // eşitse eski değer korunur
    }
  });

  setTrendArrows(updatedArrows);
}, [exchanges, previousData]);
  

  
  

  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AIO Crypto</Text>
        <View style={styles.profile}>
          <Text style={styles.profileName}>Mustafa Yıldırım</Text>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={14} color="black" />
          </View>
        </View>
      </View>

      {/* Currency selector and icons */}
      <View style={styles.selectorContainer}>
        <View style={styles.currencySelector}>
          <Text style={styles.currencyText}>BTC/USDT</Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Ionicons name="document-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="add-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>Yükleniyor...</Text>
        ) : (
          <>
            {/* Exchange Cards */}
            {exchanges.map((item, idx) => {
  const previousExchange = previousData.find(p => p.name === item.name);
  const currentPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
  const previousPrice = previousExchange
    ? parseFloat(previousExchange.price.replace(/[^0-9.-]+/g, ''))
    : null;

  const trendIcon =
    previousPrice !== null
      ? currentPrice > previousPrice
        ? 'arrow-up'
        : currentPrice < previousPrice
        ? 'arrow-down'
        : null
      : null;

  return (
    <LinearGradient
      key={idx}
      colors={['#1a2633', '#0d1520']}
      style={styles.card}
    >
      <View style={styles.cardTopRow}>
        <Text style={styles.exchangeName}>{item.name}</Text>
        <Text style={styles.volume}>Veri</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
  <Text style={styles.price}>{item.price}</Text>
  {trendArrows[item.name] && (
  <Text
    style={{
      color: trendArrows[item.name] === 'up' ? '#00ff99' : '#ff4c4c',
      fontSize: 16,
    }}
  >
    {trendArrows[item.name] === 'up' ? '▲' : '▼'}
  </Text>
)}

</View>
        
      </View>

      <Text style={[styles.percent, { color: item.percentColor }]}>
        {item.percent}
      </Text>
      <View style={styles.tradeRow}>
        <Text style={styles.tradeText}>Alış: {item.buy}</Text>
        <Text style={styles.tradeText}>Satış: {item.sell}</Text>
      </View>
    </LinearGradient>
  );
})}

            {/* Chart */}
            <BinanceChart />

          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Portfolio')} style={styles.navItem}>
          <Ionicons name="wallet-outline" size={24} color="white" />
          <Text style={styles.navLabel}>Portföyüm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MarketBuy')} style={styles.navItem}>
          <Ionicons name="swap-horizontal-outline" size={24} color="white" />
          <Text style={styles.navLabel}>Al / Sat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Alerts')} style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="white" />
          <Text style={styles.navLabel}>Alarmlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 40
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  profileName: {
    color: 'white',
    fontSize: 12
  },
  profileIcon: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2633',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8
  },
  currencyText: {
    color: 'white',
    fontSize: 14
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 16
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  exchangeName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  volume: {
    color: '#8899aa',
    fontSize: 12
  },
  price: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 8
  },
  percent: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  tradeText: {
    color: 'white',
    fontSize: 14
  },
  chartContainer: {
    backgroundColor: '#0d1520',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24
  },
  chartText: {
    color: '#8899aa',
    fontSize: 12,
    marginBottom: 16
  },
  chart: {
    borderRadius: 16,
    marginRight: -16
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2633',
    backgroundColor: '#000000'
  },
  navItem: {
    alignItems: 'center'
  },
  navLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4
  }
});

export default HomePage;
