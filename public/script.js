// script.js - me2verse-1 프로젝트용
window.onload = function() {
    const loginBtn = document.getElementById('loginBtn');
    const payBtn = document.getElementById('payBtn');
    const statusDiv = document.getElementById('status');
    let accessToken = null;

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

    // Pi SDK 로드 확인 및 로그인/결제 이벤트 바인딩
    function initPiSDK() {
        if (!window.Pi) {
            updateStatus('ERROR: Pi SDK가 로드되지 않았습니다.', true);
            loginBtn.disabled = true;
            payBtn.disabled = true;
            return;
        }

        loginBtn.addEventListener('click', () => {
            updateStatus('로그인 중...');
            Pi.authenticate(['payments'], onAuthResult);
        });

        payBtn.addEventListener('click', () => {
            if (!accessToken) {
                updateStatus('ERROR: 로그인 후 이용 가능합니다.', true);
                return;
            }
            createPaymentOnBackend();
        });
    }

    // 로그인 성공 콜백
    function onAuthResult(authResult) {
        if (authResult.accessToken) {
            accessToken = authResult.accessToken;
            updateStatus('OK: Pi Network 로그인 성공');
            payBtn.disabled = false;
            payBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            payBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
        } else {
            updateStatus('ERROR: 로그인 실패', true);
            payBtn.disabled = true;
        }
    }

    // 결제 요청 백엔드 호출
    async function createPaymentOnBackend() {
        updateStatus('결제 요청 중...');
        try {
            const backendUrl = 'https://me2verse-backend.onrender.com/create-payment'; // Render 배포 URL
            const response = await fetch(backendUrl, {
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

            console.log('백엔드 응답:', response);

            if (!response.ok) {
                updateStatus(`ERROR: 서버 응답 실패 - ${response.statusText}`, true);
                return;
            }

            const result = await response.json();
            console.log('결과:', result);

            if (result.status === 'OK') {
                const paymentId = result.payment.identifier;
                updateStatus(`OK: 결제 ID 생성 성공 - ${paymentId}`);

                // Pi SDK 결제 완료 후 콜백
                Pi.onIncompletePayment(paymentId, (completedPaymentId) => {
                    updateStatus(`OK: 결제 성공 - 결제 ID: ${completedPaymentId}`);
                });
            } else {
                updateStatus(`ERROR: 백엔드 결제 생성 실패 - ${result.message}`, true);
            }

        } catch (error) {
            console.error(error);
            updateStatus(`ERROR: 백엔드 통신 실패 - ${error.message}`, true);
        }
    }

    // Pi SDK ready 시점에 초기화
    if (window.Pi) {
        Pi.ready().then(() => {
            initPiSDK();
            updateStatus('Pi SDK 로드 완료');
        }).catch(() => {
            updateStatus('ERROR: Pi SDK 초기화 실패', true);
        });
    } else {
        updateStatus('ERROR: Pi SDK가 로드되지 않았습니다.', true);
        loginBtn.disabled = true;
        payBtn.disabled = true;
    }
};
