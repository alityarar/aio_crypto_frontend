import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Alerts = () => {
  const navigation = useNavigation();

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

      {/* Dropdown selectors */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Binance</Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>BTC/USDT</Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Empty state message */}
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz alarm oluşturulmadı</Text>
      </View>

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
  dropdownContainer: {
    gap: 12,
    marginBottom: 24
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a2633',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  dropdownText: {
    color: 'white',
    fontSize: 14
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#8899aa',
    fontSize: 16
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

export default Alerts;