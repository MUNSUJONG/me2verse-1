const BACKEND_URL = 'http://localhost:4000'; // 실제 백엔드 API 주소로 변경하세요.

window.addEventListener('load', () => {
  const isSandbox = window.location.hostname === 'sandbox.minepi.com';
  Pi.init({ version: "2.0", sandbox: isSandbox });

  const loginBtn = document.getElementById('loginBtn');
  const payBtn = document.getElementById('payBtn');
  const status = document.getElementById('status');

  status.innerText = `✅ SDK 초기화 완료 (${isSandbox ? '샌드박스' : '프로덕션'})`;

  loginBtn.disabled = false;

  let currentAuth = null;

  loginBtn.addEventListener('click', async () => {
    status.innerText = '로그인 시도 중...';
    loginBtn.disabled = true;

    try {
      const auth = await Pi.authenticate(['username']);
      currentAuth = auth;
      status.innerText = `로그인 성공: ${auth.user.username}`;

      // 결제 버튼 보이고 활성화
      payBtn.style.display = 'inline-block';
      payBtn.disabled = false;

    } catch (e) {
      status.innerText = `로그인 실패: ${e.message}`;
      loginBtn.disabled = false;
    }
  });

  payBtn.addEventListener('click', async () => {
    if (!currentAuth) {
      status.innerText = '먼저 로그인하세요.';
      return;
    }

    payBtn.disabled = true;
    status.innerText = '결제 생성 중...';

    try {
      // 결제 생성 API 호출
      const createResp = await fetch(`${BACKEND_URL}/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1,
          memo: 'Me2Verse-1 테스트 결제',
          metadata: { user: currentAuth.user.username }
        }),
      });
      const createData = await createResp.json();
      if (!createResp.ok) throw new Error(createData.error || '결제 생성 실패');

      const paymentId = createData.id;
      status.innerText = '결제 승인 중...';

      // 결제 승인 API 호출
      const approveResp = await fetch(`${BACKEND_URL}/payment/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });
      const approveData = await approveResp.json();
      if (!approveResp.ok) throw new Error(approveData.error || '결제 승인 실패');

      status.innerText = '✅ 결제 완료! 감사합니다.';
    } catch (e) {
      status.innerText = `오류 발생: ${e.message}`;
      payBtn.disabled = false;
    }
  });
});
