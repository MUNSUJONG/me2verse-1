import React, { useState, useEffect } from 'react';
// import './style.css'; // Assuming you have a global style.css file

// Pi SDK는 index.html에서 로드되므로, 별도로 import하지 않습니다.
// 대신, window.Pi 객체를 통해 접근합니다.

// Me2Verse-1의 핵심 기능을 담당하는 메인 컴포넌트입니다.
export default function App() {
  // Pi 네트워크 SDK의 준비 상태를 관리하는 상태 변수
  const [isPiReady, setIsPiReady] = useState(false);
  // 사용자 로그인 상태를 관리하는 상태 변수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 현재 로그인한 사용자의 정보를 저장하는 상태 변수
  const [piUser, setPiUser] = useState(null);
  // 사용자에게 표시할 메시지(로그)를 관리하는 상태 변수
  const [statusMessage, setStatusMessage] = useState('앱이 로드되었습니다. Pi 네트워크 연결을 기다리는 중...');

  // 컴포넌트가 처음 렌더링될 때 Pi SDK를 초기화하는 useEffect 훅입니다.
  useEffect(() => {
    // Pi SDK가 window 객체에 존재하는지 확인
    if (window.Pi) {
      try {
        // Pi SDK 초기화
        // appName은 "me2verse-1"로 설정
        window.Pi.init({ 
          version: "2.0", 
          appName: "me2verse-1",
          onReady: () => {
            setIsPiReady(true);
            setStatusMessage('✅ Pi SDK가 성공적으로 초기화되었습니다.');
          }
        });
      } catch (error) {
        setStatusMessage(`❌ Pi SDK 초기화 중 오류가 발생했습니다: ${error.message}`);
        console.error("Pi SDK initialization error:", error);
      }
    } else {
      setStatusMessage('⚠️ Pi SDK를 찾을 수 없습니다. Pi 브라우저에서 실행 중인지 확인해 주세요.');
    }
  }, []);

  // 로그인 버튼 클릭 이벤트 핸들러
  const handleLogin = async () => {
    setStatusMessage('로그인 요청 중...');
    try {
      // Pi.authenticate를 호출하여 사용자 인증을 요청합니다.
      // 필요한 스코프는 'username'과 'payments'입니다.
      const authData = await window.Pi.authenticate(['username', 'payments']);
      
      setIsLoggedIn(true);
      setPiUser(authData.user);
      setStatusMessage(`✅ 로그인 성공! 사용자: ${authData.user.username}`);
    } catch (error) {
      setStatusMessage(`❌ 로그인 실패: ${error.message}`);
      console.error("Login error:", error);
    }
  };

  // 결제 버튼 클릭 이벤트 핸들러
  const handlePayment = async () => {
    setStatusMessage('테스트 결제 요청 중...');
    try {
      // 결제 정보 객체
      const paymentData = {
        amount: 1, // 테스트 결제 금액
        memo: "Me2Verse-1 테스트 결제", // 결제 메모
        metadata: { 
          app: "me2verse-1", 
          item: "test_item_01" 
        }
      };

      // Pi.payments.createPayment를 호출하여 결제 생성
      const payment = await window.Pi.payments.createPayment(paymentData);
      
      setStatusMessage('✅ 결제 생성 성공! 서버 승인 대기 중...');

      // TODO: 여기서 Render 백엔드 서버로 결제 승인 요청을 보냅니다.
      // const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://me2verse-backend.onrender.com';
      // const response = await fetch(`${backendUrl}/payment/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentIdentifier: payment.identifier })
      // });
      // const approvalResult = await response.json();
      
      // if (approvalResult.success) {
      //   setStatusMessage(`✅ 결제 승인 완료! 결제 ID: ${payment.identifier}`);
      // } else {
      //   setStatusMessage(`❌ 결제 승인 실패: ${approvalResult.message}`);
      // }

      // TODO: 위 백엔드 로직을 활성화하고 실제 서버와 연동하세요.
      // 현재는 프론트엔드에서 결제 생성까지만 처리합니다.
      setStatusMessage(`✅ 결제 생성 완료! (서버 승인 로직은 주석 처리됨)`);
      console.log("Payment created:", payment);

    } catch (error) {
      setStatusMessage(`❌ 결제 실패: ${error.message}`);
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-teal-400">Me2Verse-1</h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Pi 네트워크 기반 메타버스 플랫폼
        </p>

        {/* 사용자 대시보드 (로그인 시 표시) */}
        {isLoggedIn && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6 text-center shadow-inner">
            <h2 className="text-xl font-semibold text-emerald-400">환영합니다, {piUser.username}님!</h2>
            <p className="text-gray-300 mt-2">ID: {piUser.uid}</p>
          </div>
        )}

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={isLoggedIn || !isPiReady}
          className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 mb-4 ${
            isLoggedIn ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {isLoggedIn ? '이미 로그인되었습니다' : '파이 계정으로 로그인'}
        </button>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={!isLoggedIn || !isPiReady}
          className={`w-full font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 mb-6 ${
            !isLoggedIn ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          테스트 결제 (1 Pi)
        </button>

        {/* 로그 메시지 출력 영역 */}
        <div className="bg-gray-700 p-4 rounded-lg mt-6 overflow-auto text-sm max-h-40">
          <h2 className="text-xl font-semibold mb-2">상태 로그</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
}
