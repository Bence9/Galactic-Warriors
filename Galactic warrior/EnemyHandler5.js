import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
import Boss from "./Boss.js";
import MeteorStand from "./MeteorStand.js";

export default class EnemyHandler5 {
    
    enemyMap1 = [
        [5, 3, 0, 0, 1, 0, 0, 0, 3, 5],
        [4, 3, 0, 0, 1, 0, 0, 0, 3, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    enemyMap2 = [
        [5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
        [3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 0, 0, 0, 0, 0, 0]
    ];

    enemyMap3 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2]
    ];

    enemyRows1 = [];
    enemyRows2 = [];
    enemyRows3 = [];
    currentDirection = MovingDirection.right;
    xVelocity = 1;
    yVelocity = 1;
    xVelocity2 = 3;
    yVelocity2 = 1;
    xVelocity3 = -3;
    yVelocity3 = 1;
    defaultXVelocity = 1; // enemy gyorsaság
    defaultYVelocity = 1;
    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;
    fireBulletTimerDefault = 50;
    fireBulletTimer = this.fireBulletTimerDefault;
    dropGiftTimer = 700;
    dropMeteorTimer = 300;
    score = 0;
    initialYPosition = 0;
    bossInitialYPosition = 0;

    constructor(canvas, enemyBulletController, playerBulletController, bossBulletController, giftController, gift2Controller, meteorController, soundEnabled) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;
        this.bossBulletController = bossBulletController;
        this.giftController = giftController;
        this.gift2Controller = gift2Controller;
        this.meteorController = meteorController;
        this.soundEnabled = soundEnabled;
        this.enemyDeathSound = new Audio("sounds/enemy-death.wav");
        this.enemyDeathSound.volume = 0.5;
        this.explosionSound = new Audio("sounds/explosion.wav");
        this.explosionSound.volume = 0.5;

        this.createEnemies();

        this.boss = new Boss(180, 30, 6, 30, this.bossBulletController);
        this.meteor1 = new MeteorStand(150, 300, 0, 10);
        this.meteor2 = new MeteorStand(450, 250, 0, 10);
        this.meteor3 = new MeteorStand(750, 300, 0, 10);
    }

    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelocityAndDirection();
        this.collisionDetection();
        this.drawEnemies(ctx);
        this.drawBoss(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();
        this.dropGift();
        this.dropMeteor();
        this.drawMeteors(ctx);
        this.bossBulletController.draw(ctx);
        if(this.boss){
            this.boss.fireDiagonalBullets();
        }
        this.meteor1 = this.handleMeteorCollision(this.meteor1, 150, 300);
        this.meteor2 = this.handleMeteorCollision(this.meteor2, 450, 250);
        this.meteor3 = this.handleMeteorCollision(this.meteor3, 750, 300);
    }

    drawBoss(ctx) {
        if (this.boss) {
            this.boss.waveMove(this.xVelocity, 0);
            this.boss.draw(ctx);
        }
    }

    drawMeteors(ctx){
        if(this.meteor1){
            this.meteor1.draw(ctx);
        }
        if(this.meteor2){
            this.meteor2.draw(ctx);
        }
        if(this.meteor3){
            this.meteor3.draw(ctx);
        }
    }

