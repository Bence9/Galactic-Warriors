export default class Player {
    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletController = bulletController;
        this.width = 60;
        this.height = 60;
        this.image = new Image();
        this.image.src = "images/player/player1.png";
        this.x = this.canvas.width / 2 - this.width / 2;
        this.y = this.canvas.height - 75;

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    draw(ctx) {
        this.handleShooting();
        this.move();
        this.handleWallCollision();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move() {
        if (this.moveRight) {
            this.x += this.velocity;
        } else if (this.moveLeft) {
            this.x -= this.velocity;
        }
    }

    handleWallCollision() {
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }
    }

    handleShooting() {
        
        if (this.image.src.includes("player1.png")) {
            if (this.shootPressed) {
                this.bulletController.shoot(this.x + this.width / 2, this.y, 2.5 , 20);
            }
        }
    
        if (this.image.src.includes("player2.png")) {
            if (this.shootPressed) {
                this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 15);
            }
        }

        if (this.image.src.includes("player3.png")) {
            if (this.shootPressed) {
                this.bulletController.doubleShoot(this.x + 10, this.y, this.x + this.width -10, this.y, 3, 15);
            }
        }

        if (this.image.src.includes("player4.png")) {
            if (this.shootPressed) {
                const velocities = [
                    { x: -1, y: -3.5 },  // balra fel
                    { x: 0, y: -4 }, // egyenesen fel
                    { x: 1, y: -3.5 }, // jobbra fel
                ];
        
                this.bulletController.TripleShoot(this.x + this.width / 2, this.y, velocities, 15);
            }
        }

    }

    handleKeyDown = (event) => {
        switch (event.code) {
            case "ArrowRight":
                this.moveRight = true;
                break;
            case "ArrowLeft":
                this.moveLeft = true;
                break;
            case "Space":
                event.preventDefault(); // space megnyomása esetén nem ugrik az oldal aljára
                this.shootPressed = true;
                break;
            case "ArrowUp":
                event.preventDefault(); // fel nyíl megnyomása esetén nem mozdul el a kép
                break;
            case "ArrowDown":
                event.preventDefault(); // le nyíl megnyomása esetén nem mozdul el a kép
                break;
            default:
                break;
        }
    };

    handleKeyUp = (event) => {
        switch (event.code) {
            case "ArrowRight":
                this.moveRight = false;
                break;
            case "ArrowLeft":
                this.moveLeft = false;
                break;
            case "Space":
                event.preventDefault();
                this.shootPressed = false;
                break;
            default:
                break;
        }
    };
}
