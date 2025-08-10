require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Me2Verse-1 Backend 루트 정상 작동 중');
});

app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse-1 Backend 정상 작동 중');
});

app.post('/payment/approve', (req, res) => {
  const { transactionId, userId, amount } = req.body;
  console.log('결제 승인 요청:', req.body);

  // TODO: Pi API 검증 및 승인 처리 로직 추가 예정

  res.status(200).json({ message: '승인 처리 완료' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
