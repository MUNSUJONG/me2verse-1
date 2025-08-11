const loginbtn = document.getElementById('loginBtn');
const paybtn = document.getElementById('payBtn');
const status = document.getElementById('status');

// me2verse-1 앱 설정값
const app_id = '4e3129f0';  // me2verse-1 앱 ID
const app_key = '2qoy14x27n0wrf6cnxxscq9k2vo5ukop';  // me2verse-1 앱 Key
const api_url = 'https://me2verse-1-backend.onrender.com';  // Render 배포 백엔드 주소

const pi_api_key = 'gtb8uir8lajsglsvikwimadtzghxa63ynnohtxe8qlazuco105retxpq0zqu8i44';

let user = null;

async function initSDK() {
  try {
    await Pi.init({ appId: app_id, appKey: app_key });
    status.textContent = 'SDK 초기화 완료';
    loginbtn.disabled = false;
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
      loginbtn.style.display = 'none';
      paybtn.style.display = 'inline-block';
      paybtn.disabled = false;
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
      apiKey: pi_api_key,
    };

    const response = await fetch(`${api_url}/payment/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.approved) {
      status.textContent = '결제 승인 완료!';
      paybtn.disabled = true;
    } else {
      status.textContent = '결제 승인 실패';
    }
  } catch (error) {
    status.textContent = '결제 오류: ' + error.message;
  }
}

loginbtn.addEventListener('click', login);
paybtn.addEventListener('click', pay);

window.addEventListener('load', initSDK);
