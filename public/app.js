const loginBtn = document.getElementById('loginBtn');
const loginStatus = document.getElementById('loginStatus');
const payBtn = document.getElementById('payBtn');
const payStatus = document.getElementById('payStatus');

let user = null;

async function piLogin() {
  try {
    loginStatus.textContent = '로그인 중...';
    user = await window.Pi.authenticate({ 
      // sandbox: true // 실제 배포 시 false 또는 삭제하세요
      sandbox: true // 테스트 환경 설정
    });
    if (user) {
      loginStatus.textContent = `로그인 성공: ${user.username}`;
      payBtn.disabled = false;
    } else {
      loginStatus.textContent = '로그인 실패';
      payBtn.disabled = true;
    }
  } catch (err) {
    loginStatus.textContent = '로그인 오류: ' + err.message;
    payBtn.disabled = true;
  }
}

async function piPay() {
  try {
    payStatus.textContent = '결제 요청 중...';
    const tx = await window.Pi.requestPayment({
      amount: 1, // 1 π
      currency: 'PI',
      memo: 'Me2Verse 테스트 결제',
      // sandbox: true // 테스트 환경 필수
      sandbox: true
    });
    if (tx) {
      payStatus.textContent = `결제 성공! 트랜잭션 ID: ${tx.transactionId}`;
    } else {
      payStatus.textContent = '결제 실패 또는 취소됨';
    }
  } catch (err) {
    payStatus.textContent = '결제 오류: ' + err.message;
  }
}

loginBtn.addEventListener('click', piLogin);
payBtn.addEventListener('click', piPay);
