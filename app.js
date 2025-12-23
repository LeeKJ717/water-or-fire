const statusEl = document.getElementById("status");
const fireCountEl = document.getElementById("fire-count");
const waterCountEl = document.getElementById("water-count");
const fireBtn = document.getElementById("fire-btn");
const waterBtn = document.getElementById("water-btn");

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.classList.remove("ok", "error");
  if (type) statusEl.classList.add(type);
}

// 공유 서버(API)를 사용하는 모드
const API_BASE = ""; // same origin

async function fetchCounts() {
  try {
    const res = await fetch(`${API_BASE}/api/counts`);
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    fireCountEl.textContent = data.fire ?? 0;
    waterCountEl.textContent = data.water ?? 0;
    setStatus("공유 서버 연결 완료! 여러 기기에서 함께 눌러보세요 🔥💧", "ok");
  } catch (e) {
    console.error(e);
    setStatus(
      "서버에 연결할 수 없어요. 잠시 후 다시 시도하거나 새로고침 해보세요.",
      "error"
    );
  }
}

async function increment(type) {
  try {
    const res = await fetch(`${API_BASE}/api/increment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    fireCountEl.textContent = data.fire ?? 0;
    waterCountEl.textContent = data.water ?? 0;
  } catch (e) {
    console.error(e);
    setStatus(
      "증가 요청 실패: 잠시 후 다시 시도하거나 새로고침 해보세요.",
      "error"
    );
  }
}

function setupButtonHandlers() {
  fireBtn.addEventListener("click", () => increment("fire"));
  waterBtn.addEventListener("click", () => increment("water"));
}

window.addEventListener("load", () => {
  setStatus("공유 서버에 연결 시도 중...", "ok");
  setupButtonHandlers();
  fetchCounts();
  // 여러 기기 간 동기화를 위해 주기적으로 값 재요청 (1.5초마다)
  setInterval(fetchCounts, 1500);
});

