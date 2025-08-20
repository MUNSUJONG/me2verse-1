// app.js (퍼블릭 안 모듈 기준)

import { renderHobby } from "./me2hobby.js";
import { renderCulture } from "./me2culture.js";
import { renderLove } from "./me2love.js";

const root = document.getElementById("root");

// 초기 화면: 미투하비
renderHobby(root);

// 네비게이션 버튼 이벤트
document.getElementById("btnHobby").addEventListener("click", () => renderHobby(root));
document.getElementById("btnCulture").addEventListener("click", () => renderCulture(root));
document.getElementById("btnLove").addEventListener("click", () => renderLove(root));
