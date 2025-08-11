const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

let user = null;

async function initSDK() {
  try {
    if (!window.Pi) throw new Error("Pi SDK가 로드되지 않았습니다.");
    await Pi.init();
    status.textContent = 'SDK 초기화 완료';
    loginBtn.disabled = false;
  } catch (error) {
    status.textContent = 'SDK 초기화 실패: ' + error.message;
    console.error(error);
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
    console.error(error);
  }
}

async function pay() {
  try {
    status.textContent = '결제 진행 중...';

    const paymentData = {
      amount: 1,
      currency: 'PI',
    };

    const API_URL = 'https://me2verse-1-backend.onrender.com'; // 실제 Render 백엔드 주소로 변경하세요

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
    console.error(error);
  }
}

window.addEventListener('load', initSDK);
loginBtn.addEventListener('click', login);
payBtn.addEventListener('click', pay);
