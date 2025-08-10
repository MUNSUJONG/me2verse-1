// frontend/app.js
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const payBtn = document.getElementById('payBtn');
  const statusEl = document.getElementById('status');
  const openSandboxBtn = document.getElementById('openSandboxBtn');

  // 백엔드 URL 자동 결정 (로컬 테스트 용과 배포용)
  // 배포 후: REPLACE_WITH_RENDER_URL 를 실제 Render URL로 바꿔주세요.
  const BACKEND_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:4000'
    : 'https://REPLACE_WITH_RENDER_URL'; // <-- 배포하면 여기 바꿔야 함

  function setStatus(text) {
    statusEl.textContent = `상태: ${text}`;
    console.log('[Me2Verse-1]', text);
  }

  // SDK 유무 체크
  const hasPi = (typeof Pi !== 'undefined');
  if (!hasPi) {
    setStatus('Pi SDK가 로드되지 않았습니다. Pi Browser 또는 Sandbox에서 열어주세요.');
    loginBtn.disabled = true;
    payBtn.disabled = true;
  } else {
    setStatus('Pi SDK가 로드됨. Pi.init이 선행되었는지 확인하세요.');
  }

  // 로그인 로직
  loginBtn.addEventListener('click', async () => {
    if (typeof Pi === 'undefined') {
      alert('Pi Browser에서 여세요.');
      return;
    }

    try {
      setStatus('로그인 요청 중... (Pi.authenticate 실행)');
      // scopes: 'username' (사용자정보), 'payments' (결제)
      const scopes = ['username', 'payments'];

      // onIncompletePaymentFound 콜백 (문서 권장)
      function onIncompletePaymentFound(payment) {
        console.warn('미완료 결제 발견:', payment);
        // 앱별 처리 로직을 넣어주세요 (서버에 notify 등)
        // 예: fetch(`${BACKEND_URL}/payments/complete`, {method:'POST', body: JSON.stringify({...})})
      }

      // authenticate는 Promise 반환
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      setStatus(`로그인 성공: ${auth.user?.username || auth.user?.uid || 'unknown'}`);
      loginBtn.disabled = true;
      payBtn.disabled = false;
      console.log('AUTH:', auth);
    } catch (err) {
      console.error('로그인 실패:', err);
      setStatus('로그인 실패: ' + (err?.message || String(err)));
    }
  });

  // 결제 로직 (Pi.createPayment — client-side)
  payBtn.addEventListener('click', async () => {
    if (typeof Pi === 'undefined') {
      alert('Pi Browser에서 여세요.');
      return;
    }

    // 결제 데이터
    const paymentData = {
      amount: 0.1, // Pi 단위
      memo: 'Me2Verse-1 테스트 결제',
      metadata: { productId: 'demo-001', note: '테스트' }
    };

    // 콜백들 정의
    const paymentCallbacks = {
      onReadyForServerApproval: async (paymentId) => {
        setStatus(`서버 승인 대기: paymentId=${paymentId}`);
        try {
          const res = await fetch(`${BACKEND_URL}/payments/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
          const json = await res.json();
          console.log('서버 승인 응답:', json);
          // SDK 쪽에서 다음 단계로 진행됨
        } catch (e) {
          console.error('서버 승인 호출 실패', e);
          setStatus('서버 승인 실패');
        }
      },

      onReadyForServerCompletion: async (paymentId, txid) => {
        setStatus(`서버 완료 처리: paymentId=${paymentId} txid=${txid}`);
        try {
          const res = await fetch(`${BACKEND_URL}/payments/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          });
          const json = await res.json();
          console.log('서버 완료 응답:', json);
          setStatus('결제 완료 처리 완료');
        } catch (e) {
          console.error('서버 완료 호출 실패', e);
          setStatus('서버 완료 실패');
        }
      },

      onCancel: (reason) => {
        console.warn('결제 취소:', reason);
        setStatus('결제 취소됨');
      },

      onError: (err) => {
        console.error('결제 에러:', err);
        setStatus('결제 중 에러 발생');
      }
    };

    try {
      setStatus('Pi.createPayment 호출 중...');
      const payment = await Pi.createPayment(paymentData, paymentCallbacks);
      console.log('Pi.createPayment 반환값:', payment);
      setStatus('결제 흐름이 시작되었습니다. Pi 브라우저의 결제 UI에서 사용자 확인을 기다립니다.');
    } catch (err) {
      console.error('createPayment 실패:', err);
      setStatus('createPayment 실패: ' + (err?.message || String(err)));
    }
  });

  // 샌드박스 열기(데스크탑 테스트 보조)
  openSandboxBtn.addEventListener('click', () => {
    // 사용자가 Dev Portal에 앱을 등록하고 development URL을 설정했다면
    // sandbox URL: https://sandbox.minepi.com/app/<your-app-slug>
    const slug = prompt('샌드박스 앱 slug를 입력하세요 (예: me2verse-1):', 'me2verse-1');
    if (!slug) return;
    const url = `https://sandbox.minepi.com/app/${encodeURIComponent(slug)}`;
    window.open(url, '_blank');
  });
});
