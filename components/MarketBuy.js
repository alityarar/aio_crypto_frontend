import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const exchanges = [
  { name: 'Binance', amount: '0,0033', price: '40.492,13', change: '-0,01' },
  { name: 'BtcTurk', amount: '0,0024', price: '40.493,86', change: '-0,01' },
  { name: 'Coinbase', amount: '0,0003', price: '40.490,13', change: '+0,02' },
  { name: 'Kucoin', amount: '0,0012', price: '40.494,46', change: '+0,07' },
];

const orderBook = [
  { amount: '123.88', price: '40.510,99' },
  { amount: '123.88', price: '40.510,89' },
  { amount: '123.88', price: '40.510,79' },
  { amount: '123.88', price: '40.510,69' },
  { amount: '123.88', price: '40.494,46' },
  { amount: '123.88', price: '40.444,99' },
  { amount: '123.88', price: '40.424,99' },
  { amount: '123.88', price: '40.414,99' },
  { amount: '123.88', price: '40.404,99' },
];

const MarketBuy = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AIO Crypto</Text>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>BTC/USDT</Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.toggleButtonActive}>
            <Text style={styles.toggleTextActive}>AL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton}>
            <Text style={styles.toggleText}>SAT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Borsa</Text>
        <Text style={styles.headerText}>Adet</Text>
        <Text style={styles.headerText}>Son Değer</Text>
      </View>

      {exchanges.map((exchange, index) => (
        <View key={index} style={styles.exchangeRow}>
          <View style={styles.exchangeNameContainer}>
            <View style={styles.dot} />
            <Text style={styles.exchangeName}>{exchange.name}</Text>
          </View>
          <Text style={styles.amount}>{exchange.amount}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{exchange.price}</Text>
            <Text style={[styles.change, { color: exchange.change.includes('+') ? '#00ff7f' : '#ff3c3c' }]}>
              {exchange.change}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Adet</Text>
          <Text style={styles.chartTitle}>Fiyat</Text>
          <Text style={styles.chartTitle}>TUTAR</Text>
        </View>

        <View style={styles.chartContent}>
          <Text style={styles.inputLabel}>TUTAR</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>0.00</Text>
          </View>

          <View style={styles.percentButtons}>
            <TouchableOpacity style={styles.percentButton}>
              <Text style={styles.percentButtonText}>%25</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.percentButton}>
              <Text style={styles.percentButtonText}>%50</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.percentButton}>
              <Text style={styles.percentButtonText}>%75</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.percentButton}>
              <Text style={styles.percentButtonText}>%100</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.kullanilabilir}>Kullanılabilir: 1.000,00 USDT</Text>

          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>BTC AL</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    backgroundColor: 'black', 
    paddingHorizontal: 16, 
    paddingTop: 48 
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
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  dropdown: { 
    backgroundColor: '#1a2633', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dropdownText: { 
    color: 'white', 
    fontSize: 14 
  },
  iconRow: { 
    flexDirection: 'row',
    backgroundColor: '#1a2633',
    borderRadius: 8,
    overflow: 'hidden'
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleButtonActive: {
    backgroundColor: '#00ff7f',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleText: {
    color: 'white',
  },
  toggleTextActive: {
    color: 'black',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a2633',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  headerText: {
    color: 'white',
    flex: 1
  },
  exchangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2633'
  },
  exchangeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 8
  },
  exchangeName: {
    color: 'white'
  },
  amount: {
    color: 'white',
    flex: 1
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  price: {
    color: 'white'
  },
  change: {
    marginLeft: 8
  },
  chartContainer: {
    backgroundColor: '#1a2633',
    borderRadius: 16,
    padding: 16,
    marginTop: 16
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  chartTitle: {
    color: 'white',
    fontSize: 14
  },
  chartContent: {
    gap: 16
  },
  inputLabel: {
    color: '#8899aa',
    marginBottom: 4
  },
  inputContainer: {
    backgroundColor: '#0d1520',
    padding: 12,
    borderRadius: 8
  },
  inputText: {
    color: 'white',
    fontSize: 16
  },
  percentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  percentButton: {
    backgroundColor: '#0d1520',
    padding: 8,
    borderRadius: 8,
    flex: 1
  },
  percentButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  kullanilabilir: {
    color: '#8899aa',
    fontSize: 12
  },
  buyButton: {
    backgroundColor: '#00ff7f',
    padding: 16,
    borderRadius: 8,
    marginTop: 16
  },
  buyButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2633',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black'
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

export default MarketBuy;