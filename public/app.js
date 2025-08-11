const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

const APP_ID = 'abcd1234';    // 본인 Pi 앱 ID로 반드시 교체
const APP_KEY = 'key5678xyz'; // 본인 Pi 앱 Key로 반드시 교체
const API_URL = 'https://me2verse-1-backend.onrender.com'; // Render 백엔드 주소로 반드시 교체

let user = null;

async function initSDK() {
  try {
    await Pi.init({ appId: APP_ID, appKey: APP_KEY });
    status.textContent = 'SDK 초기화 완료';
    loginBtn.disabled = false;
  } catch (error) {
    status.textContent = 'SDK 초기화 실패: ' + error.message;
  }
}

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

async function pay() {
  try {
    status.textContent = '결제 진행 중...';

    const paymentData = {
      amount: 1,
      currency: 'PI',
    };

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
