require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 상태 확인
app.get('/', (req, res) => {
  res.send('✅ Me2Verse-1 Backend is running!');
});

// 결제 생성
app.post('/payment/create', async (req, res) => {
  try {
    const { amount, memo, metadata } = req.body;

    const response = await axios.post(
      'https://sandbox.minepi.com/v2/payments',
      { amount, memo, metadata },
      { headers: { Authorization: `Key ${process.env.PI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('결제 생성 실패:', error.message);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// 결제 승인
app.post('/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;

    const response = await axios.post(
      `https://sandbox.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${process.env.PI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('결제 승인 실패:', error.message);
    res.status(500).json({ error: 'Payment approval failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ Me2Verse-1 Backend running on port ${port}`);
});
