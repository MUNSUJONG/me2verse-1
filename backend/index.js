require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse-1 Backend 정상 작동 중');
});

app.post('/payment/approve', (req, res) => {
  console.log('결제 승인 요청:', req.body);
  // 실제 결제 승인 로직은 여기에 구현하세요
  res.json({ approved: true });
});

app.listen(PORT, () => {
  console.log(`Me2Verse-1 Backend 서버 실행 중 (포트 ${PORT})`);
});
