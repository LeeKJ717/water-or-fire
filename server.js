const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // index.html, app.js, style.css 서빙

// counts를 파일에 저장해서 서버가 꺼져도 유지되게 함
const DATA_FILE = path.join(__dirname, "counts.json");

function loadCounts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.fire === "number" &&
      typeof parsed.water === "number"
    ) {
      return parsed;
    }
  } catch (e) {
    // 파일 없거나 깨졌으면 기본값 사용
  }
  return { fire: 0, water: 0 };
}

function saveCounts(counts) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(counts, null, 2), "utf8");
}

let counts = loadCounts();

// 현재 카운트 가져오기
app.get("/api/counts", (req, res) => {
  res.json(counts);
});

// 카운트 +1 (type: "fire" | "water")
app.post("/api/increment", (req, res) => {
  const { type } = req.body;
  if (type !== "fire" && type !== "water") {
    return res.status(400).json({ error: "Invalid type" });
  }
  counts[type] += 1;
  saveCounts(counts);
  res.json(counts);
});

app.listen(PORT, () => {
  console.log(`WATER OR FIRE 서버 실행 중: http://localhost:${PORT}`);
});



