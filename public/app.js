import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 기존에 meverse8856.pinet.com으로 되어 있던 API 호출도 상대경로로 수정
const API_BASE = "/api"; // me2verse-1.netlify.app 기준 경로

// 예시 fetch
async function fetchData() {
  try {
    const response = await fetch(`${API_BASE}/data`);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("데이터 로드 실패", err);
  }
}

fetchData();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
