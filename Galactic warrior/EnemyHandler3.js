import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
import MiniBoss from "./MiniBoss.js";
import MeteorStand from "./MeteorStand.js";

export default class EnemyHandler3 {

    enemyMap = [
        [3, 3, 3, 1, 3, 3, 2, 3, 3, 3],
        [5, 0, 6, 0, 0, 0, 0, 6, 0, 5],
        [4, 0, 0, 0, 5, 5, 0, 0, 0, 4],
        [3, 0, 0, 0, 0, 0, 0, 0, 0, 3],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    enemyRows = [];
    currentDirection = MovingDirection.down;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 2; // enemy gyorsasag
    defaultYVelocity = 1;
    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;
    fireBulletTimerDefault = 40; // lovedek folytonossaganak gyorsasaga
    fireBulletTimer = this.fireBulletTimerDefault;
    dropGiftTimer = 700;
    dropMeteorTimer = 300;
    score = 0;
    initialYPosition = 0;

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
        this.explosionSound = new Audio("sounds/explosion.wav");
        this.explosionSound.volume = 0.5;

        this.createEnemies();

        this.boss1 = new MiniBoss(85, 60, 6, 10);
        this.boss2 = new MiniBoss(310, 60, 6, 10);
        this.meteor1 = new MeteorStand(200, 300, 0, 7);
        this.meteor2 = new MeteorStand(700, 300, 0, 7);
    }

    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();
        this.drawEnemies(ctx);
        this.drawBosses(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();
        this.dropGift();
        this.dropMeteor();
        this.drawMeteors(ctx);
        this.meteor1 = this.handleMeteorCollision(this.meteor1, 200, 300);
        this.meteor2 = this.handleMeteorCollision(this.meteor2, 700, 300);
    }

    drawBosses(ctx) {
        if (this.boss1) {
            this.boss1.move(this.xVelocity, this.yVelocity);
            this.boss1.draw(ctx);
        }
        if (this.boss2) {
            this.boss2.move(this.xVelocity, this.yVelocity);
            this.boss2.draw(ctx);
        }
    }

    drawMeteors(ctx){
        if(this.meteor1){
            this.meteor1.draw(ctx);
        }
        if(this.meteor2){
            this.meteor2.draw(ctx);
        }
    }

    updateVelocityAndDirection() {
        let rightMostX = Math.max(...this.enemyRows.flat().map(enemy => enemy.x + enemy.width));
        let leftMostX = Math.min(...this.enemyRows.flat().map(enemy => enemy.x));
        
        if (this.boss1) {
            rightMostX = Math.max(rightMostX, this.boss1.x + this.boss1.width);
            leftMostX = Math.min(leftMostX, this.boss1.x);
        }
        if (this.boss2) {
            rightMostX = Math.max(rightMostX, this.boss2.x + this.boss2.width);
            leftMostX = Math.min(leftMostX, this.boss2.x);
        }
        
        if (this.currentDirection === MovingDirection.down) {
            this.xVelocity = 0;
            this.yVelocity = this.defaultYVelocity;
            if (this.enemyRows[0] && this.enemyRows[0][0] && this.enemyRows[0][0].y >= this.initialYPosition + 90) {
                this.currentDirection = MovingDirection.right;
                this.initialYPosition += 90;
            }
        } else if (this.currentDirection === MovingDirection.right) {
            this.xVelocity = this.defaultXVelocity;
            this.yVelocity = 0;
            if (rightMostX >= this.canvas.width) {
                this.currentDirection = MovingDirection.up;
            }
        } else if (this.currentDirection === MovingDirection.up) {
            this.xVelocity = 0;
            this.yVelocity = -this.defaultYVelocity;
            if (this.enemyRows[0] && this.enemyRows[0][0] && this.enemyRows[0][0].y <= this.initialYPosition - 30) {
                this.currentDirection = MovingDirection.left;
                this.initialYPosition -= 30;
            }
        } else if (this.currentDirection === MovingDirection.left) {
            this.xVelocity = -this.defaultXVelocity;
            this.yVelocity = 0;
            if (leftMostX <= 0) {
                this.currentDirection = MovingDirection.down;
            }
        }
        
        this.enemyRows.flat().forEach(enemy => {
            enemy.move(this.xVelocity, this.yVelocity);
        });
    
        if (this.boss1) {
            this.boss1.move(this.xVelocity, this.yVelocity);
        }
        if (this.boss2) {
            this.boss2.move(this.xVelocity, this.yVelocity);
        }
    }

