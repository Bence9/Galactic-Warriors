import Bullet from "./Bullet.js";
import BossBullet from "./BossBullet.js";

export default class BulletController {
    bullets = [];
    timeTillNextBulletAllowed = 1;

    constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
        this.canvas = canvas;
        this.maxBulletsAtATime = maxBulletsAtATime;
        this.bulletColor = bulletColor;
        this.soundEnabled = soundEnabled;

        this.shootSound = new Audio("sounds/shoot.wav");
        this.shootSound.volume = 0.3;
    }

    draw(ctx) {
        this.bullets = this.bullets.filter(bullet => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height);

        this.bullets.forEach(bullet => bullet.draw(ctx));

        if (this.timeTillNextBulletAllowed > 0) {
            this.timeTillNextBulletAllowed--;
        }
    }

    shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
        if (this.timeTillNextBulletAllowed <= 0 && this.bullets.length < this.maxBulletsAtATime) {
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
            this.bullets.push(bullet);

            if (this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }

            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
        }
    }

    // 2 lövés egy időben
    doubleShoot(x1, y1, x2, y2, velocity, timeTillNextBulletAllowed = 0) {
        if (this.timeTillNextBulletAllowed <= 0 && this.bullets.length < this.maxBulletsAtATime) {
            const bullet1 = new Bullet(this.canvas, x1, y1, velocity, this.bulletColor);
            const bullet2 = new Bullet(this.canvas, x2, y2, velocity, this.bulletColor);
            this.bullets.push(bullet1);
            this.bullets.push(bullet2);
            
            if (this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }
    
            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
        }
    }

    // 3 lövés félkörben
    TripleShoot(x, y, velocities, timeTillNextBulletAllowed = 0){
        if (this.timeTillNextBulletAllowed <= 0 && this.bullets.length < this.maxBulletsAtATime) {
            velocities.forEach(velocity => {
                const bullet = new BossBullet(this.canvas, x, y, velocity.x, velocity.y, this.bulletColor);
                this.bullets.push(bullet);
            });

            if (this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }

            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
        }
    }

    BossShoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
        const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
        this.bullets.push(bullet);
    
        if (this.soundEnabled) {
            this.shootSound.currentTime = 0;
            this.shootSound.play();
        }
    
        this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }

    // félkör alapú lövés
    SpecialShoot(x, y, velocities, timeTillNextBulletAllowed = 0) {
        if (this.timeTillNextBulletAllowed <= 0 && this.bullets.length < this.maxBulletsAtATime) {
            velocities.forEach(velocity => {
                const bossBullet = new BossBullet(this.canvas, x, y, velocity.x, velocity.y, this.bulletColor);
                this.bullets.push(bossBullet);
            });

            if (this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }

            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
        }
    }

    collideWith(sprite) {
        const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
            bullet.collideWith(sprite)
        );

        if (bulletThatHitSpriteIndex >= 0) {
            this.bullets.splice(bulletThatHitSpriteIndex, 1);
            return true;
        } else {
            return false;
        }
    }

    // lövedékek eltüntetése a képernyőről
    clearBullets() {
        this.bullets = [];
    }

}
