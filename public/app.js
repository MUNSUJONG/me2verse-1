const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

let user = null;

// SDK 초기화 (앱 ID/키 없이 Pi Browser 환경에 맞게)
async function initSDK() {
  try {
    await Pi.init();
    status.textContent = 'SDK 초기화 완료';
    loginBtn.disabled = false;
  } catch (error) {
    status.textContent = 'SDK 초기화 실패: ' + error.message;
  }
}

// 로그인 함수 (Pi Browser 내에서만 정상 동작)
async function login() {
  try {
    status.textContent = '로그인 중...';
    user = await Pi.login();
    if (user) {
      status.textContent = `로그인 성공: ${user.username}`;
      loginBtn.style.display = 'none';
      payBtn.style.display = 'inline-block';
      payBtn.disabled = false;
    } else {
      status.textContent = '로그인 실패';
    }
  } catch (error) {
    status.textContent = '로그인 오류: ' + error.message;
  }
}

// 결제 진행 함수 (백엔드 API 주소만 실제로 맞춰서 사용하세요)
async function pay() {
  try {
    status.textContent = '결제 진행 중...';

    const paymentData = {
      amount: 1,
      currency: 'PI',
      // 백엔드에 필요한 데이터 추가
    };

    const API_URL = 'https://me2verse-1-backend.onrender.com'; // Render에 배포한 백엔드 주소로 교체

    const response = await fetch(`${API_URL}/payment/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.approved) {
      status.textContent = '결제 승인 완료!';
      payBtn.disabled = true;
    } else {
      status.textContent = '결제 승인 실패';
    }
  } catch (error) {
    status.textContent = '결제 오류: ' + error.message;
  }
}

loginBtn.addEventListener('click', login);
payBtn.addEventListener('click', pay);

window.addEventListener('load', initSDK);