    updateVelocityAndDirection() {
        let rightMostX = Math.max(...this.enemyRows1.flat().map(enemy => enemy.x + enemy.width));
        let leftMostX = Math.min(...this.enemyRows1.flat().map(enemy => enemy.x));

        // EnemyRows1 mozgatása
        if (this.currentDirection === MovingDirection.right) {
            this.xVelocity = this.defaultXVelocity;
            this.yVelocity = 0;
            if (rightMostX >= this.canvas.width) {
                this.currentDirection = MovingDirection.down;
                this.initialYPosition += 30;
            }
        } else if (this.currentDirection === MovingDirection.left) {
            this.xVelocity = -this.defaultXVelocity;
            this.yVelocity = 0;
        if (leftMostX <= 0) {
            this.currentDirection = MovingDirection.right;
            this.initialYPosition += 30; 
        }
        } else if (this.currentDirection === MovingDirection.down) {
            this.xVelocity = 0;
            this.yVelocity = this.defaultYVelocity;
        if (this.enemyRows1[0] && this.enemyRows1[0][0] && this.enemyRows1[0][0].y >= this.initialYPosition + 30) {
                this.currentDirection = MovingDirection.left;
            }
        }

        this.enemyRows1.flat().forEach(enemy => {
            enemy.move(this.xVelocity, this.yVelocity);
        });

        // Boss mozgása
        if (this.boss) {
            if (this.currentDirection === MovingDirection.right) {
                if (this.boss.x + this.boss.width >= this.canvas.width) {
                    this.currentDirection = MovingDirection.left;
                    this.xVelocity = this.defaultXVelocity;
                }
            } else if (this.currentDirection === MovingDirection.left) {
                if (this.boss.x <= 0) {
                    this.currentDirection = MovingDirection.right;
                    this.xVelocity = this.defaultXVelocity;
                }
            }
        
            this.boss.waveMove(this.xVelocity, this.bossInitialYPosition);
        }
    
        // Átlós mozgás enemyRows2
        let rightMostX2 = Math.max(...this.enemyRows2.flat().map(enemy => enemy.x + enemy.width));
        let leftMostX2 = Math.min(...this.enemyRows2.flat().map(enemy => enemy.x));
    
        if (rightMostX2 >= this.canvas.width && this.xVelocity2 > 0) {
            this.xVelocity2 *= -1;
            this.yVelocity2 *= -1;
        } else if (leftMostX2 <= 0 && this.xVelocity2 < 0) {
            this.xVelocity2 *= -1;
            this.yVelocity2 *= -1;
        }

        this.enemyRows2.flat().forEach(enemy => {
            enemy.move(this.xVelocity2, this.yVelocity2);
        });

        // Átlós mozgás enemyRows3
        let rightMostX3 = Math.max(...this.enemyRows3.flat().map(enemy => enemy.x + enemy.width));
        let leftMostX3 = Math.min(...this.enemyRows3.flat().map(enemy => enemy.x));

        if (rightMostX3 >= this.canvas.width && this.xVelocity3 > 0) {
            this.xVelocity3 *= -1;
            this.yVelocity3 *= -1;
        } else if (leftMostX3 <= 0 && this.xVelocity3 < 0) {
            this.xVelocity3 *= -1;
            this.yVelocity3 *= -1;
        }

        this.enemyRows3.flat().forEach(enemy => {
            enemy.move(this.xVelocity3, this.yVelocity3);
        });

    }

    drawEnemies(ctx) {
        const enemyRows = [this.enemyRows1, this.enemyRows2, this.enemyRows3];
        const xVelocities = [this.xVelocity, this.xVelocity2, this.xVelocity3];
        const yVelocities = [this.yVelocity, this.yVelocity2, this.yVelocity3];
    
        enemyRows.forEach((row, index) => {
            row.flat().forEach((enemy) => {
                if (enemy) {
                    enemy.move(xVelocities[index], yVelocities[index]);
                    enemy.draw(ctx);
                }
            });
        });
    }


    createEnemies() {
        const enemyMaps = [this.enemyMap1, this.enemyMap2, this.enemyMap3];
        const enemyRows = [this.enemyRows1, this.enemyRows2, this.enemyRows3];
    
        enemyMaps.forEach((enemyMap, mapIndex) => {
            enemyMap.forEach((row, rowIndex) => {
                enemyRows[mapIndex][rowIndex] = [];
                row.forEach((enemyNumber, enemyIndex) => {
                    if (enemyNumber > 0) {
                        enemyRows[mapIndex][rowIndex].push(
                            new Enemy(enemyIndex * 45, rowIndex * 30 + 30, enemyNumber)
                        );
                    }
                });
            });
        });
    }


