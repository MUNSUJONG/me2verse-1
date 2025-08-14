require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const PI_API_KEY = process.env.PI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

// 서버 상태 확인
app.get('/ping', (req, res) => {
  res.send('🟢 Render 서버 정상 작동 중');
});

// 결제 승인
app.post('/approve-payment', (req, res) => {
  const { txid, amount } = req.body;
  console.log(`결제 승인 요청: txid=${txid}, amount=${amount}`);
  // 실제 Pi 결제 API 호출 시 여기에 처리
  res.json({ success: true, txid, amount });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Render 서버 실행 중: http://localhost:${PORT}`);
});
