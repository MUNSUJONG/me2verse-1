const statusEl = document.getElementById('status');
const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');

// Pi SDK 초기화
function initPi() {
  try {
    Pi.init({ version: "2.0", sandbox: true });
    statusEl.innerText = "✅ Pi SDK 초기화 완료";
  } catch (err) {
    statusEl.innerText = "❌ Pi SDK 초기화 실패: " + err;
    console.error(err);
  }
}

// 로그인
async function login() {
  try {
    const scopes = ['username', 'payments'];
    const authData = await Pi.authenticate(scopes, onIncompletePaymentFound);
    statusEl.innerText = `로그인 성공: ${authData.user.username}`;
    payBtn.disabled = false;
  } catch (err) {
    statusEl.innerText = "로그인 실패: " + err;
    console.error(err);
  }
}

// 결제
async function pay() {
  try {
    const payment = await Pi.createPayment({
      amount: 1,
      memo: "Me2Verse Test Payment",
      metadata: { type: "test" }
    }, {
      onReadyForServerApproval: (paymentId) => {
        statusEl.innerText = `결제 생성됨: ${paymentId} (서버 승인 필요)`;
      },
      onReadyForServerCompletion: (paymentId) => {
        statusEl.innerText = `결제 승인됨: ${paymentId} (서버 완료 필요)`;
      },
      onCancel: (paymentId) => {
        statusEl.innerText = `결제 취소됨: ${paymentId}`;
      },
      onError: (error, paymentId) => {
        statusEl.innerText = `결제 오류: ${error}`;
        console.error(error);
      }
    });
  } catch (err) {
    statusEl.innerText = "결제 실패: " + err;
    console.error(err);
  }
}

// 미완료 결제 처리
function onIncompletePaymentFound(payment) {
  console.log("미완료 결제 발견:", payment);
}

// 버튼 이벤트
loginBtn.addEventListener('click', login);
payBtn.addEventListener('click', pay);

// SDK 로드 후 초기화 실행
window.addEventListener('load', initPi);
