require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 결제 승인 콜백 처리 라우트
app.post('/payment/approve', (req, res) => {
  // 여기서 Pi 서버로부터 온 결제 승인 요청 검증 및 처리
  const { transactionId, userId, amount } = req.body;
  console.log('결제 승인 요청:', req.body);

  // TODO: 실제 검증 로직 추가 필요 (서명 검증 등)

  // 결제 승인 처리 후 Pi 네트워크에 승인 완료 알림 보내기 (예: Pi SDK 또는 API 사용)

  res.status(200).json({ message: '승인 처리 완료' });
});

// 서버 상태 확인용
app.get('/ping', (req, res) => {
  res.send('🟢 Me2Verse Backend 서버 정상 실행 중');
});

app.listen(PORT, () => {
  console.log(`백엔드 서버 실행 중: http://localhost:${PORT}`);
});
