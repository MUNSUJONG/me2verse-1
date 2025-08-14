let user = null;
let isInitialized = false;
let isPiAvailable = false;

const statusLog = document.getElementById('statusLog');
const loginBtn = document.getElementById('loginBtn');
const paymentBtn = document.getElementById('paymentBtn');

function setStatus(message) {
  statusLog.textContent = message;
}

window.addEventListener('load', () => {
  if (!window.Pi) {
    setStatus('Pi SDK가 로드되지 않았습니다. Pi Browser에서 실행 중인지 확인하세요.');
    return;
  }
  isPiAvailable = true;

  let environment = location.hostname.includes('sandbox.minepi.com') ? 'Sandbox' : 'Production';
  setStatus(`환경: ${environment} - Pi SDK 초기화 중...`);

  try {
    window.Pi.init(
      {
        onIncompletePaymentFound: (payment) => {
          setStatus(`미완료 결제 발견: ${payment.identifier}`);
        }
      },
      { environment }
    );
    isInitialized = true;
    setStatus('Pi SDK 초기화 완료. 로그인 해주세요.');
  } catch (error) {
    setStatus(`Pi SDK 초기화 실패: ${error.message}`);
  }
});

loginBtn.addEventListener('click', async () => {
  if (!isPiAvailable || !isInitialized) {
    setStatus('Pi SDK가 준비되지 않았습니다. 잠시 기다려주세요.');
    return;
  }
  setStatus('로그인 요청 중...');
  try {
    const authResult = await window.Pi.authenticate(['username', 'payments']);
    user = authResult.user;
    setStatus(`로그인 성공! UID: ${user.uid}`);
    paymentBtn.disabled = false;
    loginBtn.textContent = '로그인 완료';
    loginBtn.disabled = true;
  } catch (error) {
    setStatus(`로그인 실패: ${error.message}`);
  }
});

paymentBtn.addEventListener('click', async () => {
  if (!user) {
    setStatus('먼저 로그인해주세요.');
    return;
  }
  setStatus('테스트 결제 요청 중...');
  try {
    const paymentData = {
      amount: 1,
      memo: 'Me2verse-1 테스트 결제',
      metadata: { app: 'Me2verse-1', type: 'test_payment' }
    };

    await window.Pi.createPayment(paymentData, {
      onReadyForServerApproval: async (paymentId) => {
        setStatus(`승인 대기중... ID: ${paymentId}`);
        await fetch('/approve-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        setStatus(`결제 완료 요청중... ID: ${paymentId}, TXID: ${txid}`);
        await fetch('/complete-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid })
        });
        setStatus(`결제 완료! 결제 ID: ${paymentId}, TXID: ${txid}`);
      },
      onCancel: (paymentId) => setStatus(`결제 취소됨. ID: ${paymentId}`),
      onError: (error) => setStatus(`결제 실패: ${error.message}`)
    });
  } catch (error) {
    setStatus(`결제 실패: ${error.message}`);
  }
});
