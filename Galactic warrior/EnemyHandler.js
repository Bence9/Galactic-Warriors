import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyHandler1 {

    enemyMap = [
        [1, 1, 0, 1, 0, 0, 1, 0, 1, 1],
        [5, 5, 0, 5, 5, 5, 5, 0, 5, 5],
        [2, 4, 4, 4, 4, 4, 4, 4, 4, 2],
        [2, 2, 0, 3, 3, 3, 3, 0, 2, 2],
        [2, 2, 0, 2, 0, 0, 2, 0, 2, 2],
        [1, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    ];

    enemyRows = [];

    currentDirection = MovingDirection.right;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefault = 30;
    moveDownTimer = this.moveDownTimerDefault;
    fireBulletTimerDefault = 100;
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

    collisionDetection(){
        this.enemyRows.forEach((enemyRow)=>{
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
        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
    }


    fireBullet(){
        this.fireBulletTimer--;
        if(this.fireBulletTimer <= 0){
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width/2, enemy.y, -3);
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
        for (const enemyRow of this.enemyRows) {
            if (this.currentDirection === MovingDirection.right) {
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                const rightMostEnemies = enemyRow[enemyRow.length - 1];
                if ( rightMostEnemies.x + rightMostEnemies.width >= this.canvas.width )
                {
                    this.currentDirection = MovingDirection.downLeft;
                    break;
                }
            } else if (this.currentDirection === MovingDirection.downLeft) {
                if (this.moveDown(MovingDirection.left)) {
                    break;
                }
            } else if (this.currentDirection === MovingDirection.left) {
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const leftMostEnemy = enemyRow[0];
                if (leftMostEnemy.x <= 0) {
                    this.currentDirection = MovingDirection.downRight;
                    break;
                }
            } else if (this.currentDirection === MovingDirection.downRight) {
                if (this.moveDown(MovingDirection.right)) {
                    break;
                }
            }
        }
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
                        new Enemy(enemyIndex * 45, rowIndex * 30 + 30, enemyNumber)
                    );
                }
            });
        });
    }

    collideWith(sprite){
        const collisionDetected = this.enemyRows.flat().some((enemy)=>enemy.collideWith(sprite));
        return collisionDetected;
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
            const x = Math.random() * this.canvas.width; // Véletlenszerű x pozíció a vászon szélességének tartományából
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
            const x = Math.random() * this.canvas.width;
            const y = 0;
            const Yvelocity = -4; // Sebesség (4), lefelé esés (-)
            const timeTillNextMeteorAllowed = 10;
            this.meteorController.drop(x, y, Yvelocity, timeTillNextMeteorAllowed);
        }
    }

    resetGame() {
        this.currentDirection = MovingDirection.right;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.moveDownTimer = this.moveDownTimerDefault;
    }

}
