import { useEffect, useState, useRef } from 'react';

const formatCurrency = (value, locale = 'en-US', currency = 'USD') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const useExchangeData = (pair = 'btcusdt') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousDataRef = useRef([]);

  useEffect(() => {
    let ws;
    let isMounted = true;

    const fetchOtherExchanges = async () => {
      try {
        const [btcturkRes, kucoinRes, coinbaseRes] = await Promise.all([
          fetch('https://api.btcturk.com/api/v2/ticker'),
          fetch('https://api.kucoin.com/api/v1/market/stats?symbol=BTC-USDT'),
          fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot'),
        ]);

        const btcturkData = await btcturkRes.json();
        const kucoinData = await kucoinRes.json();
        const coinbaseData = await coinbaseRes.json();

        const btcBTCTurk = btcturkData.data.find(i => i.pair === 'BTCUSDT');

        const btcturk = {
          name: 'BTCTurk',
          price: formatCurrency(parseFloat(btcBTCTurk.last)),
          percent: `${(parseFloat(btcBTCTurk.changeRate) * 100).toFixed(2)}%`,
          percentColor: parseFloat(btcBTCTurk.changeRate) >= 0 ? '#00ff99' : '#ff4c4c',
          buy: formatCurrency(parseFloat(btcBTCTurk.bid)),
          sell: formatCurrency(parseFloat(btcBTCTurk.ask)),
        };

        const kucoin = {
          name: 'KuCoin',
          price: formatCurrency(parseFloat(kucoinData.data.last)),
          percent: `${(parseFloat(kucoinData.data.changeRate) * 100).toFixed(2)}%`,
          percentColor: parseFloat(kucoinData.data.changeRate) >= 0 ? '#00ff99' : '#ff4c4c',
          buy: formatCurrency(parseFloat(kucoinData.data.buy)),
          sell: formatCurrency(parseFloat(kucoinData.data.sell)),
        };

        const coinbasePrice = parseFloat(coinbaseData.data.amount);
        const prev = coinbasePrice * 0.9985;
        const change = ((coinbasePrice - prev) / prev) * 100;

        const coinbase = {
          name: 'Coinbase',
          price: formatCurrency(coinbasePrice),
          percent: `${change.toFixed(2)}%`,
          percentColor: change >= 0 ? '#00ff99' : '#ff4c4c',
          buy: formatCurrency(coinbasePrice),
          sell: formatCurrency(coinbasePrice + 10),
        };

        return [btcturk, kucoin, coinbase];
      } catch (err) {
        console.error('Diğer borsa verileri alınamadı:', err);
        return [];
      }
    };

    const setupWebSocket = async () => {
      const otherExchanges = await fetchOtherExchanges();

      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@ticker`);


      ws.onopen = () => console.log('✅ Binance WebSocket bağlandı');

      ws.onmessage = e => {
        try {
          const msg = JSON.parse(e.data);
          const last = parseFloat(msg.c);
          const bid = parseFloat(msg.b);
          const ask = parseFloat(msg.a);
          const change = parseFloat(msg.P);

          const binance = {
            name: 'Binance',
            price: formatCurrency(last),
            percent: `${change.toFixed(2)}%`,
            percentColor: change >= 0 ? '#00ff99' : '#ff4c4c',
            buy: formatCurrency(bid),
            sell: formatCurrency(ask),
          };

          if (isMounted) {
            previousDataRef.current = data;
            setData([binance, ...otherExchanges]);
            setLoading(false);
          }
        } catch (err) {
          console.error('WebSocket verisi çözümlenemedi:', err);
        }
      };

      ws.onerror = err => console.error('❌ Binance WebSocket hatası:', err.message);
      ws.onclose = () => console.warn('⚠️ Binance WebSocket kapatıldı');
    };

    setupWebSocket();

    return () => {
      isMounted = false;
      if (ws) ws.close();
    };
  }, [pair]);

  return { data, loading, previousData: previousDataRef.current };
};
