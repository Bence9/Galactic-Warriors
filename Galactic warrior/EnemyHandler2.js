import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
import MeteorStand from "./MeteorStand.js";

export default class EnemyHandler2 {

    enemyMap1 = [
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    enemyMap2 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0]
    ];

    enemyRows1 = [];
    enemyRows2 = [];

    currentDirection1 = MovingDirection.right;
    currentDirection2 = MovingDirection.left;
    xVelocity1 = 2;
    yVelocity1 = 0.5;
    xVelocity2 = 2;
    yVelocity2 = 0.5;
    defaultXVelocity = 2;
    defaultYVelocity = 0.5;
    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;
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
        this.explosionSound = new Audio("sounds/explosion.wav");
        this.explosionSound.volume = 0.5;

        this.createEnemies();
        this.meteor1 = new MeteorStand(450, 300, 0, 5);
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
        this.drawMeteors(ctx);
        this.meteor1 = this.handleMeteorCollision(this.meteor1, 450, 300);
    }

    drawMeteors(ctx){
        if(this.meteor1){
            this.meteor1.draw(ctx);
        }
    }

    collisionDetection(){
        this.enemyRows1.forEach((enemyRow)=>{
            enemyRow.forEach((enemy, enemyIndex)=>{
            if(this.playerBulletController.collideWith(enemy)){

                const enemyValue = enemy.value;
                this.addScore(enemyValue);

                if(this.soundEnabled){
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                }

                enemyRow.splice(enemyIndex, 1);

            }
        });
        });
        this.enemyRows1 = this.enemyRows1.filter((enemyRow) => enemyRow.length > 0);

        this.enemyRows2.forEach((enemyRow)=>{
            enemyRow.forEach((enemy, enemyIndex)=>{
            if(this.playerBulletController.collideWith(enemy)){

                const enemyValue = enemy.value; 
                this.addScore(enemyValue);

                if(this.soundEnabled){
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                }

                enemyRow.splice(enemyIndex, 1);

            }
        });
        });
        this.enemyRows2 = this.enemyRows2.filter((enemyRow) => enemyRow.length > 0);

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

            const Enemies1 = this.enemyRows1.flat();
            if (Enemies1.length > 0) {
                const enemyIndex = Math.floor(Math.random() * Enemies1.length);
                const enemy = Enemies1[enemyIndex];
                
                if (enemy) {
                    this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
                }
            }

            const Enemies2 = this.enemyRows2.flat();
            if (Enemies2.length > 0) {
                const enemyIndex = Math.floor(Math.random() * Enemies2.length);
                const enemy = Enemies2[enemyIndex];
                
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
        if (this.currentDirection1 === MovingDirection.downLeft || this.currentDirection1 === MovingDirection.downRight ||
            this.currentDirection2 === MovingDirection.downLeft || this.currentDirection2 === MovingDirection.downRight) {
            this.moveDownTimer--;
        }
    }

    updateVelocityAndDirection() {
        // EnemyMap1 mozgatása
        for (const enemyRow of this.enemyRows1) {
            const validEnemies = enemyRow.filter(enemy => enemy !== 0);
    
            if (validEnemies.length === 0) {
                continue;
            }
    
            if (this.currentDirection1 === MovingDirection.right) {
                this.xVelocity1 = this.defaultXVelocity;
                this.yVelocity1 = 0;
                const rightMostEnemy = validEnemies[validEnemies.length - 1];
                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
                    this.currentDirection1 = MovingDirection.downLeft;
                    break;
                }
            } else if (this.currentDirection1 === MovingDirection.downLeft) {
                if (this.moveDown(MovingDirection.left)) { 
                    this.currentDirection1 = MovingDirection.left;
                    break;
                }
            } else if (this.currentDirection1 === MovingDirection.left) {
                this.xVelocity1 = -this.defaultXVelocity;
                this.yVelocity1 = 0;
                const leftMostEnemy = validEnemies[0];
                if (leftMostEnemy.x <= 0) {
                    this.currentDirection1 = MovingDirection.downRight;
                    break;
                }
            } else if (this.currentDirection1 === MovingDirection.downRight) {
                if (this.moveDown(MovingDirection.right)) {
                    this.currentDirection1 = MovingDirection.right;
                    break;
                }
            }
        }

         // EnemyMap2 mozgatása
        for (const enemyRow of this.enemyRows2) {
            const validEnemies = enemyRow.filter(enemy => enemy !== 0);

            if (validEnemies.length === 0) {
                continue;
            }

            if (this.currentDirection2 === MovingDirection.left) {
                this.xVelocity2 = -this.defaultXVelocity;
                this.yVelocity2 = 0;
                const leftMostEnemy = validEnemies[0];
                if (leftMostEnemy.x <= 0) {
                    this.currentDirection2 = MovingDirection.downRight;
                    break;
                }
            } else if (this.currentDirection2 === MovingDirection.downRight) {
                if (this.moveDown2(MovingDirection.right)) { 
                    this.currentDirection2 = MovingDirection.right; 
                    break;
                }
            } else if (this.currentDirection2 === MovingDirection.right) {
                this.xVelocity2 = this.defaultXVelocity;
                this.yVelocity2 = 0;
                const rightMostEnemy = validEnemies[validEnemies.length - 1];
                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
                    this.currentDirection2 = MovingDirection.downLeft;
                    break;
                }
            } else if (this.currentDirection2 === MovingDirection.downLeft) {
                if (this.moveDown2(MovingDirection.left)) { 
                    this.currentDirection2 = MovingDirection.left;
                    break;
                }
            }
        }
    }
    

    moveDown(newDirection) {
        this.xVelocity1 = 0;
        this.yVelocity1 = this.defaultYVelocity;
        if (this.moveDownTimer === 0) {
            this.currentDirection1 = newDirection;
            return true;
        }
        return false;
    }

    moveDown2(newDirection) {
        this.xVelocity2 = 0;
        this.yVelocity2 = this.defaultYVelocity;
        if (this.moveDownTimer === 0) {
            this.currentDirection2 = newDirection;
            return true;
        }
        return false;
    }


    drawEnemies(ctx) {
        const enemyRows = [this.enemyRows1, this.enemyRows2];
        const xVelocities = [this.xVelocity1, this.xVelocity2];
        const yVelocities = [this.yVelocity1, this.yVelocity2];
    
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
        const enemyMaps = [this.enemyMap1, this.enemyMap2];
        const enemyRows = [this.enemyRows1, this.enemyRows2];
    
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


    collideWith(sprite) {
        // Ellenőrzi mindkét enemyRowst az ütközéshez
        const collisionDetected1 = this.enemyRows1.flat().some((enemy) => enemy !== 0 && enemy.collideWith(sprite));
        const collisionDetected2 = this.enemyRows2.flat().some((enemy) => enemy !== 0 && enemy.collideWith(sprite));
        
        if(collisionDetected1 || collisionDetected2){
            return true;
        }

        return false;
    }

    // enemyValue alapján ponthozzáadás (minden szín más értékkel rendelkezik)
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
            this.dropGiftTimer = Math.floor(Math.random() * (2500 - 1000)) + 1000; //Véletlenszerű időpontokban ajándékledobás (1000-2500 ms)
            const x = Math.random() * this.canvas.width; // Véletlenszerű x pozíció (vászon szélessége)
            const y = 0; // A vászon teteje
            const Yvelocity = -2; // Sebesség, lefelé esés
            const Xvelocity = 0;
            const timeTillNextGiftAllowed = 10;
            const number = Math.floor(Math.random() * (100 - 1)) + 1; // ez véletlenszerűen adja a gift1 és gift2 tipusokat felváltva
            if(number >= 50){
                this.giftController.drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed);
            }
            else if(number < 50){
                this.gift2Controller.drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed);
            }
            
        }
    }

    dropMeteor() {
        this.dropMeteorTimer--;
        if (this.dropMeteorTimer <= 0) {
            this.dropMeteorTimer = Math.floor(Math.random() * (1200 - 600)) + 600; //Véletlenszerű időpontokban ledobás (600 - 1200 ms)
            const x = Math.random() * this.canvas.width; // Véletlenszerű x pozíció (vászon szélessége)
            const y = 0; // A vászon teteje
            const Yvelocity = -4; // Sebesség (4), lefelé esés (-)
            const timeTillNextMeteorAllowed = 10;
            this.meteorController.drop(x, y, Yvelocity, timeTillNextMeteorAllowed);
        }
    }

    resetGame() {
        this.currentDirection1 = MovingDirection.right;
        this.currentDirection2 = MovingDirection.left;
        this.xVelocity1 = 2;
        this.yVelocity1 = 0.5;
        this.xVelocity2 = 2;
        this.yVelocity2 = 0.5;
        this.moveDownTimer = this.moveDownTimerDefault;
        this.meteor1 = new MeteorStand(450, 300, 0, 5);
    }

}