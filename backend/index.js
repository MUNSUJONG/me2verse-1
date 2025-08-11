const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('🟢 me2verse-1 Backend 정상 작동 중');
});

app.listen(PORT, () => {
  console.log(`🟢 me2verse-1 Backend 서버 실행 중 - 포트: ${PORT}`);
});
