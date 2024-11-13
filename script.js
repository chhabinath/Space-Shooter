// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const reloadButton = document.getElementById('reloadButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const shootButton = document.getElementById('shootButton');

canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth - 20;
canvas.height = window.innerHeight > 800 ? 800 : window.innerHeight - 100;

let player, enemies, score, gameOver;

// Initialize game state
function initializeGame() {
  player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    bullets: []
  };

  enemies = [];
  score = 0;
  gameOver = false;
}

// Draw the player
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
  ctx.fillStyle = 'yellow';
  player.bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.y -= bullet.speed;
  });
  player.bullets = player.bullets.filter(bullet => bullet.y > 0);
}

// Draw enemies
function drawEnemies() {
  ctx.fillStyle = 'red';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemy.speed;
  });
  enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

// Check collisions
function checkCollisions() {
  player.bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        player.bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
      }
    });
  });

  enemies.forEach(enemy => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameOver = true;
      endGame();
    }
  });
}

// Player movement and shooting
function movePlayer() {
  if (player.movingLeft && player.x > 0) player.x -= player.speed;
  if (player.movingRight && player.x + player.width < canvas.width) player.x += player.speed;
}

function shoot() {
  player.bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 5,
    height: 10,
    speed: 10
  });
}

// Spawn enemies
function spawnEnemies() {
  if (!gameOver) {
    const enemy = {
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 3
    };
    enemies.push(enemy);
  }
}

// Start game
function startGame() {
  startButton.style.display = 'none';
  canvas.style.display = 'block';
  reloadButton.style.display = 'none';
  document.querySelector('.controls').style.display = 'flex';
  
  initializeGame();
  update();
  setInterval(spawnEnemies, 1000);
}

// End game
function endGame() {
  reloadButton.style.display = 'block';
  document.querySelector('.controls').style.display = 'none';
}

// Reload game
function reloadGame() {
  initializeGame();
  reloadButton.style.display = 'none';
  update();
}

// Update game state
function update() {
  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  movePlayer();
  checkCollisions();

  ctx.fillStyle = 'white';
  ctx.font = '24px sans-serif';
  ctx.fillText('Score: ' + score, 10, 30);

  requestAnimationFrame(update);
}

// Touch controls
leftButton.addEventListener('touchstart', () => player.movingLeft = true);
leftButton.addEventListener('touchend', () => player.movingLeft = false);
rightButton.addEventListener('touchstart', () => player.movingRight = true);
rightButton.addEventListener('touchend', () => player.movingRight = false);
shootButton.addEventListener('touchstart', shoot);
