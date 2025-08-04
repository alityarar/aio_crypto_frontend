const jwt = require('jsonwebtoken');
const db = require('../config/db');

const getPortfolio = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [rows] = await db.query(
      'SELECT exchange, asset, quantity FROM portfolios WHERE user_id = ?',
      [userId]
    );

    // Veriyi frontend'e uygun formata dönüştür
    const portfolio = {};

    rows.forEach(({ exchange, asset, quantity }) => {
      if (!portfolio[exchange]) portfolio[exchange] = {};
      portfolio[exchange][asset] = parseFloat(quantity);
    });

    res.json(portfolio);
  } catch (err) {
    console.error('getPortfolio error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getPortfolio };
