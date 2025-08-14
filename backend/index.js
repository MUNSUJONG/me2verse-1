require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const PI_API_KEY = process.env.PI_API_KEY;

if (!PI_API_KEY) {
  console.error("❌ Pi API Key가 .env에 설정되지 않았습니다!");
  process.exit(1);
}

// 상태 확인용 라우트
app.get('/ping', (req, res) => {
  res.send(`🟢 서버 정상 작동 중 - Pi API Key 로드됨 ✅`);
});

// Pi 결제 승인 예시 라우트
app.post('/approve-payment', (req, res) => {
  const { txid, amount } = req.body;
  console.log(`[결제 승인 요청] txid=${txid}, amount=${amount}`);
  
  // TODO: 실제 Pi Network API 호출
  res.json({ status: 'approved', txid, amount });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  console.log(`Pi API Key: ✅ Loaded`);
});
