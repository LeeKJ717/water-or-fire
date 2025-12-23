let counts = { fire: 0, water: 0 };

function getCounts() {
  return counts;
}

function increment(type) {
  if (type !== "fire" && type !== "water") {
    throw new Error("Invalid type");
  }
  counts[type] += 1;
  return counts;
}

module.exports = {
  getCounts,
  increment,
};


