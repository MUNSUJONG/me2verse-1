const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 10000;

// 미들웨어
app.use(cors()); // 로컬 테스트 시 CORS 문제 방지
app.use(bodyParser.json());

// 상태 확인
app.get('/ping', (req, res) => {
  res.send('🟢 로컬 서버 정상 작동 중');
});

// 결제 승인 샘플
app.post('/approve-payment', (req, res) => {
  const { txid, amount } = req.body;
  console.log(`결제 승인 요청: txid=${txid}, amount=${amount}`);
  // 실제 Pi 결제 API 호출 시 여기서 처리
  res.json({ success: true, txid, amount });
});

// 서버 실행 (0.0.0.0 바인딩)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 서버 실행 중: http://localhost:${PORT}`);
});
