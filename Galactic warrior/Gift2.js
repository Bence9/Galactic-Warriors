export default class Gift2 {
    constructor(canvas, x, y, Yvelocity, Xvelocity) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.Yvelocity = Yvelocity;
        this.Xvelocity = Xvelocity;
        
        this.image = new Image();
        this.image.src = "images/drop/gift2.png";

        this.width = 32;
        this.height = 32;
    }

    draw(ctx) {
        this.y -= this.Yvelocity;
        this.x += this.Xvelocity;
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