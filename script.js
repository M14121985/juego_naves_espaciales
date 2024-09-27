const gameContainer = document.getElementById('gameContainer');
const ship = document.getElementById('ship');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const pauseMenu = document.getElementById('pauseMenu');

const shipSpeed = 5;
let shipX = window.innerWidth / 2;
let shipY = window.innerHeight - 100;
let shipDX = 0;
let shipDY = 0;
let score = 0;
let lives = 10;
let isPaused = false;

const bullets = [];
const missiles = [];
const enemies = [];
const enemySpeed = 2;
const bulletSpeed = 7;
const missileSpeed = 5;

function moveShip() {
    shipX += shipDX;
    shipY += shipDY;
    if (shipX < 0) shipX = 0;
    if (shipX + 50 > window.innerWidth) shipX = window.innerWidth - 50;
    if (shipY < 0) shipY = 0;
    if (shipY + 50 > window.innerHeight) shipY = window.innerHeight - 50;
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
}

function createBullet() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${shipX + 22.5}px`;
    bullet.style.top = `${shipY}px`;
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
}

function createMissile() {
    const missile = document.createElement('div');
    missile.className = 'missile';
    missile.style.left = `${shipX + 20}px`;
    missile.style.top = `${shipY}px`;
    gameContainer.appendChild(missile);
    missiles.push(missile);
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        const bulletY = parseInt(bullet.style.top);
        bullet.style.top = `${bulletY - bulletSpeed}px`;
        if (bulletY < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });
}

function moveMissiles() {
    missiles.forEach((missile, index) => {
        const missileY = parseInt(missile.style.top);
        missile.style.top = `${missileY - missileSpeed}px`;
        if (missileY < 0) {
            missile.remove();
            missiles.splice(index, 1);
        }
    });
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    enemy.style.top = `0px`;
    gameContainer.appendChild(enemy);
    enemies.push(enemy);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const enemyY = parseInt(enemy.style.top);
        enemy.style.top = `${enemyY + enemySpeed}px`;
        if (enemyY > window.innerHeight) {
            enemy.remove();
            enemies.splice(index, 1);
        }
    });
}

function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameContainer.appendChild(explosion);
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();
            if (
                bulletRect.left < enemyRect.right &&
                bulletRect.right > enemyRect.left &&
                bulletRect.top < enemyRect.bottom &&
                bulletRect.bottom > enemyRect.top
            ) {
                bullet.remove();
                bullets.splice(bIndex, 1);
                enemy.remove();
                enemies.splice(eIndex, 1);
                createExplosion(enemyRect.left, enemyRect.top);
                score += 10;
                scoreDisplay.textContent = `Puntuación: ${score}`;
            }
        });
    });

    missiles.forEach((missile, mIndex) => {
        enemies.forEach((enemy, eIndex) => {
            const missileRect = missile.getBoundingClientRect();
            const enemyRect = enemy.getBoundingClientRect();
            if (
                missileRect.left < enemyRect.right &&
                missileRect.right > enemyRect.left &&
                missileRect.top < enemyRect.bottom &&
                missileRect.bottom > enemyRect.top
            ) {
                missile.remove();
                missiles.splice(mIndex, 1);
                enemy.remove();
                enemies.splice(eIndex, 1);
                createExplosion(enemyRect.left, enemyRect.top);
                score += 20;
                scoreDisplay.textContent = `Puntuación: ${score}`;
            }
        });
    });

    enemies.forEach((enemy, eIndex) => {
        const enemyRect = enemy.getBoundingClientRect();
        const shipRect = ship.getBoundingClientRect();
        if (
            enemyRect.left < shipRect.right &&
            enemyRect.right > shipRect.left &&
            enemyRect.top < shipRect.bottom &&
            enemyRect.bottom > shipRect.top
        ) {
            enemy.remove();
            enemies.splice(eIndex, 1);
            createExplosion(shipRect.left, shipRect.top);
            lives -= 1;
            livesDisplay.textContent = `Vidas: ${lives}`;
            if (lives <= 0) {
                alert('¡Juego terminado!');
                resetGame();
            }
        }
    });
}

function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight}px`;
        gameContainer.appendChild(star);
    }
}

function update() {
    if (!isPaused) {
        moveShip();
        moveBullets();
        moveMissiles();
        moveEnemies();
        checkCollisions();
    }
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight') shipDX = shipSpeed;
    if (e.key === 'ArrowLeft') shipDX = -shipSpeed;
    if (e.key === 'ArrowUp') shipDY = -shipSpeed;
    if (e.key === 'ArrowDown') shipDY = shipSpeed;
    if (e.key === ' ') createBullet();
    if (e.key === 'm') createMissile();
    if (e.key === 'p') togglePause();
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') shipDX = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') shipDY = 0;
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseMenu.classList.remove('hidden');
    } else {
        pauseMenu.classList.add('hidden');
    }
}

function resumeGame() {
    isPaused = false;
    pauseMenu.classList.add('hidden');
}

function resetGame() {
    score = 0;
    lives = 10;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    livesDisplay.textContent = `Vidas: ${lives}`;
    bullets.forEach(bullet => bullet.remove());
    missiles.forEach(missile => missile.remove());
    enemies.forEach(enemy => enemy.remove());
    bullets.length = 0;
    missiles.length = 0;
    enemies.length = 0;
    shipX = window.innerWidth / 2;
    shipY = window.innerHeight - 100;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

createStars();
setInterval(createEnemy, 1000);
update();
