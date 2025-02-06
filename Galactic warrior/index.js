import EnemyHandler1 from "./EnemyHandler.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import Description from "./Description.js";
import Sound from "./Sound.js";
import Costumization from "./Costumization.js";
import GiftController from "./GiftController.js";
import Gift2Controller from "./Gift2Controller.js";
import MeteorController from "./MeteorController.js";
import EnemyHandler2 from "./EnemyHandler2.js";
import EnemyHandler3 from "./EnemyHandler3.js";
import EnemyHandler4 from "./EnemyHandler4.js";
import EnemyHandler5 from "./EnemyHandler5.js";
import Highscore from "./HighScore.js";

const canvas = document.getElementById("menu");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;

// menu háttere
const background = new Image();
background.src = "images/background/space.png";
background.onload = menu;

// játék háttere különválasztva
const gameBackground = new Image();
gameBackground.src = "images/background/space.png";

const logoImage = new Image();
logoImage.src = "images/ikon/welcomeIcon.png";
logoImage.onload = menu;

let rubin = 100;
let soundMenuActive = false; // figyeli, hogy a sound menu megvan-e nyitva
let costumizationMenuActive = false;
let highscoreMenuActive = false;

const description = new Description(canvas, ctx, background, menu);
const sound = new Sound(canvas, ctx, background, menu, soundMenuActive);
const costumization = new Costumization(canvas, ctx, menu, rubin, costumizationMenuActive);
const highscore = new Highscore(canvas, ctx, background, menu, highscoreMenuActive);

const enemyBulletController = new BulletController(canvas, 5, "red", true);
const playerBulletController = new BulletController(canvas, 12, "white", true);
const bossBulletController = new BulletController(canvas, 5, "red", true);
const giftController = new GiftController(canvas, 1);
const gift2Controller = new Gift2Controller(canvas, 1);
const meteorController = new MeteorController(canvas, 2, true);
const player = new Player(canvas, 3, playerBulletController);
const enemyHandler1 = new EnemyHandler1(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, true);
const enemyHandler2 = new EnemyHandler2(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, true);
const enemyHandler3 = new EnemyHandler3(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, true);
const enemyHandler4 = new EnemyHandler4(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, true);
const enemyHandler5 = new EnemyHandler5(canvas, enemyBulletController, playerBulletController, bossBulletController, giftController, gift2Controller, meteorController, true);


let isGameOver = false;
let didwin = false;
let life = 3;
let seconds = 0;
let isStartButtonActive = false;
let collisionCooldown = 0; // megakadályozza az újabb ütközések érzékelését (70fps = 1mp)

let gameSound = new Audio("sounds/battleTheme.mp3");
gameSound.volume = 0.3;
gameSound.loop = true;

let bossSound = new Audio("sounds/bossSound.wav");
bossSound.volume = 0.4;
bossSound.loop = true;

function increaseRubin(amount) {
    rubin += amount;
    costumization.updateRubin(rubin);
}


