// Node.js와 Express.js를 사용하여 서버를 구성합니다.
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
// CORS(교차 출처 리소스 공유)를 허용하여 프론트엔드에서 백엔드로 요청을 보낼 수 있게 합니다.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인에서 접근 허용
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// JSON 형식의 요청 본문을 파싱하기 위한 미들웨어
app.use(bodyParser.json());

// '/public' 폴더를 정적 파일 호스팅 폴더로 지정합니다.
// 이 설정으로 me2verse-1/public/index.html 파일을 배포할 수 있습니다.
app.use(express.static(path.join(__dirname, '../public')));

// 'pi-sdk.js'에 정의된 결제 API를 처리하는 라우트입니다.
// 이 라우트는 결제 ID를 생성하고 반환합니다.
app.post('/create-payment', async (req, res) => {
    try {
        // Pi API는 SDK가 아닌 서버 측에서 호출되어야 합니다.
        // 여기서는 더미(가짜) 결제 ID를 생성하여 반환합니다.
        // 실제 운영 환경에서는 Pi SDK 서버 API를 호출하여 결제 ID를 생성해야 합니다.
        console.log('결제 요청 수신:', req.body);
        
        const newPaymentId = `pi-payment-id-${Date.now()}`;
        const newPayment = {
            "identifier": newPaymentId,
            "status": "pending",
            "amount": 1.0,
            "memo": "Test payment for me2verse-1 app"
        };

        // 결제 정보와 함께 결제 ID를 프론트엔드에 응답합니다.
        res.json({
            status: "OK",
            payment: newPayment
        });

    } catch (error) {
        console.error('결제 생성 오류:', error);
        res.status(500).json({ status: "ERROR", message: error.message });
    }
});

// 서버를 시작합니다.
app.listen(port, () => {
    console.log(`Pi Network Demo 앱 백엔드 서버가 http://localhost:${port}에서 실행 중입니다.`);
});
