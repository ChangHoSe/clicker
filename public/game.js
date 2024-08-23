let gameState = {
  clicks: 0,
  autoClickers: 0,
  clickPowerLevel: 0,
  autoClickerLevel: 0,
  rebirths: 0,
  rebirthCost: 1e6, // 1,000,000 clicks
};

const BASE_CLICK_COST = 10;
const BASE_AUTO_COST = 50;
const COST_EXPONENT = 1.15;
const POWER_EXPONENT = 1.1;
const REBIRTH_EXPONENT = 1.5;

function gameLoop() {
  gameState.clicks += calculateAutoClickerPower();
  updateDisplay();
}

function handleClick() {
  gameState.clicks += calculateClickPower();
  updateDisplay();
}

function calculateClickPower() {
  return Math.floor(
    (1 + gameState.clickPowerLevel) * // 기본 1에 레벨을 더함
      Math.pow(POWER_EXPONENT, gameState.clickPowerLevel) *
      (1 + gameState.rebirths * 0.1)
  );
}

function calculateAutoClickerPower() {
  return Math.floor(
    gameState.autoClickers * // 자동 클리커의 수
      (1 + gameState.autoClickerLevel) * // 레벨에 따른 증가
      Math.pow(POWER_EXPONENT, gameState.autoClickerLevel) *
      (1 + gameState.rebirths * 0.1)
  );
}

function getUpgradeCost(baseCost, level) {
  return Math.floor(baseCost * Math.pow(COST_EXPONENT, level));
}

function buyUpgrade(type) {
  let cost, level;
  if (type === "clickPower") {
    cost = getUpgradeCost(BASE_CLICK_COST, gameState.clickPowerLevel);
    level = gameState.clickPowerLevel;
  } else if (type === "autoClicker") {
    cost = getUpgradeCost(BASE_AUTO_COST, gameState.autoClickerLevel);
    level = gameState.autoClickerLevel;
  }

  if (gameState.clicks >= cost) {
    gameState.clicks -= cost;
    if (type === "clickPower") {
      gameState.clickPowerLevel++;
    } else if (type === "autoClicker") {
      gameState.autoClickerLevel++;
      gameState.autoClickers++; // 자동 클리커 개수 증가
    }
    showMessage(`${type} upgraded! New level: ${level + 1}`);
  } else {
    showMessage("Not enough clicks!");
  }
  updateDisplay();
}

function rebirth() {
  if (gameState.clicks >= gameState.rebirthCost) {
    gameState.rebirths++;
    gameState.clicks = 0;
    gameState.clickPower = 1;
    gameState.autoClickers = 0;
    gameState.clickPowerLevel = 0;
    gameState.autoClickerLevel = 0;
    gameState.rebirthCost = Math.floor(
      1e6 * Math.pow(REBIRTH_EXPONENT, gameState.rebirths)
    );
    showMessage(`Reborn! You are now on rebirth level ${gameState.rebirths}`);
  } else {
    showMessage(
      `Not enough clicks! You need ${gameState.rebirthCost} clicks to rebirth.`
    );
  }
  updateDisplay();
}

function updateDisplay() {
  document.getElementById("clicks").textContent = Math.floor(gameState.clicks);
  document.getElementById("clickPower").textContent =
    calculateClickPower().toFixed(1); // 소수점 첫째 자리까지 표시
  document.getElementById("autoClickers").textContent =
    calculateAutoClickerPower().toFixed(1); // 소수점 첫째 자리까지 표시
  document.getElementById(
    "upgradeClickPower"
  ).textContent = `Upgrade Click (${getUpgradeCost(
    BASE_CLICK_COST,
    gameState.clickPowerLevel
  )})`;
  document.getElementById(
    "buyAutoClicker"
  ).textContent = `Upgrade Auto (${getUpgradeCost(
    BASE_AUTO_COST,
    gameState.autoClickerLevel
  )})`;
  document.getElementById("rebirths").textContent = gameState.rebirths;
  document.getElementById("rebirthCost").textContent = gameState.rebirthCost;
}

function showMessage(message) {
  const popupElement = document.getElementById("popup-message");
  popupElement.textContent = message;
  popupElement.classList.add("show");
  setTimeout(() => {
    popupElement.classList.remove("show");
  }, 2000); // 2초 후 메시지 숨김
}

function initGame() {
  document.getElementById("clickButton").addEventListener("click", handleClick);
  document
    .getElementById("upgradeClickPower")
    .addEventListener("click", () => buyUpgrade("clickPower"));
  document
    .getElementById("buyAutoClicker")
    .addEventListener("click", () => buyUpgrade("autoClicker"));
  document.getElementById("rebirthButton").addEventListener("click", rebirth);
  document.getElementById("saveButton").addEventListener("click", saveGame);
  document.getElementById("loadButton").addEventListener("click", loadGame);
  setInterval(gameLoop, 1000);
  loadGame();
  updateDisplay();
}

// showMessage, loadGame, saveGame 함수는 이전과 동일

// 게임 시작
initGame();