function drawLevelField(x, y, width, height, radius, playX, playY, level, challenge) {
    // sárga kocka
    ctx.strokeStyle = "#FFFF00"; // yellow
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.stroke();

    // play gomb
    const buttonWidth = 50;
    const buttonHeight = 30;
    
    ctx.fillStyle = "#39ff14";
    ctx.fillRect(playX, playY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = "black";
    ctx.font = "20px sans-serif";
    ctx.fillText("Play", playX + 25, playY + 20);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Level:" + level, x + 70, y + 30);
    ctx.font = "16px sans-serif";
    ctx.fillText("Challenge: " + challenge, x + 75, y + 50);
    let rubinAmount = 25 + (level * 25);
    ctx.fillText("+" + rubinAmount, x + 60, y + 72);

    level = level % 5;
    if(level == 0){
        level = 5;
    }

    const rubinImage = new Image();
    rubinImage.src = `images/ikon/rubyPic.png`;

    rubinImage.onload = () => {
        ctx.drawImage(rubinImage, x + 80, y + 55, 24, 24);
    };

    const enemyImage = new Image();
    enemyImage.src = `images/enemy/enemy${level}.png`;

    enemyImage.onload = () => {
        ctx.drawImage(enemyImage, x + 150, y, 120, 66);
    };

}


function drawGames() {
    const imagePlay = new Image();
    imagePlay.src = "images/ikon/play.png";

    imagePlay.onload = () => {
        ctx.drawImage(imagePlay, 580, 300, 50, 50);
    };

    ctx.fillStyle = "Yellow";
    ctx.fillText("Levels:", 690, 45);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2; 
    ctx.strokeRect(625, 10, 360, 580);

    const buttonBack = new Image();
    buttonBack.src = "images/ikon/back.png";

    buttonBack.onload = () => {
        ctx.drawImage(buttonBack, 930, 15, 40, 40);
    };

    drawLevelField(630, 60, 350, 90, 10, 920, 80, 1, "Easy"); // + 105 px (y, playY)
    drawLevelField(630, 165, 350, 90, 10, 920, 185, 2, "Normal");
    drawLevelField(630, 270, 350, 90, 10, 920, 290, 3, "Normal");
    drawLevelField(630, 375, 350, 90, 10, 920, 395, 4, "Hard");
    drawLevelField(630, 480, 350, 90, 10, 920, 500, 5, "Extreme");

    canvas.addEventListener('click', clickHandler);

    function clickHandler(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.x - rect.left;
        const y = event.y - rect.top;

        if (x >= 920 && x <= 970 && y >= 80 && y <= 110) {
            stopAnimation();
            let level = 1;
            startGame(level);
            if (isGameOver) {
                restartGame(level);
            }
        }
        if (x >= 920 && x <= 970 && y >= 185 && y <= 215) {
            stopAnimation();
            let level = 2;
            startGame(level);
            if (isGameOver) {
                restartGame(level);
            }
        }
        if (x >= 920 && x <= 970 && y >= 290 && y <= 320) {
            stopAnimation();
            let level = 3;
            startGame(level);
            if (isGameOver) {
                restartGame(level);
            }
        }
        if (x >= 920 && x <= 970 && y >= 395 && y <= 425) {
            stopAnimation();
            let level = 4;
            startGame(level);
            if (isGameOver) {
                restartGame(level);
            }
        }
        if (x >= 920 && x <= 970 && y >= 500 && y <= 530) {
            stopAnimation();
            let level = 5;
            startGame(level);
            if (isGameOver) {
                restartGame(level);
            }
        }
        if(x >= 910 && x <= 980 && y >= 15 && y <= 55){
            // vissza
            stopAnimation();
            isStartButtonActive = false;
        }
    }

// Mozgási animáció
const enemyImages = [];
const enemyWidths = [60, 60, 60, 60, 60];
const enemyHeights = [33, 33, 33, 33, 33];
const enemySources = [
    "images/enemy/enemy1.png",
    "images/enemy/enemy2.png",
    "images/enemy/enemy3.png",
    "images/enemy/enemy4.png",
    "images/enemy/enemy5.png"
];

for (let i = 0; i < enemySources.length; i++) {
    const img = new Image();
    img.src = enemySources[i];
    enemyImages.push(img);
}

let angles = [0, 0, 0, 0];
let angles1 = [60, 60, 60, 60];
let angles2 = [120, 120, 120, 120];
let angles3 = [180, 180, 180, 180];
let angles4 = [240, 240, 240, 240];
let angles5 = [300, 300, 300, 300];

const angularSpeeds = [0.3, 0.3, 0.3, 0.3];
const orbitRadius = [40, 70, 100, 130];
const xPos = 160;
const yPos = 300;
const scale = 1;
let rotationAngle = 0;

const background = new Image();
background.src = "images/background/space.png";
let backgroundLoaded = false;

background.onload = () => {
    backgroundLoaded = true;
};

function drawBackground(x, y, width, height) {
    if (backgroundLoaded) {
        ctx.drawImage(background, x, y, width, height);
    }
}

function drawEnemySet(angles) {
    for (let i = 0; i < enemyImages.length - 1; i++) {
        const enemyX = xPos + orbitRadius[i] * Math.cos(angles[i] * Math.PI / 180) - enemyWidths[i + 1] / 2;
        const enemyY = yPos + orbitRadius[i] * Math.sin(angles[i] * Math.PI / 180) - enemyHeights[i + 1] / 2;
        ctx.drawImage(
            enemyImages[i + 1],
            enemyX,
            enemyY,
            enemyWidths[i + 1] * scale,
            enemyHeights[i + 1] * scale
        );
        angles[i] += angularSpeeds[i];
    }
}

function drawRotatingEnemy() {
    const centerX = xPos;
    const centerY = yPos;
    const img = enemyImages[0];

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle * Math.PI / 180);
    ctx.drawImage(img, -enemyWidths[0] / 2, -enemyHeights[0] / 2, enemyWidths[0] * scale, enemyHeights[0] * scale);
    ctx.restore();

    rotationAngle += 0.3;
}

function drawEnemies() {
    drawBackground(0, 0, 320, 600);
    drawRotatingEnemy();
    drawEnemySet(angles);
    drawEnemySet(angles1);
    drawEnemySet(angles2);
    drawEnemySet(angles3);
    drawEnemySet(angles4);
    drawEnemySet(angles5);
}

// Player animáció
const playerImage = new Image();
playerImage.src = "images/player/player1.png";
let playerX = 10;
let playerY = 500;
let playerSpeed = 1;
let playerDirection = 1;
let waveAmplitude = 10;  // hullámzás magassága (wave)
let waveFrequency = 0.05;  // hullámzás frekvenciája (wave)

function drawPlayer() {
    if (playerImage.complete) {
        // hullámzó mozgás
        playerY = 500 + waveAmplitude * Math.sin(playerX * waveFrequency);

        ctx.drawImage(playerImage, playerX, playerY, 50, 50);
        playerX += playerSpeed * playerDirection;

        if (playerX >= 250 || playerX <= 10) {
            playerDirection *= -1;
        }
    }
}

    let animationFrameId;

    function frame() {
        drawEnemies();
        drawPlayer();
        animationFrameId = requestAnimationFrame(frame);
    }

    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    // Start animation
    frame();
}


