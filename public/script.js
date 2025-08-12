import { initializePi, requestPiPayment } from '../src/utils/pi-sdk.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const paymentButton = document.getElementById('payment-button');
    const statusBox = document.getElementById('status-box');

    const updateStatus = (message, isError = false) => {
        const p = document.createElement('p');
        p.textContent = message;
        if (isError) {
            p.style.color = 'red';
        }
        statusBox.appendChild(p);
        statusBox.scrollTop = statusBox.scrollHeight;
    };

    loginButton.addEventListener('click', async () => {
        updateStatus('로그인 요청 중...');
        try {
            const user = await initializePi();
            updateStatus('로그인 성공!');
            updateStatus(`- 사용자 ID: ${user.uid}`);
            updateStatus(`- 사용자 이름: ${user.username}`);
            paymentButton.disabled = false;
        } catch (error) {
            updateStatus(`로그인 실패: ${error.message}`, true);
        }
    });

    paymentButton.addEventListener('click', async () => {
        updateStatus('테스트 결제 요청 중...');
        try {
            const paymentResult = await requestPiPayment();
            updateStatus('테스트 결제 성공!');
            updateStatus(`- 결제 ID: ${paymentResult.identifier}`);
        } catch (error) {
            updateStatus(`테스트 결제 실패: ${error.message}`, true);
        }
    });
});
