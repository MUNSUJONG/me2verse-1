// Pi SDK 초기화 및 로그인, 결제 흐름 관리

const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

let user = null;

// SDK 초기화
async function initSDK() {
  try {
    await Pi.init({ appId: 'YOUR_APP_ID', appKey: 'YOUR_APP_KEY' }); // 반드시 실제 앱 ID, 키로 교체
    status.textContent = 'SDK 초기화 완료';
    loginBtn.disabled = false;
  } catch (error) {
    status.textContent = 'SDK 초기화 실패: ' + error.message;
  }
}

// 로그인 처리
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

// 결제 처리
async function pay() {
  try {
    status.textContent = '결제 진행 중...';

    const paymentData = {
      // 실제 결제 요청 데이터 구성
      amount: 1,
      currency: 'PI',
      // 추가 데이터 필요 시 삽입
    };

    // 예시: 결제 승인 API 호출 (API_URL은 백엔드 주소)
    const API_URL = 'https://YOUR_BACKEND_URL'; // 반드시 실제 백엔드 주소로 교체
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