function makeButton(text, xPos, yPos, width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(xPos, yPos, width, height);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2; 
    ctx.strokeRect(xPos, yPos, width, height);

    ctx.fillStyle = "#39ff14";
    ctx.font = "30px sans-serif";
    ctx.fillText(text, xPos + 125 , yPos + height / 2 + 10);
}


function drawMenuButtons() {
    makeButton("Start Game", canvas.width/3, 300, 255, 50);
    makeButton("Highscore", canvas.width/3, 350, 255, 50);
    makeButton("Description", canvas.width/3, 400, 255, 50);
    makeButton("Sound", canvas.width/3, 450, 255, 50);
    makeButton("Customization", canvas.width/3, 500, 255, 50);
}


const buttons = [
    { text: "Start Game", x: canvas.width / 3, y: 300, width: 255, height: 50 },
    { text: "Highscore", x: canvas.width / 3, y: 350, width: 255, height: 50 },
    { text: "Description", x: canvas.width / 3, y: 400, width: 255, height: 50 },
    { text: "Sound", x: canvas.width / 3, y: 450, width: 255, height: 50 },
    { text: "Customization", x: canvas.width / 3, y: 500, width: 255, height: 50 },
];

function menu() {
    if (!background.complete || !logoImage.complete) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width/3 - logoImage.width/2, canvas.height/4 - logoImage.height/2 - 100, 350, 300);

    ctx.font = "30px sans-serif";
    ctx.fillStyle = "#39FF14";
    ctx.textAlign = "center";


