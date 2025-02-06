export default class Boss {
    constructor(x, y, imageNumber, life, bulletController) {
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;

        this.value = imageNumber;

        this.image = new Image();
        this.image.src = `images/enemy/Boss1.png`;

        this.life = life;
        this.bulletController = bulletController;
        this.fireBulletTimerDefault = 200;
        this.fireBulletTimer = this.fireBulletTimerDefault;

        this.radius = 1;
        this.speed = 0.02;
        this.angle = 1;
    }

    
    waveMove(xVelocity, yVelocity) {
        this.x += xVelocity;

        // Hullámzó mozgás
        this.angle += this.speed;
        const circularY = this.radius * Math.sin(this.angle);
        this.y += yVelocity + circularY;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    changeImage(imagePath) {
        this.image.src = imagePath;
    }

    collideWith(sprite) {
        return (
            this.x + this.width > sprite.x &&
            this.x < sprite.x + sprite.width &&
            this.y + this.height > sprite.y && 
            this.y < sprite.y + sprite.height
        );
    }

    fireDiagonalBullets() {
        if (this.fireBulletTimer <= 0) {

            const velocities = [
                { x: 2, y: 3 },
                { x: -2, y: 3 },
                { x: 0, y: 4 },
                { x: 1, y: 3.5 },
                { x: -1, y: 3.5 },
            ];
    
            this.bulletController.SpecialShoot(this.x + this.width / 2, this.y + this.height, velocities);
    
            this.fireBulletTimer = this.fireBulletTimerDefault;
        } else {
            this.fireBulletTimer--;
        }
    }

}