const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusDiv = document.getElementById('status');

let userSession = null;

function isPiBrowser() {
  return !!window.Pi && !!window.Pi.authenticate;
}

window.addEventListener('DOMContentLoaded', () => {
  if (!isPiBrowser()) {
    statusDiv.textContent = 'Pi Browser에서 접속해 주세요.';
    loginBtn.disabled = true;
    payBtn.disabled = true;
    return;
  }

  loginBtn.onclick = async () => {
    statusDiv.textContent = '로그인 시도 중...';
    try {
      userSession = await window.Pi.authenticate({
        appName: 'Me2Verse-1',
        sandbox: true,
      });
      statusDiv.textContent = `로그인 성공: ${userSession.address}`;
      payBtn.disabled = false;
    } catch (e) {
      statusDiv.textContent = '로그인 실패: ' + e.message;
      payBtn.disabled = true;
    }
  };

  payBtn.onclick = async () => {
    if (!userSession) {
      statusDiv.textContent = '먼저 로그인하세요.';
      return;
    }

    statusDiv.textContent = '결제 요청 중...';

    try {
      const transaction = await window.Pi.request({
        method: 'transaction.request',
        params: [
          {
            to: 'YOUR_PI_WALLET_ADDRESS', // 반드시 본인 지갑 주소로 변경
            amount: 1,
            memo: '테스트 결제 1π',
          },
        ],
      });

      if (transaction.error) {
        statusDiv.textContent = '결제 실패: ' + transaction.error;
        return;
      }

      const response = await fetch('https://me2verse-1.onrender.com/payment/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: transaction.transactionId,
          userId: userSession.address,
          amount: 1,
        }),
      });

      if (response.ok) {
        statusDiv.textContent = '결제 승인 완료!';
      } else {
        statusDiv.textContent = '서버 승인 실패';
      }
    } catch (e) {
      statusDiv.textContent = '결제 오류: ' + e.message;
    }
  };
});