const clickHandler = (event) => {
    if (isStartButtonActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 300 && y <= 350) {
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        drawGames();
        isStartButtonActive = true;
    }
    else if (x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 350 && y <= 400) {
        highscore.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
    else if(x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 400 && y <= 450){
        description.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
    else if(x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 450 && y <= 500){
        sound.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
    else if(x >= canvas.width/3 && x <= canvas.width/3 + 255 && y >= 500 && y <= 550){
        costumization.draw();
        canvas.removeEventListener('mousemove', mouseMoveHandler);
    }
};

const mouseMoveHandler = (event) => {
    if (isStartButtonActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(logoImage, canvas.width / 3 - logoImage.width / 2, canvas.height / 4 - logoImage.height / 2 - 100, 350, 300);

    for (const button of buttons) {
        if (x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height) {
            ctx.fillStyle = "rgba(57, 255, 20, 0.8)"; // neon green
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.strokeRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "#000000"; // black
            ctx.font = "30px sans-serif";
            ctx.fillText(button.text, button.x + 125, button.y + button.height / 2 + 10);
        } else {
            makeButton(button.text, button.x, button.y, button.width, button.height);
        }
    }
};

canvas.addEventListener('mousemove', mouseMoveHandler);
canvas.addEventListener('click', clickHandler);

drawMenuButtons();
}

///////////////////// THE GAME //////////////////////////////////////
const heartImage = new Image();
heartImage.src = "images/ikon/redHeart.png";

const scoreImage = new Image();
scoreImage.src = "images/ikon/score.png";

const timerImage = new Image();
timerImage.src = "images/ikon/timer.png";

let animationFrameId = null;
let gameRunning = [false, false, false, false, false];
let previousTime = 0;
let fps = 70;
let interval = 1000 / fps;


function startGame(level) {
    stopAllMusic();
    gameBackground.src = costumization.field;
    previousTime = performance.now(); // kezdeti idő beállítása
    gameRunning[level - 1] = true;
    requestAnimationFrame(currentTime => gameLoop(currentTime, level));
}

function gameLoop(currentTime, level) {
    if (!gameRunning[level - 1]) return;

    let delta = currentTime - previousTime;

    if (delta > interval) {
        previousTime = currentTime - (delta % interval);

        switch (level) {
            case 1: // level 1
                gameHandler(1, enemyHandler1);
                break;
            case 2:
                gameHandler(2, enemyHandler2);
                break;
            case 3:
                gameHandler(3, enemyHandler3);
                break;
            case 4:
                gameHandler(4, enemyHandler4);
                break;
            case 5:
                gameHandler(5, enemyHandler5);
                break;
        }
    }

    animationFrameId = requestAnimationFrame(currentTime => gameLoop(currentTime, level));
}


function gameHandler(level, enemyHandler) {
    let soundToUse = gameSound;

    // Boss fight esetén más zene
    if (level === 5) {
        soundToUse = bossSound;
    }

    checkGameOver(level);
    collideWithObject();
    ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);
    displayGameOver(level);

    if (!isGameOver) {
        if (enemyHandler.soundEnabled) {
            if (soundToUse.paused) {
                soundToUse.play();
            }
        } else {
            if (!soundToUse.paused) {
                soundToUse.pause();
            }
        }

        settings(level);

        ctx.fillStyle = "yellow";
        ctx.font = "20px sans-serif";
        ctx.fillText("Score: " + enemyHandler.score, 125, 23);
        if (scoreImage.complete) {
            ctx.drawImage(scoreImage, 185, 2, 25, 25);
        }

        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText("Time: " + updateTime(), canvas.width / 2, 23);
        if (timerImage.complete) {
            ctx.drawImage(timerImage, canvas.width / 2 + 60, 2, 25, 25);
        }

        ctx.fillStyle = "red";
        ctx.font = "20px sans-serif";
        ctx.fillText("Life: " + life, canvas.width - 125, 23);
        if (heartImage.complete) {
            ctx.drawImage(heartImage, canvas.width - 95, 2, 25, 25);
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                event.preventDefault();
            }
        });
    } else {
        gameRunning[level - 1] = false;
        soundToUse.pause();
    }
}

