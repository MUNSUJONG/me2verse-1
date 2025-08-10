// Me2Verse-1 backend - backend/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 상태 확인 - 명확히 Me2Verse-1로 표시
app.get('/', (req, res) => {
  res.send('✅ Me2Verse-1 Backend is running 🚀');
});

app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse-1 backend: ping OK');
});

// 결제 생성 (예시) - 실제 Pi API 경로/스펙에 맞춰 조정하세요
app.post('/payment/create', async (req, res) => {
  try {
    const { amount, memo, metadata } = req.body;
    const response = await axios.post(
      'https://api.minepi.com/v2/payments',
      { amount, memo, metadata },
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Me2Verse-1: payment/create error', err?.response?.data || err.message);
    res.status(500).json({ error: 'payment creation failed' });
  }
});

app.post('/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Me2Verse-1: payment/approve error', err?.response?.data || err.message);
    res.status(500).json({ error: 'payment approval failed' });
  }
});

app.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('Me2Verse-1: payment/complete error', err?.response?.data || err.message);
    res.status(500).json({ error: 'payment completion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Me2Verse-1 Server running on port ${PORT}`);
});
