window.addEventListener('load', () => {
  const isSandbox = window.location.hostname === 'sandbox.minepi.com';

  Pi.init({ version: "2.0", sandbox: isSandbox });

  const status = document.getElementById('status');
  const loginBtn = document.getElementById('loginBtn');
  const payBtn = document.getElementById('payBtn');

  status.innerText = `✅ SDK 초기화 완료 (${isSandbox ? '샌드박스' : '프로덕션'})`;

  let currentUser = null;

  setTimeout(() => {
    loginBtn.disabled = false;

    loginBtn.addEventListener('click', async () => {
      status.innerText = '로그인 시도 중...';
      try {
        const auth = await Pi.authenticate(['username']);
        currentUser = auth.user;
        status.innerText = `🎉 로그인 성공: ${currentUser.username}`;
        loginBtn.disabled = true;
        payBtn.disabled = false;
      } catch (e) {
        status.innerText = `❌ 로그인 실패: ${e.message}`;
        console.error(e);
      }
    });

    payBtn.addEventListener('click', async () => {
      if (!currentUser) {
        status.innerText = '⚠️ 먼저 로그인하세요!';
        return;
      }

      status.innerText = '💳 결제 생성 중...';

      try {
        const response = await fetch('/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 1,
            memo: 'Me2Verse 샌드박스 결제',
            metadata: { user: currentUser.username }
          })
        });

        const data = await response.json();

        if (data.id) {
          status.innerText = '⏳ 결제 승인 대기 중...';

          const approveRes = await fetch('/payment/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: data.id })
          });

          const approveData = await approveRes.json();

          if (approveData.status === 'APPROVED') {
            status.innerText = '✅ 결제 완료 성공!';
            payBtn.disabled = true;
          } else {
            status.innerText = '⚠️ 결제 승인 실패 또는 대기 중.';
          }
        } else {
          status.innerText = '❌ 결제 생성 실패';
        }
      } catch (err) {
        status.innerText = '❌ 결제 처리 중 오류 발생';
        console.error(err);
      }
    });
  }, 300);
});
