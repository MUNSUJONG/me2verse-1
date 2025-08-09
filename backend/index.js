require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const piApiKey = process.env.PI_API_KEY;

app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse Backend 정상 작동 중');
});

app.post('/payment/approve', (req, res) => {
  // 결제 승인 요청 처리
  const { transactionId, userId, amount } = req.body;
  console.log('결제 승인 요청:', req.body);

  // 실제 검증 로직은 추가 개발 필요
  res.status(200).json({ message: '승인 처리 완료' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
