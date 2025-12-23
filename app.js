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

// Vercel 정적 배포에서는 서버(API)가 없으므로
// 브라우저 localStorage에만 저장하는 로컬 모드로 동작하게 변경
const STORAGE_KEY = "water-or-fire-counts";

function loadLocalCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { fire: 0, water: 0 };
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.fire === "number" &&
      typeof parsed.water === "number"
    ) {
      return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return { fire: 0, water: 0 };
}

function saveLocalCounts(counts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch (e) {
    console.error(e);
  }
}

let counts = loadLocalCounts();

function renderCounts() {
  fireCountEl.textContent = counts.fire;
  waterCountEl.textContent = counts.water;
}

function increment(type) {
  if (type !== "fire" && type !== "water") return;
  counts[type] += 1;
  saveLocalCounts(counts);
  renderCounts();
}

function setupButtonHandlers() {
  fireBtn.addEventListener("click", () => increment("fire"));
  waterBtn.addEventListener("click", () => increment("water"));
}

window.addEventListener("load", () => {
  setStatus("로컬 모드로 실행 중입니다. 이 브라우저에서만 카운트가 저장돼요.", "ok");
  renderCounts();
  setupButtonHandlers();
});

