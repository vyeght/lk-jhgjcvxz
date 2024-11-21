const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const finalScoreDisplay = document.getElementById("final-score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let gameRunning = false;

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.innerText = score;
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
  } else {
    snake.pop();
  }

  // Check for wall collision or self collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
  update();
  draw();
}

function changeDirection(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
}

function startGame() {
  gameRunning = true;
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  direction = { x: 0, y: 0 };
  score = 0;
  scoreDisplay.innerText = score;
  gameInterval = setInterval(gameLoop, 100);
  gameOverScreen.style.display = "none";
  document.addEventListener("keydown", changeDirection);
}

function endGame() {
  clearInterval(gameInterval);
  gameRunning = false;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.innerText = highScore;
    localStorage.setItem("highScore", highScore);
  }
  finalScoreDisplay.innerText = score;
  gameOverScreen.style.display = "block";
}

function restartGame() {
  startGame();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

document.addEventListener("keydown", event => {
  if (!gameRunning) return; // Prevents input if the game is over
  changeDirection(event);
});
