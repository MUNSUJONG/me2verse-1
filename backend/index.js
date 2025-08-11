require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const expected_api_key = 'gtb8uir8lajsglsvikwimadtzghxa63ynnohtxe8qlazuco105retxpq0zqu8i44';

app.post('/payment/approve', (req, res) => {
  const { amount, currency, apiKey } = req.body;

  console.log(`결제 요청: 금액 ${amount}, 통화 ${currency}, apiKey ${apiKey}`);

  if (apiKey !== expected_api_key) {
    return res.status(403).json({ approved: false, error: '잘못된 API 키' });
  }

  // 테스트용 승인 로직 (실제 서비스에서는 검증 절차 필요)
  res.json({ approved: true });
});

app.get('/ping', (req, res) => {
  res.send('🟢 me2verse-1 Backend 정상 작동 중');
});

app.listen(port, () => {
  console.log(`서버 실행 중 - 포트: ${port}`);
});
