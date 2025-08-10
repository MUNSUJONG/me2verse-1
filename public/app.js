const loginBtn = document.getElementById('login-btn');
const payBtn = document.getElementById('pay-btn');
const statusDiv = document.getElementById('status');

let userSession = null;

loginBtn.onclick = async () => {
  statusDiv.textContent = '로그인 시도 중...';
  try {
    userSession = await window.Pi.authenticate({
      appName: 'Me2Verse',
      sandbox: true, // 테스트용 샌드박스 모드 켜기
    });
    statusDiv.textContent = `로그인 성공: ${userSession.address}`;
    payBtn.disabled = false;
  } catch (e) {
    statusDiv.textContent = '로그인 실패: ' + e.message;
  }
};

payBtn.onclick = async () => {
  if (!userSession) {
    statusDiv.textContent = '먼저 로그인하세요.';
    return;
  }

  statusDiv.textContent = '결제 진행 중...';

  try {
    const paymentResult = await window.Pi.requestPayment({
      appName: 'Me2Verse',
      recipient: 'your-pi-wallet-address', // 실제 Pi 지갑 주소로 교체 필요
      amount: 1,
      memo: '테스트 결제',
      sandbox: true,
    });
    statusDiv.textContent = '결제 완료: ' + JSON.stringify(paymentResult);
  } catch (e) {
    statusDiv.textContent = '결제 실패: ' + e.message;
  }
};
