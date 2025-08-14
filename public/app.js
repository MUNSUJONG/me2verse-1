const loginBtn = document.getElementById('pi-login');
const payBtn = document.getElementById('pi-pay');
const statusDiv = document.getElementById('status');

let user = null;

// Render 백엔드 URL (배포 후 실제 URL로 변경)
const BACKEND_URL = 'https://me2verse-1.onrender.com';

// Pi 로그인
loginBtn.addEventListener('click', async () => {
  try {
    user = await window.Pi.authenticate();
    statusDiv.innerText = `로그인 성공: ${user.username}`;
  } catch (err) {
    console.error('로그인 실패:', err);
    statusDiv.innerText = `로그인 실패: ${err.message || err}`;
  }
});

// Pi 결제
payBtn.addEventListener('click', async () => {
  if (!user) {
    statusDiv.innerText = '먼저 로그인해주세요.';
    return;
  }

  const amount = 0.1; // 테스트 금액
  const txid = `tx-${Date.now()}`;

  try {
    const res = await fetch(`${BACKEND_URL}/approve-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txid, amount })
    });

    if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
    
    const data = await res.json();
    statusDiv.innerText = data.success
      ? `결제 승인 완료: ${data.txid}`
      : '결제 실패';
  } catch (err) {
    console.error('결제 오류:', err);
    statusDiv.innerText = `결제 오류: ${err.message || err}`;
  }
});


