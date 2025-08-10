require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;

// CORS 설정 (프론트엔드에서 localhost:4000 호출 허용)
app.use(cors());
app.use(express.json());

// 서버 상태 확인
app.get('/', (req, res) => {
  res.send('✅ Me2Verse Backend is running 🚀');
});

// 결제 생성
app.post('/payment/create', async (req, res) => {
  try {
    const { amount, memo, metadata } = req.body;
    const response = await axios.post(
      'https://api.minepi.com/v2/payments',
      { amount, memo, metadata },
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('❌ 결제 생성 실패:', error.message);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// 결제 승인
app.post('/payment/approve', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('❌ 결제 승인 실패:', error.message);
    res.status(500).json({ error: 'Payment approval failed' });
  }
});

// 결제 완료
app.post('/payment/complete', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('❌ 결제 완료 실패:', error.message);
    res.status(500).json({ error: 'Payment completion failed' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
