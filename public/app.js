const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusDiv = document.getElementById('status');

let userSession = null;

function isPiBrowser() {
  return !!window.Pi && !!window.Pi.authenticate;
}

window.addEventListener('DOMContentLoaded', () => {
  statusDiv.textContent = 'Pi SDK 로딩 중...';

  if (!isPiBrowser()) {
    statusDiv.textContent = 'Pi Browser에서만 작동합니다. Pi Browser로 접속해주세요.';
    loginBtn.disabled = true;
    payBtn.disabled = true;
    return;
  }

  statusDiv.textContent = 'Pi Browser 확인 완료. 로그인 버튼을 눌러주세요.';
  loginBtn.disabled = false;

  loginBtn.onclick = async () => {
    statusDiv.textContent = '로그인 시도 중...';
    try {
      userSession = await window.Pi.authenticate({
        appName: 'Me2Verse-1',  // Pi 개발자센터에 등록된 앱 이름
        sandbox: true,
      });
      statusDiv.textContent = `로그인 성공!\n주소: ${userSession.address}\nID: ${userSession.userId}`;
      payBtn.disabled = false;
    } catch (err) {
      statusDiv.textContent = '로그인 실패: ' + err.message;
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
        to: '사용자_지갑_주소',  // 실제 Pi 네트워크 지갑 주소로 변경 필요
        amount: 1,
        memo: '테스트 결제',
        sandbox: true,
      });
      statusDiv.textContent = `결제 성공!\nTx ID: ${tx.transactionId}`;
    } catch (err) {
      statusDiv.textContent = '결제 실패: ' + err.message;
    }
  };
});
