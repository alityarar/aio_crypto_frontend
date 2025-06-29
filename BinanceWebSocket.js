import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BinanceWebSocket = () => {
  const [price, setPrice] = useState(null);
  const [percent, setPercent] = useState(null);
  const [changeColor, setChangeColor] = useState('#ffffff');

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const lastPrice = parseFloat(data.c);
      const priceChangePercent = parseFloat(data.P);

      setPrice(lastPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }));

      setPercent(`${priceChangePercent.toFixed(2)}%`);
      setChangeColor(priceChangePercent >= 0 ? '#00ff99' : '#ff4c4c');
    };

    ws.onerror = (e) => {
      console.error('WebSocket error', e.message);
    };

    ws.onclose = () => {
      console.log('WebSocket bağlantısı kapandı');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Binance (BTC/USDT)</Text>
      <Text style={styles.price}>{price || '...'}</Text>
      <Text style={[styles.percent, { color: changeColor }]}>{percent || ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#0d1520',
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    color: '#8899aa',
    marginBottom: 4,
    fontSize: 12,
  },
  price: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  percent: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default BinanceWebSocket;
