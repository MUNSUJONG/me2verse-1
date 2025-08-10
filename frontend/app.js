const statusEl = document.getElementById('status');
const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');

let pi;

loginBtn.onclick = async () => {
  try {
    pi = new Pi();

    statusEl.textContent = '로그인 중... Pi 브라우저에서 실행하세요.';
    await pi.login();

    const user = pi.getUser();
    statusEl.textContent = `로그인 성공! User ID: ${user.uid}`;

    payBtn.disabled = false;
  } catch (err) {
    statusEl.textContent = `로그인 실패: ${err.message}`;
  }
};

payBtn.onclick = async () => {
  if (!pi) {
    statusEl.textContent = '먼저 로그인하세요.';
    return;
  }

  statusEl.textContent = '결제 생성 요청 중...';

  try {
    // 결제 생성 API 호출 (백엔드 서버 URL로 바꾸세요)
    const res = await fetch('http://localhost:4000/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 0.1,
        memo: 'Me2Verse-1 테스트 결제',
        metadata: { userId: pi.getUser().uid }
      })
    });
    const data = await res.json();

    if (data.paymentId) {
      statusEl.textContent = `결제 생성 성공! Payment ID: ${data.paymentId}\n승인 대기 중...`;

      // 결제 승인 요청
      const approveRes = await fetch('http://localhost:4000/payment/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: data.paymentId })
      });
      const approveData = await approveRes.json();

      if (approveData.status === 'approved') {
        statusEl.textContent += '\n결제 승인 완료! 완료 처리 중...';

        // 결제 완료 요청
        const completeRes = await fetch('http://localhost:4000/payment/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: data.paymentId })
        });
        const completeData = await completeRes.json();

        if (completeData.status === 'completed') {
          statusEl.textContent += '\n결제 완료 성공! 감사합니다.';
        } else {
          statusEl.textContent += '\n결제 완료 처리 실패.';
        }
      } else {
        statusEl.textContent += '\n결제 승인 실패.';
      }
    } else {
      statusEl.textContent = '결제 생성 실패.';
    }
  } catch (err) {
    statusEl.textContent = `오류 발생: ${err.message}`;
  }
};