    collisionDetection() {
        this.enemyRows1.forEach((enemyRow) => {
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
        this.enemyRows1 = this.enemyRows1.filter((enemyRow) => enemyRow.length > 0);

        this.enemyRows2.forEach((enemyRow2) => {
            enemyRow2.forEach((enemy, enemyIndex) => {
                if (enemy && this.playerBulletController.collideWith(enemy)) {
                    const enemyValue = enemy.value;
                    this.addScore(enemyValue);
                    if (this.soundEnabled) {
                        this.enemyDeathSound.currentTime = 0;
                        this.enemyDeathSound.play();
                    }
                    enemyRow2.splice(enemyIndex, 1);
                }
            });
        });
        this.enemyRows2 = this.enemyRows2.filter((enemyRow) => enemyRow.length > 0);

        this.enemyRows3.forEach((enemyRow3) => {
            enemyRow3.forEach((enemy, enemyIndex) => {
                if (enemy && this.playerBulletController.collideWith(enemy)) {
                    const enemyValue = enemy.value;
                    this.addScore(enemyValue);
                    if (this.soundEnabled) {
                        this.enemyDeathSound.currentTime = 0;
                        this.enemyDeathSound.play();
                    }
                    enemyRow3.splice(enemyIndex, 1);
                }
            });
        });
        this.enemyRows3 = this.enemyRows3.filter((enemyRow) => enemyRow.length > 0);

        if (this.boss && this.playerBulletController.collideWith(this.boss)) {
            this.boss.life -= 1;

            if(this.boss.life === 20){ 
                this.boss.changeImage(`images/enemy/Boss2.png`);
            }
            if(this.boss.life === 10){ 
                this.boss.changeImage(`images/enemy/Boss3.png`);
            }
        
            if (this.boss.life <= 0) {
                this.boss = null;
                this.addScore("boss");
        
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
        return meteor;
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


    fireBullet() {
        this.fireBulletTimer--;
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault;

            const Enemies1 = this.enemyRows2.flat();
            if (Enemies1.length > 0) {
                const enemyIndex = Math.floor(Math.random() * Enemies1.length);
                const enemy = Enemies1[enemyIndex];
                
                if (enemy) {
                    this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3, 10);
                }
            }

            const Enemies2 = this.enemyRows2.flat();
            if (Enemies2.length > 0) {
                const enemyIndex = Math.floor(Math.random() * Enemies2.length);
                const enemy = Enemies2[enemyIndex];
                
                if (enemy) {
                    this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3, 10);
                }
            }

            const Enemies3 = this.enemyRows2.flat();
            if (Enemies3.length > 0) {
                const enemyIndex = Math.floor(Math.random() * Enemies3.length);
                const enemy = Enemies3[enemyIndex];
                
                if (enemy) {
                    this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3, 10);
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
                scoreToAdd = 20;
                break;
            case "boss":
                scoreToAdd = 1000;
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
            this.dropMeteorTimer = Math.floor(Math.random() * (1200 - 600)) + 600;
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const Yvelocity = -4;
            const timeTillNextMeteorAllowed = 10;
            this.meteorController.drop(x, y, Yvelocity, timeTillNextMeteorAllowed);
        }
    }

    collideWith(sprite) {
        let collisionDetected = this.enemyRows1.flat().some((enemy) => enemy.collideWith(sprite));
        if (this.boss && this.boss.collideWith(sprite)) {
            collisionDetected = true;
        }
    
        return collisionDetected;
    }

    resetGame() {
        this.currentDirection = MovingDirection.right;
        this.initialYPosition = 0;
        this.xVelocity = 1;
        this.yVelocity = 1;
        this.moveDownTimer = this.moveDownTimerDefault;
        this.boss = new Boss(180, 30, 6, 30, this.bossBulletController);
        this.meteor1 = new MeteorStand(150, 300, 0, 10);
        this.meteor2 = new MeteorStand(450, 250, 0, 10);
        this.meteor3 = new MeteorStand(750, 300, 0, 10);
    }

}