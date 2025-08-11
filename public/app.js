const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

// 아래는 실제 배포 주소, API 키는 Render 배포 백엔드에 맞게 수정 필요
const API_URL = 'https://me2verse-1-backend.onrender.com'; // 백엔드 주소

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
  }
}

async function pay() {
  try {
    status.textContent = '결제 진행 중...';

    const paymentData = {
      amount: 1,
      currency: 'PI',
      username: user.username,
      // 추가로 필요시 더 넣을 수 있음
    };

    const response = await fetch(`${API_URL}/payment/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.statusText}`);
    }

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

loginBtn.addEventListener('click', login);
payBtn.addEventListener('click', pay);

window.addEventListener('load', initSDK);
