const button = document.getElementById('actionBtn');
const status = document.getElementById('status');

let user = null;

// Pi SDK 초기화 확인 및 버튼 활성화
function initializePiSdk() {
  if (typeof Pi === 'undefined') {
    status.innerText = 'Pi SDK를 찾을 수 없습니다.';
    button.disabled = true;
    return;
  }

  button.disabled = false;
  button.innerText = '로그인 및 테스트 결제 시작';
  status.innerText = '준비 완료, 버튼을 눌러 진행하세요.';
}

// Pi 로그인 함수
async function login() {
  try {
    status.innerText = '로그인 중...';
    const scopes = ['username', 'payments'];

    const auth = await Pi.authenticate(scopes);

    if (auth && auth.user) {
      user = auth.user;
      status.innerText = `로그인 성공: ${user.username}`;
      return true;
    } else {
      status.innerText = '로그인 실패';
      console.error('인증 결과 없음:', auth);
      return false;
    }
  } catch (err) {
    status.innerText = '로그인 중 오류 발생';
    console.error('로그인 오류:', err);
    return false;
  }
}

// 테스트 결제 함수 (샘플, 실제 연동 필요 시 수정)
async function testPayment() {
  try {
    status.innerText = '테스트 결제 진행 중...';

    // 실제 결제 API 호출 자리 (샘플 딜레이)
    await new Promise(resolve => setTimeout(resolve, 1500));

    status.innerText = '테스트 결제 완료!';
    return true;
  } catch (err) {
    status.innerText = '결제 중 오류 발생';
    console.error('결제 오류:', err);
    return false;
  }
}

// 버튼 클릭 이벤트: 로그인 → 결제 순서
button.addEventListener('click', async () => {
  button.disabled = true;

  if (!user) {
    const loggedIn = await login();
    if (!loggedIn) {
      button.disabled = false;
      button.innerText = '로그인 및 테스트 결제 시작';
      return;
    }
  }

  const paid = await testPayment();
  if (!paid) {
    button.disabled = false;
    button.innerText = '로그인 및 테스트 결제 시작';
    return;
  }

  button.innerText = '완료';
  button.disabled = true;
});

// 페이지 로드 시 SDK 초기화 시도
window.addEventListener('load', initializePiSdk);
