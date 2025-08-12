import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';  // Tailwind CSS가 적용된 CSS 파일 (설치되어 있어야 함)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
