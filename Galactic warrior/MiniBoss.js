export default class MiniBoss {
    constructor(x, y, imageNumber, life) {
        this.x = x;
        this.y = y;
        this.width = 75;
        this.height = 55;

        this.value = imageNumber;

        this.image = new Image();
        this.image.src = `images/enemy/enemy${imageNumber}.png`;

        this.life = life;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(xVelocity, yVelocity) {
        this.x += xVelocity;
        this.y += yVelocity;
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