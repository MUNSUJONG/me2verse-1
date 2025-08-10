require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 루트 경로
app.get('/', (req, res) => {
  res.send('🟢 Me2Verse Backend 루트 경로 정상 작동 중');
});

// 핑 테스트
app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse Backend 정상 작동 중');
});

// 결제 승인 콜백
app.post('/payment/approve', (req, res) => {
  const { transactionId, userId, amount } = req.body;
  console.log('결제 승인 요청:', req.body);

  // TODO: 실제 Pi API 검증 및 승인 처리 로직 추가

  res.status(200).json({ message: '승인 처리 완료' });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
