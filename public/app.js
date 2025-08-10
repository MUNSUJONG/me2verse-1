const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusDiv = document.getElementById('status');

let userSession = null;

function isPiBrowser() {
  return !!window.Pi && !!window.Pi.authenticate;
}

// 페이지 로딩 시점에 Pi SDK 상태 체크
window.addEventListener('DOMContentLoaded', () => {
  console.log('window.Pi:', window.Pi);
  console.log('window.Pi && window.Pi.authenticate:', window.Pi && window.Pi.authenticate);

  if (!isPiBrowser()) {
    statusDiv.textContent = 'Pi Browser에서 접속해 주세요.';
    loginBtn.disabled = true;
    payBtn.disabled = true;
    return;
  }

  statusDiv.textContent = 'Pi Browser 확인 완료. 로그인해 주세요.';
  loginBtn.disabled = false;
  payBtn.disabled = true;

  loginBtn.onclick = async () => {
    console.log('로그인 버튼 클릭됨');
    statusDiv.textContent = '로그인 시도 중...';
    try {
      userSession = await window.Pi.authenticate({
        appName: 'Me2Verse-1',
        sandbox: true,
      });
      console.log('로그인 성공, userSession:', userSession);
      statusDiv.textContent = `로그인 성공: ${userSession.address}`;
      payBtn.disabled = false;
    } catch (e) {
      console.error('로그인 실패:', e);
      statusDiv.textContent = '로그인 실패: ' + e.message;
      payBtn.disabled = true;
    }
  };

  payBtn.onclick = async () => {
    if (!userSession) {
      statusDiv.textContent = '먼저 로그인해주세요.';
      return;
    }
    statusDiv.textContent = '결제 요청 중...';

    try {
      const tx = await window.Pi.request({
        appName: 'Me2Verse-1',
        action: 'transfer',
        to: 'YOUR_PI_WALLET_ADDRESS',  // 본인 지갑 주소로 변경하세요
        amount: 1,
        memo: '테스트 결제',
        sandbox: true,
      });
      console.log('결제 성공:', tx);
      statusDiv.textContent = '결제 성공! Tx ID: ' + tx.transactionId;
    } catch (e) {
      console.error('결제 실패:', e);
      statusDiv.textContent = '결제 실패: ' + e.message;
    }
  };
});