function displayGameOver(level) {
    if (isGameOver) {
        let text = didwin ? "You win" : "Game Over";
        let addScore = life * 50; // megmaradt életet hozzáadjuk a pontszámhoz

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";

        const enemyHandler = getEnemyHandler(level);
        if (enemyHandler) {
            enemyHandler.score += addScore;
            ctx.fillText("Total Score: " + enemyHandler.score, canvas.width / 2, 380);
            
            let levelComplete = didwin ? true : false;
            highscore.setHighscore(level, enemyHandler.score, levelComplete);
          
            const rubinBonus = level * 25 + 25;
            if (levelComplete) {
                increaseRubin(rubinBonus);
            }
        }

        drawButtonBack();

        ctx.fillStyle = "#39ff14";
        ctx.font = "100px Arial";
        ctx.fillText(text, canvas.width / 2, 250);

        ctx.fillStyle = "#39ff14";
        ctx.font = "25px Arial";
        ctx.fillText("(+ " + Math.max(addScore, 0) + " point added from remaining life)", canvas.width / 2, 340);
        ctx.fillText("Time: " + updateTime(), canvas.width / 2, 420);

        ctx.fillStyle = "#39ff14";
        ctx.font = "30px Arial";
        ctx.fillText("Press [R] to restart game", canvas.width / 2, 510);
        ctx.fillText("Press [Esc] or click [back] to return to menu", canvas.width / 2, 550);

        // Gomb lenyomás figyelő
        const keyDownHandler = function(event) {
            if (event.key === "Escape") {
                isStartButtonActive = false;
                removeListeners();
                menu();
            } else if (event.key === "r") {
                removeListeners();
                restartGame(level);
            }
        };

        // Kattintás figyelő
        const clickHandler = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (x >= 910 && x <= 974 && y >= 10 && y <= 74) {
                isStartButtonActive = false;
                menu();
            }
        };

        document.addEventListener("keydown", keyDownHandler);
        canvas.addEventListener('click', clickHandler);

        function removeListeners() {
            document.removeEventListener("keydown", keyDownHandler);
            canvas.removeEventListener("click", clickHandler);
        }
    }
}

// Minden beállítás amit a felhasználó választ más menüpontokból
function settings(level) {
    player.image.src = costumization.selectedPlayer;
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
    bossBulletController.draw(ctx);
    giftController.draw(ctx);
    gift2Controller.draw(ctx);
    meteorController.draw(ctx);

    const enemyHandler = getEnemyHandler(level);

    if (enemyHandler) {
        enemyHandler.draw(ctx);
        enemyHandler.soundEnabled = sound.soundOn;
        enemyHandler.enemyDeathSound.volume = (sound.volume / 100);
    }

    // hangerő beállítása
    playerBulletController.soundEnabled = sound.soundOn;
    enemyBulletController.soundEnabled = sound.soundOn;
    bossBulletController.soundEnabled = sound.soundOn;
    meteorController.soundEnabled = sound.soundOn;

    playerBulletController.shootSound.volume = (sound.volume / 100);
    enemyBulletController.shootSound.volume = (sound.volume / 100);
    bossBulletController.shootSound.volume = (sound.volume / 100);
    meteorController.meteorBoom.volume = (sound.volume / 100);

    // Lövedék színének beállítása
    playerBulletController.bulletColor = costumization.playerBulletColor;
    enemyBulletController.bulletColor = costumization.enemyBulletColor;
    bossBulletController.bulletColor = costumization.enemyBulletColor;
}

