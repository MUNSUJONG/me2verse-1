// Pi SDK 로드 시점까지 기다립니다.
window.onload = function() {
    const loginBtn = document.getElementById('loginBtn');
    const payBtn = document.getElementById('payBtn');
    const statusDiv = document.getElementById('status');
    let accessToken = null;

    // Pi SDK가 로드되었는지 확인합니다.
    if (window.Pi) {
        // Pi Network 로그인 버튼 클릭 이벤트
        loginBtn.addEventListener('click', () => {
            Pi.authenticate(['payments'], onAuthResult);
        });

        // Pi Network 결제 버튼 클릭 이벤트
        payBtn.addEventListener('click', () => {
            if (accessToken) {
                createPaymentOnBackend();
            } else {
                updateStatus('ERROR: 로그인 상태가 아닙니다.');
            }
        });
    } else {
        updateStatus('ERROR: Pi SDK가 로드되지 않았습니다.');
        loginBtn.disabled = true;
    }

    // 상태 메시지 업데이트 함수
    function updateStatus(message, isError = false) {
        statusDiv.textContent = message;
        if (isError) {
            statusDiv.className = 'bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium';
        } else if (message.includes('OK')) {
            statusDiv.className = 'bg-green-100 text-green-700 p-4 rounded-lg text-center font-medium';
        } else {
            statusDiv.className = 'bg-gray-100 text-gray-700 p-4 rounded-lg text-center font-medium';
        }
    }

    // Pi Network 로그인 성공 시 호출되는 콜백 함수
    function onAuthResult(authResult) {
        if (authResult.accessToken) {
            accessToken = authResult.accessToken;
            updateStatus('OK: Pi Network 로그인 성공', false);
            payBtn.disabled = false;
            payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            payBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
        } else {
            updateStatus('ERROR: 로그인 실패');
            payBtn.disabled = true;
        }
    }

    // 백엔드 서버에 결제 요청을 보내는 함수
    async function createPaymentOnBackend() {
        updateStatus('결제 요청 중...');
        try {
            // **여기 URL을 Render에 배포된 백엔드 URL로 변경하세요.**
            const response = await fetch('https://[Render-URL]/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    amount: 1.0,
                    memo: 'Test payment for me2verse-1 app'
                })
            });

            const result = await response.json();

            if (result.status === 'OK') {
                const paymentId = result.payment.identifier;
                updateStatus(`OK: 결제 ID 생성 성공 - ${paymentId}`);

                // 생성된 결제 ID로 Pi 결제 창을 띄웁니다.
                Pi.onIncompletePayment(paymentId, onPaymentComplete);
            } else {
                updateStatus(`ERROR: 백엔드 결제 생성 실패 - ${result.message}`, true);
            }

        } catch (error) {
            updateStatus(`ERROR: 백엔드 통신 실패 - ${error.message}`, true);
        }
    }

    // 결제 완료 시 호출되는 콜백 함수
    function onPaymentComplete(paymentId) {
        updateStatus(`OK: 결제 성공 - 결제 ID: ${paymentId}`);
    }
};