    drawEnemies(ctx) {
        this.enemyRows.flat().forEach((enemy) => {
            if (enemy) {
                enemy.move(this.xVelocity, this.yVelocity);
                enemy.draw(ctx);
            }
        });
    }

    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(
                        new Enemy(enemyIndex * 45, rowIndex * 30 + 30, enemyNumber)
                    );
                }
            });
        });
    }

    collisionDetection() {
        this.enemyRows.forEach((enemyRow) => {
            enemyRow.forEach((enemy, enemyIndex) => {
                if (enemy && this.playerBulletController.collideWith(enemy)) {
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

        
        if (this.boss1 && this.playerBulletController.collideWith(this.boss1)) {
            this.boss1.life -= 1;
            if (this.boss1.life <= 0) {
                this.boss1 = null;
                this.addScore("miniboss"); 
                if (this.soundEnabled) {
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                }
            }
        }
        if (this.boss2 && this.playerBulletController.collideWith(this.boss2)) {
            this.boss2.life -= 1;
            if (this.boss2.life <= 0) {
                this.boss2 = null;
                this.addScore("miniboss");
                if (this.soundEnabled) {
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                }
            }
        }

    }

    handleMeteorCollision(meteor, dropX, dropY) {
        if (meteor && this.playerBulletController.collideWith(meteor)) {
            meteor.life -= 1;
            if (meteor.life <= 0) {
                if (this.soundEnabled) {
                    this.explosionSound.play();
                }
                this.meteorController.drop(dropX, dropY, -5, 10);
                return null; // A meteor megsemmisítése
            }
        }
        return meteor; // A meteor visszaadása, ha még életben van
    }

    fireBullet() {
        this.fireBulletTimer--;
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();

            if (allEnemies.length > 0) {
                const enemyIndex = Math.floor(Math.random() * allEnemies.length);
                const enemy = allEnemies[enemyIndex];
            
                if (enemy) {
                    this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
                }
            }
        }
    }

    resetMoveDownTimer() {
        if (this.moveDownTimer <= 0) {
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    decrementMoveDownTimer() {
        if (this.currentDirection === MovingDirection.down) {
            this.moveDownTimer -= 30;
        }
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
            case 6:
                scoreToAdd = 50;
                break;
            case "miniboss":
                scoreToAdd = 200;
                break;
        }
        this.score += scoreToAdd;
    }

    dropGift() {
        this.dropGiftTimer--;
        if (this.dropGiftTimer <= 0) {
            this.dropGiftTimer = Math.floor(Math.random() * (2500 - 1000)) + 1000; // Random drop between 1000-2500 ms
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const Yvelocity = -2;
            const Xvelocity = 0;
            const timeTillNextGiftAllowed = 10;
            const number = Math.floor(Math.random() * 100) + 1;
            if (number >= 50) {
                this.giftController.drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed);
            } else {
                this.gift2Controller.drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed);
            }
        }
    }

    dropMeteor() {
        this.dropMeteorTimer--;
        if (this.dropMeteorTimer <= 0) {
            this.dropMeteorTimer = Math.floor(Math.random() * (1200 - 600)) + 600; // Random drop between 600-1200 ms
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const Yvelocity = -4;
            const timeTillNextMeteorAllowed = 10;
            this.meteorController.drop(x, y, Yvelocity, timeTillNextMeteorAllowed);
        }
    }

    collideWith(sprite) {
        let collisionDetected = this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
    
        if (this.boss1 && this.boss1.collideWith(sprite)) {
            collisionDetected = true;
        }

        if (this.boss2 && this.boss2.collideWith(sprite)) {
            collisionDetected = true;
        }
    
        return collisionDetected;
    }

    resetGame() {
        this.currentDirection = MovingDirection.down;
        this.initialYPosition = 0;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.moveDownTimer = this.moveDownTimerDefault;
        this.boss1 = new MiniBoss(85, 60, 6, 10);
        this.boss2 = new MiniBoss(310, 60, 6, 10);
        this.meteor1 = new MeteorStand(200, 300, 0, 7);
        this.meteor2 = new MeteorStand(700, 300, 0, 7);
    }

}
