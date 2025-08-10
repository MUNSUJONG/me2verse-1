# Me2Verse-1

Me2Verse-1 backend (Express) — Pi 결제 생성/승인/완료 엔드포인트 포함.

## 빠른 시작
1. 복제: `git clone https://github.com/<your-username>/me2verse-1.git`
2. 환경변수 설정: `.env` 파일에 `PI_API_KEY` 추가
3. 설치: `npm install`
4. 실행: `npm start` (또는 개발: `npm run dev`)

## 엔드포인트
- GET `/` - 상태 확인
- GET `/ping` - ping
- POST `/payment/create` - 결제 생성
- POST `/payment/approve` - 결제 승인
- POST `/payment/complete` - 결제 완료
