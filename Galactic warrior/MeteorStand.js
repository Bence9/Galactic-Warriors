export default class MeteorStand {
    constructor(x, y, Yvelocity, life) {
        this.x = x;
        this.y = y;
        this.Yvelocity = Yvelocity;
        this.life = life;
        
        this.image = new Image();
        this.image.src = "images/drop/meteor.png";

        this.width = 60;
        this.height = 55;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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