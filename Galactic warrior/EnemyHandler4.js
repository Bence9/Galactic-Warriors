import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyHandler4 {

    enemyMap = [
        [5, 5, 5, 5, 0, 5, 5, 5, 0, 0, 0, 0, 0, 0],
        [4, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 4, 4, 4],
        [3, 0, 0, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0, 0],
        [2, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0],
        [1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
        [5, 0, 0, 5, 0, 5, 0, 0, 0, 0, 0, 5, 5, 5],
        [4, 0, 0, 4, 0, 4, 4, 4, 0, 0, 0, 4, 0, 0],
        [3, 0, 0, 3, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0],
        [2, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0],
        [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1]
    ];

    enemyRows = [];

    currentDirection = MovingDirection.down;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1.5;
    fireBulletTimerDefault = 70;
    fireBulletTimer = this.fireBulletTimerDefault;
    dropGiftTimer = 700;
    dropMeteorTimer = 300;
    score = 0;

    constructor(canvas, enemyBulletController, playerBulletController, giftController, gift2Controller, meteorController, soundEnabled) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;
        this.giftController = giftController;
        this.gift2Controller = gift2Controller;
        this.meteorController = meteorController;
        this.soundEnabled = soundEnabled;

        this.enemyDeathSound = new Audio("sounds/enemy-death.wav");
        this.enemyDeathSound.volume = 0.5;

        this.createEnemies();
    }

    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();
        this.drawEnemies(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();
        this.dropGift();
        this.dropMeteor();
    }

    collisionDetection() {
        this.enemyRows.forEach((enemyRow) => {
            enemyRow.forEach((enemy, enemyIndex) => {
                if (this.playerBulletController.collideWith(enemy)) {
                    const enemyValue = enemy.value;
                    this.addScore(enemyValue);
                    if (this.soundEnabled) {
                        this.enemyDeathSound.currentTime = 0;
                        this.enemyDeathSound.play();
                    }
                    enemyRow.splice(enemyIndex, 1);
                }
            });
        });
        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
    }

    fireBullet() {
        this.fireBulletTimer--;
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
        }
    }

    resetMoveDownTimer() {
        if (this.moveDownTimer <= 0) {
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    decrementMoveDownTimer() {
        if (
            this.currentDirection === MovingDirection.downLeft ||
            this.currentDirection === MovingDirection.downRight
        ) {
            this.moveDownTimer--;
        }
    }

    updateVelocityAndDirection() {
        let bottomMostY = Math.max(...this.enemyRows.flat().map(enemy => enemy.y + enemy.height));
        let topMostY = Math.min(...this.enemyRows.flat().map(enemy => enemy.y - 30));
        let rightMostX = Math.max(...this.enemyRows.flat().map(enemy => enemy.x + enemy.width));
        let leftMostX = Math.min(...this.enemyRows.flat().map(enemy => enemy.x));
    
        for (const enemyRow of this.enemyRows) {
            if (this.currentDirection === MovingDirection.down) {
                this.xVelocity = 0;
                this.yVelocity = this.defaultYVelocity;
                if (bottomMostY + this.defaultYVelocity >= this.canvas.height) { 
                    this.currentDirection = MovingDirection.up;
                    break;
                }
            } else if (this.currentDirection === MovingDirection.up) {
                this.xVelocity = 0;
                this.yVelocity = -this.defaultYVelocity;
                if (topMostY - this.defaultYVelocity <= 0) { 
                    this.currentDirection = (rightMostX >= this.canvas.width) ? MovingDirection.left : MovingDirection.right;
                    break;
                }
            } else if (this.currentDirection === MovingDirection.right) {
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
    
                if (rightMostX + this.defaultXVelocity >= this.canvas.width) { 
                    this.currentDirection = MovingDirection.left;
                    this.initialXPosition = undefined;
                    this.hasMovedDownUp = false;
                    break;
                } else if (rightMostX >= 900 && !this.hasMovedDownUp) {  
                    this.currentDirection = MovingDirection.down;
                    this.hasMovedDownUp = true;
                    break;
                }
            } else if (this.currentDirection === MovingDirection.left) {
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
    
                if (leftMostX - this.defaultXVelocity <= 0) { 
                    this.currentDirection = MovingDirection.right;
                    this.initialXPosition = undefined;
                    this.hasMovedDownUp = false;
                    break;
                } else if (leftMostX <= 100 && !this.hasMovedDownUp) {  
                    this.currentDirection = MovingDirection.down;
                    this.hasMovedDownUp = true;
                    break;
                }
            }
        }
    
        this.enemyRows.flat().forEach((enemy) => {
            enemy.move(this.xVelocity, this.yVelocity);
        });
    }
    

    moveDown(newDirection) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if (this.moveDownTimer === 0) {
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

    drawEnemies(ctx) {
        this.enemyRows.flat().forEach((enemy) => {
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        });
    }

    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(
                        new Enemy(enemyIndex * 55, rowIndex * 30 + 30, enemyNumber)
                    );
                }
            });
        });
    }

    collideWith(sprite) {
        const collisionDetected = this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
        return collisionDetected;
    }

    addScore(enemyValue) {
        let scoreToAdd = 0;
        switch (enemyValue) {
            case 1:
                scoreToAdd = 10;
                break;
            case 2:
                scoreToAdd = 20;
                break;
            case 3:
                scoreToAdd = 30;
                break;
            case 4:
                scoreToAdd = 40;
                break;
            case 5:
                scoreToAdd = 50;
                break;
        }
        this.score += scoreToAdd;
    }

    dropGift() {
        this.dropGiftTimer--;
        if (this.dropGiftTimer <= 0) {
            this.dropGiftTimer = Math.floor(Math.random() * (2500 - 1000)) + 1000;
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const Yvelocity = -2;
            const Xvelocity = 0;
            const timeTillNextGiftAllowed = 10;
            const number = Math.floor(Math.random() * (100 - 1)) + 1;
            if (number >= 50) {
                this.giftController.drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed);
            } else if (number < 50) {
                this.gift2Controller.drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed);
            }
        }
    }

    dropMeteor() {
        this.dropMeteorTimer--;
        if (this.dropMeteorTimer <= 0) {
            this.dropMeteorTimer = Math.floor(Math.random() * (1200 - 600)) + 600;
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const Yvelocity = -4;
            const timeTillNextMeteorAllowed = 10;
            this.meteorController.drop(x, y, Yvelocity, timeTillNextMeteorAllowed);
        }
    }

    resetGame() {
        this.currentDirection = MovingDirection.down;
        this.xVelocity = 0;
        this.yVelocity = 0;
    }
}