function restartGame(level) {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null; // animáció ID nullázása
    }

    gameRunning = [false, false, false, false, false];
    seconds = 0;
    isGameOver = false;
    didwin = false;
    life = 3;
    player.x = canvas.width / 2;
    player.y = canvas.height - 75;

    enemyBulletController.clearBullets();
    playerBulletController.clearBullets();
    bossBulletController.clearBullets();
    giftController.clearGifts();
    gift2Controller.clearGifts();
    meteorController.clearMeteors();

    const enemyHandler = getEnemyHandler(level);
    if (enemyHandler) {
        enemyHandler.score = 0;
        enemyHandler.createEnemies();
        enemyHandler.resetGame();

        if (enemyHandler.soundEnabled) {
            gameSound.currentTime = 0;
        }

        if (level === 5) {
            bossSound.currentTime = 0;
        }

        startGame(level);
    }
}

function getEnemyHandler(level) {
    switch (level) {
        case 1:
            return enemyHandler1;
        case 2:
            return enemyHandler2;
        case 3:
            return enemyHandler3;
        case 4:
            return enemyHandler4;
        case 5:
            return enemyHandler5;
    }
}

function checkGameOver(level) {
    const enemyHandler = getEnemyHandler(level);  // Az aktuális enemyHandler megszerzése

    if (life === 0) {
        isGameOver = true;
        return;  // Ha a játékos élete elfogyott, nincs értelme tovább ellenőrizni a nyerést
    }

    switch (level) {
        case 1:
            if (enemyHandler.enemyRows.length === 0) {
                didwin = true;
                isGameOver = true;
            }
            break;
        case 2:
            if (enemyHandler.enemyRows1.length === 0 && enemyHandler.enemyRows2.length === 0) {
                didwin = true;
                isGameOver = true;
            }
            break;
        case 3:
            if (enemyHandler.enemyRows.length === 0 && !enemyHandler.boss1 && !enemyHandler.boss2) {
                didwin = true;
                isGameOver = true;
            }
            break;
        case 4:
            if (enemyHandler.enemyRows.length === 0) {
                didwin = true;
                isGameOver = true;
            }
            break;
        case 5:
            if (enemyHandler.enemyRows1.length === 0 && enemyHandler.enemyRows2.length === 0 && 
                enemyHandler.enemyRows3.length === 0 && !enemyHandler.boss) {
                didwin = true;
                isGameOver = true;
            }
            break;
    }
}

function collideWithObject(){

    if (collisionCooldown > 0) {
        collisionCooldown--; 
        return;
    }

    if(enemyBulletController.collideWith(player)){
        life--;
    }

    const enemyHandlers = [enemyHandler1, enemyHandler2, enemyHandler3, enemyHandler4, enemyHandler5];

    enemyHandlers.forEach(handler => {
        if (handler.collideWith(player)) {
            life--;
            collisionCooldown = 70;
        }
    });

    if(enemyHandler5.boss && enemyHandler5.boss.bulletController.collideWith(player)){
        life--;
    }

    if (giftController.collideWith(player)) {
        life++;
    }

    if(gift2Controller.collideWith(player)){
        enemyHandler1.score += 200;
        enemyHandler2.score += 200;
        enemyHandler3.score += 200;
        enemyHandler4.score += 200;
        enemyHandler5.score += 200;
    }

    if(meteorController.collideWith(player)){
        life--;
    }

}

function updateTime() {
    seconds++;
    const formattedTime = formatTime(seconds);
    return formattedTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 3600); 
    const second = Math.floor((seconds % 3600) / 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = second < 10 ? `0${second}` : `${second}`;
    return `${formattedMinutes}:${formattedSeconds}`;
}

function drawButtonBack() {
    const buttonImage = new Image();
    buttonImage.src = "images/ikon/back.png";

    buttonImage.onload = () => {
        ctx.drawImage(buttonImage, 910, 10, 64, 64);
    };
}

function stopAllMusic() {
    gameSound.pause();   
    bossSound.pause();   
}