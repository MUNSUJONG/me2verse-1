import React, { useState, useEffect } from 'react';

// Tailwind CSS를 사용하여 스타일링합니다.
// Pi SDK는 Pi Browser에 내장되어 있으므로 별도의 import가 필요 없습니다.

const App = () => {
  const [user, setUser] = useState(null);
  const [statusLogs, setStatusLogs] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPiAvailable, setIsPiAvailable] = useState(false);

  // 상태 로그 추가 함수
  const addLog = (message, isError = false) => {
    setStatusLogs(prev => {
      const time = new Date().toLocaleTimeString();
      const formatted = isError ? `[오류] ${time} - ${message}` : `${time} - ${message}`;
      return [...prev, formatted];
    });
  };

  // Pi SDK 초기화
  useEffect(() => {
    addLog('Pi SDK 초기화를 준비 중입니다...');
    if (typeof window.Pi === 'undefined') {
      addLog('Pi SDK가 로드되지 않았습니다. Pi Browser에서 실행 중인지 확인하세요.', true);
      return;
    }
    setIsPiAvailable(true);

    let env = 'Production';
    if (window.location.hostname === 'sandbox.minepi.com' || window.location.hostname.includes('sandbox')) {
      env = 'Sandbox';
    }
    addLog(`현재 감지된 환경: ${env}`);

    try {
      window.Pi.init({
        onIncompletePaymentFound: (payment) => {
          addLog(`미완료 결제 발견: ${payment.identifier}`);
        }
      }, {
        environment: env
      });
      setIsInitialized(true);
      addLog('Pi SDK가 성공적으로 초기화되었습니다. 이제 로그인할 수 있습니다.');
    } catch (err) {
      addLog(`Pi SDK 초기화 실패: ${err.message}`, true);
    }
  }, []);

  // 로그인 처리
  const handleLogin = async () => {
    if (!isPiAvailable || !isInitialized) {
      addLog('Pi SDK가 준비되지 않았습니다. 잠시만 기다려주세요.', true);
      return;
    }
    addLog('로그인 요청 중...');
    try {
      const auth = await window.Pi.authenticate(['username', 'payments']);
      setUser(auth.user);
      addLog(`로그인 성공! 사용자 ID: ${auth.user.uid}, 사용자명: ${auth.user.username}`);
    } catch (err) {
      addLog(`로그인 실패: ${err.message}`, true);
    }
  };

  // 테스트 결제 처리
  const handlePayment = async () => {
    if (!user) {
      addLog('결제 전에 먼저 로그인해주세요.', true);
      return;
    }
    addLog('테스트 결제 요청 중...');
    try {
      const paymentData = {
        amount: 1,
        memo: 'me2verse-1 테스트 결제',
        metadata: { app: 'me2verse-1', type: 'test_payment' }
      };

      await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          addLog(`서버 승인 대기중... 결제 ID: ${paymentId}`);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          addLog(`결제 완료! 결제 ID: ${paymentId}, TXID: ${txid}`);
        },
        onCancel: (paymentId) => {
          addLog(`사용자가 결제를 취소했습니다. 결제 ID: ${paymentId}`);
        },
        onError: (error) => {
          addLog(`결제 실패: ${error.message}`, true);
        }
      });
    } catch (err) {
      addLog(`테스트 결제 실패: ${err.message}`, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pi Network 로그인 & 결제 테스트</h1>
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={!isInitialized || user}
            className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            {user ? `로그인 완료: ${user.username}` : 'Pi 로그인'}
          </button>
          <button
            onClick={handlePayment}
            disabled={!user}
            className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
          >
            테스트 Pi 결제
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-200 rounded-lg text-left text-sm text-gray-700 h-64 overflow-y-auto">
          <h2 className="font-bold mb-2">상태 로그:</h2>
          <div className="space-y-1">
            {statusLogs.map((log, i) => (
              <p key={i} className="break-words font-mono text-xs leading-tight">{log}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
