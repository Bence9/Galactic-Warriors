export default class PlayerBullet {
    constructor(canvas, x, y, xVelocity, yVelocity, bulletColor) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.bulletColor = bulletColor;
        this.width = 5; 
        this.height = 15;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.move();
    }

    move() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }

    collideWith(sprite) {
        return (
            this.x + this.width > sprite.x &&
            this.x < sprite.x + sprite.width &&
            this.y + this.height > sprite.y && 
            this.y < sprite.y + sprite.height
        );
    }
}