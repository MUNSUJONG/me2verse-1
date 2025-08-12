const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('🟢 me2verse-1 Backend 정상 작동 중');
});

app.post('/payment/approve', (req, res) => {
  const paymentId = req.body.paymentId;
  console.log('결제 승인 요청 받음:', paymentId);

  // TODO: me2verse-1 서버 결제 승인 처리 로직

  res.json({ success: true, message: 'me2verse-1 결제 승인 완료' });
});

app.listen(PORT, () => {
  console.log(`🚀 me2verse-1 서버 실행 중: http://localhost:${PORT} (포트: ${PORT})`);
});
