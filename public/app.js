const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

const API_URL = 'https://me2verse-1-backend.onrender.com'; // 배포한 Render 백엔드 주소 반드시 맞게 수정하세요

let user = null;

// Pi SDK 안전 초기화 함수 (완전 로드 대기)
function initPiSDK() {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const maxRetries = 20; // 최대 20번 시도
    const interval = 500;

    const checkPi = () => {
      if (window.Pi && typeof window.Pi.init === 'function') {
        window.Pi.init({ version: "2.0" }) // SDK 버전 명시
          .then(() => {
            status.textContent = 'SDK 초기화 완료';
            loginBtn.disabled = false;
            resolve();
          })
          .catch(err => {
            reject(new Error('SDK 초기화 실패: ' + err.message));
          });
      } else {
        retries++;
        if (retries <= maxRetries) {
          status.textContent = `SDK 로드 대기 중... (${retries}/${maxRetries})`;
          setTimeout(checkPi, interval);
        } else {
          reject(new Error('Pi SDK 로드 실패: Pi 객체를 찾을 수 없음'));
        }
      }
    };

    checkPi();
  });
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
      amount: 1,
      currency: 'PI',
      username: user.username,
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
  }
}

window.addEventListener('load', () => {
  initPiSDK().catch(err => {
    status.textContent = err.message;
    alert('Pi SDK 로드 실패: Pi Browser에서 실행 중인지 확인하세요.');
    console.error(err);
  });
});

loginBtn.addEventListener('click', login);
payBtn.addEventListener('click', pay);
