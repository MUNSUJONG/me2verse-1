const statusEl = document.getElementById('status');
const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');

function initPi() {
  Pi.init({ version: "2.0", sandbox: true });
  statusEl.innerText = "✅ Pi SDK 초기화 완료";
}

async function login() {
  try {
    const scopes = ['username', 'payments'];
    const authData = await Pi.authenticate(scopes);
    statusEl.innerText = `로그인 성공: ${authData.user.username}`;
    payBtn.disabled = false;
  } catch (err) {
    statusEl.innerText = "로그인 실패: " + err;
    console.error(err);
  }
}

async function pay() {
  try {
    const payment = await Pi.createPayment({
      amount: 1,
      memo: "Me2Verse Test Payment",
      metadata: { type: "test" }
    }, {
      onReadyForServerApproval: (paymentId) => {
        statusEl.innerText = `결제 생성됨: ${paymentId} (서버 승인 필요)`;
        // 서버에 결제 승인 요청 (예시)
        fetch('http://localhost:4000/payment/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }),
        })
          .then(res => res.json())
          .then(data => {
            statusEl.innerText = `서버 승인 완료: ${paymentId}`;
            // 서버 완료 요청 추가 가능
          })
          .catch(err => {
            statusEl.innerText = '서버 승인 실패';
            console.error(err);
          });
      },
      onReadyForServerCompletion: (paymentId) => {
        statusEl.innerText = `결제 승인됨: ${paymentId} (서버 완료 필요)`;
        // 서버 완료 요청 예시 가능
      },
      onCancel: (paymentId) => {
        statusEl.innerText = `결제 취소됨: ${paymentId}`;
      },
      onError: (error, paymentId) => {
        statusEl.innerText = `결제 오류: ${error}`;
      }
    });
  } catch (err) {
    statusEl.innerText = "결제 실패: " + err;
    console.error(err);
  }
}

loginBtn.addEventListener('click', login);
payBtn.addEventListener('click', pay);
window.addEventListener('load', initPi);
