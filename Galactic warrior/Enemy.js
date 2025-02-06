export default class Enemy{

    constructor(x,y,imageNumber){
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 35;

        this.value = imageNumber;   //ellenség értéke pontszámoláshoz

        this.image = new Image();
        this.image.src = `images/enemy/enemy${imageNumber}.png`;
    }

    draw(ctx){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    move(xVelocity,yVelocity){
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