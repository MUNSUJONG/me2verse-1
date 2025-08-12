import React, { useState, useEffect } from 'react';

// Tailwind CSS를 사용하여 스타일링합니다.
// Pi SDK는 Pi Browser에 내장되어 있으므로 별도의 import가 필요 없습니다.

const App = () => {
  // 상태 변수 정의
  const [user, setUser] = useState(null);
  const [statusLogs, setStatusLogs] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 상태 로그에 메시지를 추가하는 헬퍼 함수
  const addLog = (message, isError = false) => {
    setStatusLogs(prevLogs => {
      const newLog = `${new Date().toLocaleTimeString()} - ${message}`;
      if (isError) {
        return [...prevLogs, `[오류] ${newLog}`];
      }
      return [...prevLogs, newLog];
    });
  };

  // Pi SDK 초기화를 위한 useEffect 훅
  useEffect(() => {
    addLog('Pi SDK 초기화를 준비 중입니다...');
    
    // Pi SDK가 Pi 브라우저에 존재하는지 확인
    if (typeof window.Pi === 'undefined') {
      addLog('Pi SDK가 로드되지 않았습니다. Pi Browser에서 실행 중인지 확인하세요.', true);
      return;
    }

    // 현재 URL의 호스트 이름을 기반으로 환경을 결정합니다.
    const hostname = window.location.hostname;
    let environment = 'Production';
    if (hostname.includes('sandbox.minepi.com') || hostname.includes('sandbox')) {
      environment = 'Sandbox';
    }
    addLog(`현재 감지된 환경: ${environment}`);

    try {
      window.Pi.init({
        onIncompletePaymentFound: (payment) => {
          // 미완료 결제를 처리하는 로직을 여기에 추가할 수 있습니다.
          addLog(`미완료 결제 발견: ${payment.identifier}`);
        }
      }, {
        environment: environment
      });
      setIsInitialized(true);
      addLog('Pi SDK가 성공적으로 초기화되었습니다. 이제 로그인할 수 있습니다.');
    } catch (error) {
      addLog(`Pi SDK 초기화 실패: ${error.message}`, true);
    }
  }, []);

  // Pi 로그인 함수
  const handleLogin = async () => {
    if (!isInitialized) {
      addLog('Pi SDK가 준비되지 않았습니다. 잠시만 기다려주세요.', true);
      return;
    }
    addLog('로그인 요청 중...');
    try {
      // 'username'과 'payments' 권한을 요청합니다.
      const authResult = await window.Pi.authenticate(['username', 'payments']);
      setUser(authResult.user);
      addLog(`로그인 성공! 사용자 ID: ${authResult.user.uid}, 사용자명: ${authResult.user.username}`);
    } catch (error) {
      addLog(`로그인 실패: ${error.message}`, true);
    }
  };

  // Pi 테스트 결제 함수
  const handlePayment = async () => {
    if (!user) {
      addLog('결제 전에 먼저 로그인해주세요.', true);
      return;
    }
    addLog('테스트 결제 요청 중...');
    
    // window.Pi.createPayment가 정의되어 있는지 다시 확인합니다.
    if (typeof window.Pi.createPayment === 'undefined') {
      addLog("'createPayment' 함수가 존재하지 않습니다. Pi 브라우저의 버전 문제일 수 있습니다.", true);
      return;
    }

    try {
      const paymentData = {
        amount: 1, // 테스트 금액
        memo: 'Me2vers-1 테스트 결제',
        metadata: { app: 'Me2vers-1', type: 'test_payment' }
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
        onError: (error, payment) => {
          addLog(`결제 실패: ${error.message}`, true);
        }
      });
    } catch (error) {
      addLog(`테스트 결제 실패: ${error.message}`, true);
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
            {statusLogs.map((log, index) => (
              <p key={index} className="break-words font-mono text-xs leading-tight">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
          
