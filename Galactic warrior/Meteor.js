export default class Meteor {
    constructor(canvas, x, y, Yvelocity) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.Yvelocity = Yvelocity;
        
        this.image = new Image();
        this.image.src = "images/drop/meteorRed.png";

        this.width = 60;
        this.height = 55;
    }

    draw(ctx) {
        this.y -= this.Yvelocity;
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