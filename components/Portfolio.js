import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import API_BASE_URL from '../constants/api';


const screenWidth = Dimensions.get('window').width;




// Default pie chart data, will be updated with real data
const initialPieData = [
  { name: 'Binance', population: 25, color: '#00ff7f', legendFontColor: '#fff', legendFontSize: 12 },
  { name: 'BTCTurk', population: 25, color: '#ff3c3c', legendFontColor: '#fff', legendFontSize: 12 },
  { name: 'Kucoin', population: 25, color: '#441177', legendFontColor: '#fff', legendFontSize: 12 },
  { name: 'Coinbase', population: 25, color: '#005f99', legendFontColor: '#fff', legendFontSize: 12 },
];

const Portfolio = () => {
  const navigation = useNavigation();
  const [userHoldings, setUserHoldings] = useState({});  // 👈 burada olmalı
  const [pieData, setPieData] = useState(initialPieData);
  const [prices, setPrices] = useState({ Binance: {}, BTCTurk: {}, Kucoin: {}, Coinbase: {} });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(30); // Default USD/TRY rate


  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all exchanges in parallel
      const [resBinance, resBTCTurk, resKucoin, resCoinbase, resExchangeRate] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/24hr'),
        fetch('https://api.btcturk.com/api/v2/ticker'),
        fetch('https://api.kucoin.com/api/v1/market/allTickers'),
        fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY')
      ]).catch(err => {
        throw new Error(`Failed to fetch API data: ${err.message}`);
      });

      // Parse JSON responses
      const [dataBinance, dataBTCTurk, dataKucoin, dataCoinbase, dataExchangeRate] = await Promise.all([
        resBinance.json(),
        resBTCTurk.json(),
        resKucoin.json(),
        resCoinbase.json(),
        resExchangeRate.json()
      ]).catch(err => {
        throw new Error(`Failed to parse API data: ${err.message}`);
      });

      // Set USD/TRY exchange rate
      const exchangeRate = parseFloat(dataExchangeRate.price);
      setExchangeRate(exchangeRate);

      // Prepare data structures
      const allPrices = { Binance: {}, BTCTurk: {}, Kucoin: {}, Coinbase: {} };
      const exchangeTotals = { Binance: 0, BTCTurk: 0, Kucoin: 0, Coinbase: 0 };

      // Process holdings data for each exchange and coin
      Object.entries(userHoldings).forEach(([exchange, coins]) => {
        Object.entries(coins).forEach(([coin, amount]) => {
          try {
            switch (exchange) {
              case 'Binance':
                processBinanceData(coin, amount, dataBinance, allPrices, exchangeTotals);
                break;
              case 'BTCTurk':
                processBTCTurkData(coin, amount, dataBTCTurk, allPrices, exchangeTotals);
                break;
              case 'Kucoin':
                processKucoinData(coin, amount, dataKucoin, allPrices, exchangeTotals);
                break;
              case 'Coinbase':
                processCoinbaseData(coin, amount, dataCoinbase, allPrices, exchangeTotals);
                break;
            }
          } catch (err) {
            console.error(`Error processing ${exchange} ${coin}:`, err);
          }
        });
      });

      // Update state with collected data
      setPrices(allPrices);
      const totalValue = Object.values(exchangeTotals).reduce((acc, val) => acc + val, 0);
      setTotal(totalValue);

      // Update pie chart data
      updatePieChartData(exchangeTotals);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process Binance data
  const processBinanceData = (coin, amount, dataBinance, allPrices, exchangeTotals) => {
    const symbolBinance = coin + 'USDT';
    const itemBinance = dataBinance.find(i => i.symbol === symbolBinance);
    if (itemBinance) {
      const price = parseFloat(itemBinance.lastPrice);
      allPrices.Binance[coin] = {
        price,
        change: parseFloat(itemBinance.priceChangePercent)
      };
      exchangeTotals.Binance += price * amount;
    }
  };

  // Process BTCTurk data
  const processBTCTurkData = (coin, amount, dataBTCTurk, allPrices, exchangeTotals) => {
    // BTCTurk uses different pair formats
    const possiblePairs = [`${coin}USDT`, `${coin}-USDT`, `${coin}USD`, `${coin}-USD`];
    let itemBTCTurk = null;
    
    for (const pairFormat of possiblePairs) {
      itemBTCTurk = dataBTCTurk.data?.find(i => 
        i.pair === pairFormat || i.pairNormalized === pairFormat
      );
      if (itemBTCTurk) break;
    }

    if (itemBTCTurk) {
      const price = parseFloat(itemBTCTurk.last);
      allPrices.BTCTurk[coin] = {
        price,
        change: parseFloat(itemBTCTurk.dailyPercent || itemBTCTurk.daily || 0)
      };
      exchangeTotals.BTCTurk += price * amount;
    } else {
      // Fallback to Binance price if BTCTurk data not available
      if (allPrices.Binance[coin]) {
        allPrices.BTCTurk[coin] = {
          price: allPrices.Binance[coin].price * 0.98,
          change: allPrices.Binance[coin].change - 0.1
        };
        exchangeTotals.BTCTurk += allPrices.BTCTurk[coin].price * amount;
      }
    }
  };

  // Process Kucoin data
  const processKucoinData = (coin, amount, dataKucoin, allPrices, exchangeTotals) => {
    const symbolKucoin = `${coin}-USDT`;
    const itemKucoin = dataKucoin.data?.ticker?.find(i => i.symbol === symbolKucoin);
    
    if (itemKucoin) {
      const price = parseFloat(itemKucoin.last);
      let change = 0;
      
      if (itemKucoin.changeRate) {
        change = parseFloat(itemKucoin.changeRate);
        if (Math.abs(change) < 1) {
          change *= 100;
        }
      }
      
      allPrices.Kucoin[coin] = { price, change };
      exchangeTotals.Kucoin += price * amount;
    } else {
      // Fallback to Binance price if Kucoin data not available
      if (allPrices.Binance[coin]) {
        allPrices.Kucoin[coin] = {
          price: allPrices.Binance[coin].price * 1.02,
          change: allPrices.Binance[coin].change + 0.2
        };
        exchangeTotals.Kucoin += allPrices.Kucoin[coin].price * amount;
      }
    }
  };

  // Process Coinbase data
  const processCoinbaseData = (coin, amount, dataCoinbase, allPrices, exchangeTotals) => {
    try {
      const rate = dataCoinbase.data?.rates?.[coin];
      
      if (rate) {
        const price = 1 / parseFloat(rate);
        const change = allPrices.Binance[coin]?.change || (Math.random() * 2 - 1);
        
        allPrices.Coinbase[coin] = { price, change };
        exchangeTotals.Coinbase += price * amount;
      } else {
        // Fallback to Binance price
        if (allPrices.Binance[coin]) {
          allPrices.Coinbase[coin] = {
            price: allPrices.Binance[coin].price * 1.01,
            change: allPrices.Binance[coin].change - 0.3
          };
          exchangeTotals.Coinbase += allPrices.Coinbase[coin].price * amount;
        }
      }
    } catch (err) {
      console.error(`Error processing Coinbase ${coin}:`, err);
    }
  };

  // Update pie chart data
  const updatePieChartData = (exchangeTotals) => {
    const totalValue = Object.values(exchangeTotals).reduce((acc, val) => acc + val, 0);
    
    const exchangeColors = {
      'Binance': '#00ff7f',
      'BTCTurk': '#ff3c3c',
      'Kucoin': '#441177',
      'Coinbase': '#005f99'
    };

    const updatedPieData = Object.entries(exchangeTotals)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        population: value,
        color: exchangeColors[name],
        legendFontColor: '#fff',
        legendFontSize: 12,
        percentage: Math.round((value / totalValue) * 100)
      }));
      
    if (updatedPieData.length > 0) {
      setPieData(updatedPieData);
    }
  };

  // Format currency value
  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format percentage value
  const formatPercent = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  useEffect(() => {
  const fetchUserHoldings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/portfolio`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }

      const data = await response.json();
      console.log('Fetched portfolio:', data);
      setUserHoldings(data);
    } catch (err) {
      console.error('Portfolio fetch error:', err.message);
      setError(err.message);
    }
  };

  fetchUserHoldings();
}, []);


  // Fetch data on component mount and every 30s after
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Render holdings for an exchange
  const renderExchange = (name) => {
    const holdings = userHoldings[name];
    const priceData = prices[name];
    
    if (!holdings || !priceData) return null;
    
    return (
      <LinearGradient colors={['#1a2633', '#0d1520']} style={styles.card}>
        <View style={styles.exchangeHeader}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text 
            style={prices[name].BTC?.change >= 0 ? styles.positiveChange : styles.negativeChange}
          >
            {formatCurrency(Object.entries(holdings).reduce((total, [coin, amount]) => {
              return total + (priceData[coin]?.price || 0) * amount;
            }, 0))}
          </Text>
        </View>
        
        {Object.entries(holdings).map(([coin, amount], idx) => (
          <View key={idx} style={styles.holdingRow}>
            <Text style={[styles.holdingText, styles.flex30]}>{coin}</Text>
            <Text style={[styles.holdingText, styles.flex30]}>{amount}</Text>
            <View style={[styles.valueContainer, styles.flex40]}>
              <Text style={styles.holdingText}>
                {priceData[coin]?.price ? formatCurrency(amount * priceData[coin].price) : '-'}
              </Text>
              <Text 
                style={priceData[coin]?.change >= 0 ? styles.positiveChange : styles.negativeChange}
              >
                {priceData[coin]?.change ? formatPercent(priceData[coin].change) : '-'}
              </Text>
            </View>
          </View>
        ))}
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AIO Crypto</Text>
        <View style={styles.profile}>
          <Text style={styles.profileName}>Mustafa Yıldırım</Text>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={14} color="black" />
          </View>
        </View>
      </View>

      {loading && !prices.Binance.BTC ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff7f" />
          <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ff3c3c" />
          <Text style={styles.errorText}>Veri alınamadı: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.chartSection}>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieData}
                width={screenWidth - 100}
                height={180}
                chartConfig={{
                  color: () => '#fff',
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                absolute={false}
              />
            </View>
            
            {/* Chart Legend */}
            <View style={styles.legendContainer}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.name}</Text>
                </View>
              ))}
            </View>
            
            {/* Yüzdelik etiketleri - daha doğru konumlandırma */}
            {pieData.map((item, index) => {
              // Her dilimin toplam değere göre açısını hesaplayalım
              const total = pieData.reduce((sum, d) => sum + d.population, 0);
              
              // Her dilimin başlangıç açısını hesaplayalım
              // Önceki dilimlerin toplam yüzdesini hesaplama
              const prevSlicesPercentage = pieData
                .slice(0, index)
                .reduce((sum, d) => sum + (d.population / total), 0);
              
              // Bu dilimin yüzdesini hesapla
              const currentPercentage = item.population / total;
              
              // Bu dilimin orta açısını hesapla (radyan cinsinden)
              const midAngle = 2 * Math.PI * (prevSlicesPercentage + currentPercentage / 2) - Math.PI / 2;
              
              // Radius ve merkez konumunu ayarlayalım
              const radius = 50;  // Pie chart'ın yaklaşık yarıçapı
              const centerX = screenWidth / 2 - 120;  // Merkez X konumu (legend için alan bırakıyoruz)
              const centerY = 90;  // Merkez Y konumu
              
              // Orta noktadan dışarı doğru yarıçap kullanarak koordinat hesapla
              const x = centerX + radius * Math.cos(midAngle);
              const y = centerY + radius * Math.sin(midAngle);
              
              const percentage = Math.round((item.population / total) * 100);
              
              return (
                <Text
                  key={index}
                  style={[
                    styles.percentageLabel,
                    {
                      position: 'absolute',
                      left: x - 15, // Etiketin genişliğine göre ayarlayın
                      top: y - 10,  // Etiketin yüksekliğine göre ayarlayın
                      color: 'white',
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(0,0,0,0.3)', // Daha iyi okunabilirlik için
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }
                  ]}
                >
                  %{percentage}
                </Text>
              );
            })}
          </View>

          <LinearGradient colors={['#1a2633', '#0d1520']} style={styles.card}>
            <View style={styles.totalRow}>
              <Text style={styles.cardTitle}>Toplam</Text>
              <Text style={styles.cardTitle}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.cardSubtitle}>TL Değeri</Text>
              <Text style={styles.cardSubtitle}>
                {(total * exchangeRate).toLocaleString()} ₺
              </Text>
            </View>
            <Text style={styles.exchangeRate}>1 USD = {exchangeRate.toFixed(2)} ₺</Text>
          </LinearGradient>

          {renderExchange('BTCTurk')}
          {renderExchange('Binance')}
          {renderExchange('Kucoin')}
          {renderExchange('Coinbase')}
          
          <View style={styles.spacer} />
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')} style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="white" />
          <Text style={styles.navLabel}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="wallet" size={24} color="white" />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: 'white',
    marginTop: 12
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24
  },
  retryButton: {
    backgroundColor: '#1a2633',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold'
  },
  chartSection: {
    position: 'relative',
    height: 200,
    marginBottom: 16,
  },
  chartContainer: {
    position: 'relative',
    height: 200,
    justifyContent: 'center',
  },
  legendContainer: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: 'transparent',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
  },
  percentageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  cardSubtitle: {
    color: '#8899aa',
    fontSize: 14,
    marginTop: 8
  },
  exchangeRate: {
    color: '#8899aa',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4
  },
  positiveChange: {
    color: '#00ff7f',
    fontWeight: 'bold'
  },
  negativeChange: {
    color: '#ff3c3c',
    fontWeight: 'bold'
  },
  exchangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)'
  },
  holdingText: {
    color: 'white'
  },
  flex30: {
    width: '30%'
  },
  flex40: {
    width: '40%'
  },
  valueContainer: {
    alignItems: 'flex-end'
  },
  spacer: {
    height: 80
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2633',
    backgroundColor: '#000000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
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

export default Portfolio;