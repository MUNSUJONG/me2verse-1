// 환경 변수 설정
const PI_API_KEY = "fe44i3g5hkmmmyhj98rms4i5hl7nix7ks8nyysffacq5cz6sa6imeigltofkzkxi";
const PI_APP_NAME = "me2verse-1";
const SANDBOX_URL = "https://sandbox.minepi.com/app/me2verse-demo";
const FRONTEND_URL = "https://me2verse11.netlify.app";
const VERIFY_KEY = "me2verse-verify-20250813-xyz123456789";

// DOM 요소 가져오기
const loginBtn = document.getElementById('loginBtn');
const payBtn = document.getElementById('payBtn');
const statusDiv = document.getElementById('status');

let piUser = null; // 로그인한 사용자 정보 저장

// 상태 메시지를 업데이트하는 함수
function updateStatus(message, isError = false) {
    statusDiv.textContent = message;
    if (isError) {
        statusDiv.className = 'min-h-[4rem] p-4 mb-6 rounded-lg text-red-700 bg-red-100 font-medium text-center';
    } else {
        statusDiv.className = 'min-h-[4rem] p-4 mb-6 rounded-lg text-green-700 bg-green-100 font-medium text-center';
    }
}

// Pi SDK 초기화
window.onload = function() {
    try {
        Pi.init({
            appName: PI_APP_NAME,
            version: "2.0",
            api_key: PI_API_KEY,
        });
        console.log("Pi SDK가 성공적으로 초기화되었습니다.");
    } catch (error) {
        console.error("Pi SDK 초기화 오류:", error);
        updateStatus("REJECT: Pi SDK 초기화 실패", true);
    }
};

// 로그인 버튼 클릭 이벤트 핸들러
loginBtn.addEventListener('click', () => {
    Pi.authenticate([], onIncompletePaymentFound)
        .then(function(authResult) {
            piUser = authResult.user;
            updateStatus(`OK: 로그인 성공. 사용자: ${piUser.username}`);
            console.log("로그인 성공:", authResult);
            loginBtn.disabled = true;
            loginBtn.classList.add('opacity-50', 'cursor-not-allowed');
            payBtn.disabled = false;
            payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        })
        .catch(function(error) {
            updateStatus(`REJECT: 로그인 실패 (${error.message})`, true);
            console.error("로그인 실패:", error);
        });
});

// 결제 버튼 클릭 이벤트 핸들러
payBtn.addEventListener('click', () => {
    if (!piUser) {
        updateStatus("REJECT: 먼저 로그인해주세요.", true);
        return;
    }

    // 결제 요청 데이터
    const paymentData = {
        amount: 1, // 테스트 결제 금액
        memo: `결제 요청 - ${Date.now()}`,
        metadata: {
            orderId: `me2verse-${Date.now()}`,
            userId: piUser.uid
        }
    };

    // 결제 콜백 함수들
    const callbacks = {
        onReadyForServerApproval: function(paymentId) {
            // 이 콜백에서 결제 승인을 위한 백엔드 요청을 처리해야 합니다.
            // 실제 환경에서는 paymentId를 백엔드로 보내 결제를 승인받아야 합니다.
            console.log(`백엔드 결제 승인 요청 시작. paymentId: ${paymentId}`);

            // 아래 코드는 백엔드 로직을 시뮬레이션합니다.
            // VERIFY_KEY를 사용하여 요청을 검증하고, Pi API를 통해 결제를 승인해야 합니다.
            // 여기에선 VERIFY_KEY를 콘솔에 출력하는 것으로 대체합니다.
            console.log(`VERIFY_KEY: ${VERIFY_KEY}`);

            // 가상의 백엔드 응답을 위한 Promise
            const approvePayment = new Promise(resolve => setTimeout(() => {
                console.log("가상 백엔드: 결제를 승인합니다.");
                resolve();
            }, 500)); // 0.5초 후 승인 시뮬레이션

            approvePayment.then(() => {
                // Pi SDK에 서버에서 결제가 승인되었음을 알립니다.
                Pi.approvedPayment(paymentId);
            });
        },
        onReadyForServerCompletion: function(paymentId, txid) {
            // 서버에서 결제가 완료되었음을 알리는 콜백
            console.log(`결제 완료. paymentId: ${paymentId}, txid: ${txid}`);
            updateStatus(`OK: 결제 성공. 거래 ID: ${txid}`);
            // Pi SDK에 서버에서 결제가 완료되었음을 알립니다.
            Pi.completePayment(paymentId);
        },
        onCancel: function(paymentId) {
            // 사용자가 결제를 취소했을 때의 콜백
            console.log(`사용자에 의해 결제 취소됨. paymentId: ${paymentId}`);
            updateStatus("REJECT: 결제 취소됨", true);
        },
        onError: function(error, payment) {
            // 결제 처리 중 오류 발생 시의 콜백
            console.error("결제 오류 발생:", error, payment);
            updateStatus(`REJECT: 결제 오류 (${error.message})`, true);
        }
    };

    // 결제 생성
    Pi.createPayment(paymentData, callbacks);
});

// 미완료 결제(incomplete payment)가 발견되었을 때의 콜백
// 이 기능은 복잡하므로 간단히 로그만 남깁니다.
function onIncompletePaymentFound(payment) {
    console.warn("미완료된 결제 발견:", payment);
}

