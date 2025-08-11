// public/app.js — Me2Verse-1 로그인 & 테스트 결제 (Pi SDK)
(function(){
  // Pi SDK가 브라우저에 로드되어 있어야 함
  if (typeof Pi === "undefined") {
    document.getElementById('status').innerText = '상태: Pi SDK 로드 실패 (Pi 브라우저에서 열어주세요)';
    return;
  }

  // 샌드박스 판단 (샌드박스에서 테스트시 true)
  const isSandbox = window.location.hostname.includes('sandbox.minepi.com') || window.location.hostname.includes('localhost');
  Pi.init({ version: "2.0", sandbox: isSandbox });

  const loginBtn = document.getElementById('loginBtn');
  const payBtn = document.getElementById('payBtn');
  const statusEl = document.getElementById('status');

  function setStatus(msg){
    statusEl.innerText = '상태: ' + msg;
    console.log('[Me2Verse-1]', msg);
  }

  let currentUser = null;

  // 초기 상태
  setStatus(`SDK 초기화 완료 (${isSandbox ? '샌드박스' : '프로덕션'})`);
  loginBtn.disabled = false;
  payBtn.disabled = true;

  // 미완료 결제 발견 콜백
  function onIncompletePaymentFound(payment){
    console.warn('미완료 결제:', payment);
    setStatus('미완료 결제 발견');
  }

  // 로그인
  loginBtn.addEventListener('click', async () => {
    setStatus('로그인 시도 중...');
    loginBtn.disabled = true;
    try {
      const scopes = ['username', 'payments'];
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      // auth.user 있는지 안전 체크
      currentUser = auth && auth.user ? auth.user : null;
      if (currentUser && currentUser.username) {
        setStatus(`로그인 성공: ${currentUser.username}`);
        payBtn.disabled = false;
      } else {
        setStatus('로그인 성공(사용자 정보 없음)');
        payBtn.disabled = false;
      }
    } catch (err) {
      console.error('로그인 에러', err);
      setStatus('로그인 실패: ' + (err && err.message ? err.message : String(err)));
      loginBtn.disabled = false;
    }
  });

  // 테스트 결제 — 클라이언트 사이드 createPayment 흐름
  payBtn.addEventListener('click', async () => {
    if (!currentUser) {
      setStatus('먼저 로그인하세요');
      return;
    }

    setStatus('결제 시작...');
    payBtn.disabled = true;

    try {
      const paymentData = {
        amount: 0.001, // 테스트 금액 (Pi)
        memo: 'Me2Verse-1 테스트 결제',
        metadata: { user: currentUser.username || 'unknown' }
      };

      const payment = await Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          setStatus('서버 승인 대기: ' + paymentId);
          // 실제 서버 승인 연동이 있으면 여기서 fetch 호출
          // fetch('/payment/approve', { method:'POST', ... })
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          setStatus('결제 승인됨: ' + paymentId);
          // 서버 완료 호출 가능
        },
        onCancel: (paymentId) => {
          setStatus('결제 취소됨');
          payBtn.disabled = false;
        },
        onError: (err) => {
          console.error('createPayment error', err);
          setStatus('결제 에러: ' + (err?.message || err));
          payBtn.disabled = false;
        }
      });

      console.log('createPayment 반환:', payment);
      setStatus('결제 흐름 시작 (Pi UI 확인)');
    } catch (err) {
      console.error('결제 시작 실패', err);
      setStatus('결제 실패: ' + (err?.message || err));
      payBtn.disabled = false;
    }
  });

})();
