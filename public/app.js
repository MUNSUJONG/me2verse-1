// app.js

// 로그인 버튼과 결제 버튼 참조
const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const status = document.getElementById('status');

let user = null;

// Pi SDK 초기화 확인용 함수
function initializePiSdk() {
  if (typeof Pi === 'undefined') {
    status.innerText = 'Pi SDK를 찾을 수 없습니다.';
    return;
  }

  // SDK가 준비되면 로그인 버튼 활성화
  loginBtn.disabled = false;
  status.innerText = 'SDK 초기화 완료, 로그인하세요.';
}

// 로그인 버튼 클릭 이벤트
loginBtn.addEventListener('click', async () => {
  try {
    status.innerText = '로그인 중...';
    const scopes = ['username', 'payments'];

    const auth = await Pi.authenticate(scopes);
    user = auth.user;

    if (user) {
      status.innerText = `로그인 성공: ${user.username}`;
      loginBtn.style.display = 'none';
      payBtn.style.display = 'inline-block';
      payBtn.disabled = false;
    } else {
      status.innerText = '로그인 실패';
    }
  } catch (error) {
    status.innerText = '로그인 중 오류 발생';
    console.error(error);
  }
});

// 결제 버튼 클릭 이벤트 (예시)
payBtn.addEventListener('click', () => {
  if (!user) {
    alert('먼저 로그인해주세요.');
    return;
  }
  status.innerText = '결제 진행...';
  // 결제 로직 추가 예정
});

// 페이지가 다 로드되면 SDK 초기화 함수 실행
window.addEventListener('load', () => {
  initializePiSdk();
});
