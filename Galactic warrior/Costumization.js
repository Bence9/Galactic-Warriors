export default class Costumization {
    constructor(canvas, ctx, menuCallback, rubin, costumizationMenuActive) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = new Image(); 
        this.background.src="images/background/space.png";
        this.menuCallback = menuCallback; 
        this.rubin = rubin;
        this.buttonBackImage = new Image();
        this.buttonBackImage.src = "images/ikon/back.png";
        this.playerBulletColor = "white";
        this.enemyBulletColor = "red";
        this.selectedPlayer = "images/player/player1.png";
        this.playerName = "Azure Vortex";
        this.field = "images/background/space.png";
        this.fieldName = "Space";
        this.costumizeImage = new Image();
        this.costumizeImage.src = "images/ikon/costumize.png";
        this.isMenuActive = costumizationMenuActive;

        this.player1Bought = true;
        this.player2Bought = false;
        this.player3Bought = false;
        this.player4Bought = false;
        this.field1Bought = false;
        this.field2Bought = true;
        this.field3Bought = false;
        this.field4Bought = false;
    
        // Négyzetek méretei és az eltolás mértéke
        this.squareSize = 30; 
        this.squareGap = 15; 
    
        // Eseményfigyelő hozzáadása a konstruktorban a dinamikus kirajzolás miatt
        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            // Visszalépés a menube
            if (x >= 910 && x <= 974 && y >= 10 && y <= 74 && this.isMenuActive === true) {
                this.menuCallback();
                this.stopRubyAnimation();
                this.isMenuActive = false;
            }
        
            // Player bullet color beállítása
            if (x >= 450 && x <= 450 + this.squareSize  && y >= 130 && y <= 170 && this.isMenuActive === true) {
                this.playerBulletColor = "blue";
                this.draw();
            } else if (x >= 450 + this.squareSize + this.squareGap && x <= 450 + 2 * this.squareSize + this.squareGap && y >= 130 && y <= 170 && this.isMenuActive === true) {
                this.playerBulletColor = "red";
                this.draw();
            } else if (x >= 450 + 2 * (this.squareSize + this.squareGap) && x <= 450 + 3 * this.squareSize + 2 * this.squareGap && y >= 130 && y <= 170 && this.isMenuActive === true) {
                this.playerBulletColor = "#39FF14"; // Zöld
                this.draw();
            } else if (x >= 450 + 3 * (this.squareSize + this.squareGap) && x <= 450 + 4 * this.squareSize + 3 * this.squareGap && y >= 130 && y <= 170 && this.isMenuActive === true) {
                this.playerBulletColor = "yellow";
                this.draw();
            } else if (x >= 450 + 4 * (this.squareSize + this.squareGap) && x <= 450 + 5 * this.squareSize + 4 * this.squareGap && y >= 130 && y <= 170 && this.isMenuActive === true) {
                this.playerBulletColor = "#e01fd0"; //lila
                this.draw();
            } else if (x >= 450 + 5 * (this.squareSize + this.squareGap) && x <= 450 + 6 * this.squareSize + 5 * this.squareGap && y >= 130 && y <= 170 && this.isMenuActive === true) {
                this.playerBulletColor = "white";
                this.draw();
            }

            // Enemy bullet color beállítása
            if (x >= 450 && x <= 450 + this.squareSize && y >= 230 && y <= 270 && this.isMenuActive === true) {
                this.enemyBulletColor = "blue";
                this.draw();
            } else if (x >= 450 + this.squareSize + this.squareGap && x <= 450 + 2 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270 && this.isMenuActive === true) {
                this.enemyBulletColor = "red";
                this.draw();
            } else if (x >= 450 + 2 * (this.squareSize + this.squareGap) && x <= 450 + 3 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270 && this.isMenuActive === true) {
                this.enemyBulletColor = "#39FF14"; // Zöld
                this.draw();
            } else if (x >= 450 + 3 * (this.squareSize + this.squareGap) && x <= 450 + 4 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270 && this.isMenuActive === true) {
                this.enemyBulletColor = "yellow";
                this.draw();
            } else if (x >= 450 + 4 * (this.squareSize + this.squareGap) && x <= 450 + 5 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270 && this.isMenuActive === true) {
                this.enemyBulletColor = "#e01fd0"; //lila
                this.draw();
            } else if (x >= 450 + 5 * (this.squareSize + this.squareGap) && x <= 450 + 6 * (this.squareSize + this.squareGap) && y >= 230 && y <= 270 && this.isMenuActive === true) {
                this.enemyBulletColor = "white";
                this.draw();
            }

            // Player buyer
            if (x >= 20 && x <= 70 && y >= 420 && y <= 440 && this.player1Bought === false && this.isMenuActive === true) {
                this.player1Bought = true;
                // player1 = free ship
                this.draw(); 
            } else if (x >= 190 && x <= 240 && y >= 420 && y <= 440 && this.player2Bought === false && this.isMenuActive === true) {
                if (this.canAfford(50)) {
                    this.player2Bought = true;
                    this.decreaseRubin(50);
                    this.draw();
                }
            } else if (x >= 20 && x <= 70 && y >= 520 && y <= 540 && this.player3Bought === false && this.isMenuActive === true) {
                if (this.canAfford(75)) {
                    this.player3Bought = true;
                    this.decreaseRubin(75);
                    this.draw();
                }
            } else if (x >= 190 && x <= 240 && y >= 520 && y <= 540 && this.player4Bought === false && this.isMenuActive === true) {
                if (this.canAfford(100)) {
                    this.player4Bought = true;
                    this.decreaseRubin(100);
                    this.draw();
                }
            }

            // Player selector
            if (x >= 20 && x <= 70 && y >= 445 && y <= 465 && this.player1Bought && this.isMenuActive === true) {
                this.selectedPlayer = "images/player/player1.png";
                this.playerName = "Azure Vortex";
                this.draw(); 
            } else if (x >= 190 && x <= 240 && y >= 445 && y <= 465 && this.player2Bought && this.isMenuActive === true) {
                this.selectedPlayer = "images/player/player2.png";
                this.playerName = "Emerald Wing";
                this.draw(); 
            } else if (x >= 20 && x <= 70 && y >= 545 && y <= 565 && this.player3Bought && this.isMenuActive === true) {
                this.selectedPlayer = "images/player/player3.png";
                this.playerName = "Titanium Dragon";
                this.draw(); 
            } else if (x >= 190 && x <= 240 && y >= 545 && y <= 565 && this.player4Bought && this.isMenuActive === true) {
                this.selectedPlayer = "images/player/player4.png";
                this.playerName = "Scarlet Phoenix";
                this.draw(); 
            }


            // Field buyer
            if (x >= 645 && x <= 695 && y >= 400 && y <= 420 && this.field1Bought === false && this.isMenuActive === true) {
                if (this.canAfford(50)) {
                    this.field1Bought = true;
                    this.decreaseRubin(50);
                    this.draw();
                }
            } else if (x >= 835 && x <= 885 && y >= 400 && y <= 420 && this.field2Bought === false && this.isMenuActive === true) {
                    this.field2Bought = true;
                    // space = free
                    this.draw();
            } else if (x >= 645 && x <= 695 && y >= 520 && y <= 540 && this.field3Bought === false && this.isMenuActive === true) {
                if (this.canAfford(100)) {
                    this.field3Bought = true;
                    this.decreaseRubin(100);
                    this.draw();
                }
            } else if (x >= 835 && x <= 885 && y >= 520 && y <= 540 && this.field4Bought === false && this.isMenuActive === true) {
                if (this.canAfford(150)) {
                    this.field4Bought = true;
                    this.decreaseRubin(150);
                    this.draw();
                }
            }

            // Field selector
            if (x >= 645 && x <= 695 && y >= 425 && y <= 445 && this.field1Bought && this.isMenuActive === true) {
                this.field = "images/background/desert.png";
                this.fieldName = "Desert";
                this.draw();
            } else if (x >= 835 && x <= 885 && y >= 425 && y <= 445 && this.field2Bought && this.isMenuActive === true) {
                this.field = "images/background/space.png";
                this.fieldName = "Space";
                this.draw();
            } else if (x >= 645 && x <= 695 && y >= 545 && y <= 565 && this.field3Bought && this.isMenuActive === true) {
                this.field = "images/background/cosmic.png";
                this.fieldName = "Cosmic";
                this.draw();
            } else if (x >= 835 && x <= 885 && y >= 545 && y <= 565 && this.field4Bought && this.isMenuActive === true) {
                this.field = "images/background/earth.jpg";
                this.fieldName = "Earth";
                this.draw();
            }
    };

    this.canvas.addEventListener('click', clickHandler);

}

// Ellenőrzi, hogy a rendelkezünk-e elegendő rubinnal a vásárláshoz
canAfford(amount) {
    return this.rubin >= amount;
}

updateRubin(newRubin) {
    this.rubin = newRubin;
}

decreaseRubin(amount) {
    this.rubin -= amount;
    this.updateRubin(this.rubin);
}

draw() {
    this.isMenuActive = true;
    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "50px sans-serif";
    this.ctx.fillText("Costumizaton", 500, 80);

    this.drawButtonBack();
    this.drawPlayerBulletColor();
    this.drawEnemyBulletColor();
    this.drawPlayers();
    this.drawFields();
    this.drawBuyButtons();
    this.drawSelectButtons();
    this.DrawRubyText();
    
    this.ctx.fillStyle = this.playerBulletColor;
    this.ctx.font = "30px sans-serif";
    this.ctx.fillText("Player bullet color: ", 300, 155);

    this.ctx.fillStyle = this.enemyBulletColor;
    this.ctx.font = "30px sans-serif";
    this.ctx.fillText("Enemy bullet color: ", 300, 255);

    this.ctx.fillStyle = "orange";
    this.ctx.font = "30px sans-serif";
    this.ctx.fillText("Choose player: ", 150, 310);

    this.ctx.fillStyle = "orange";
    this.ctx.font = "25px sans-serif";
    this.ctx.fillText(this.playerName + " selected", 150, 350);

    this.ctx.fillStyle = "orange";
    this.ctx.font = "30px sans-serif";
    this.ctx.fillText("Choose field: ", 800, 300);

    this.ctx.fillStyle = "orange";
    this.ctx.font = "25px sans-serif";
    this.ctx.fillText(this.fieldName + " selected", 800, 330);

 
    this.ctx.drawImage(this.costumizeImage, 380, 340, 220, 220);

    this.drawAnimatedRuby();

    this.ctx.fillStyle = "white";
    this.ctx.font = "30px sans-serif";
    this.ctx.fillText("x" + this.rubin, 810, 177);
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(755, 142, 150, 50);
    this.ctx.lineWidth = 1;

}


animateRuby(xPos, yPos, scale) {
    const spriteWidth = 24;
    const spriteHeight = 24;
    let frameIndex = 0;
    let count = 0;

    const spriteSheet = new Image();
    spriteSheet.src = "images/ikon/ruby.png";

    const animate = () => {
        this.ctx.drawImage(
            spriteSheet,
            frameIndex * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            xPos,
            yPos,
            spriteWidth * scale,
            spriteHeight * scale
        );

        count++;

        if (count >= 16) { // animáció gyorsasága itt beállítható
            frameIndex++;
            count = 0;
        }

        if (frameIndex > 6) {
             frameIndex = 0;
        }
    };

    const frame = () => {
        if (this.animationRun) {
            animate();
            requestAnimationFrame(frame);
        }
    };

    spriteSheet.onload = () => {
        this.animationRun = true;
        frame();
    };
}

stopRubyAnimation() {
    this.animationRun = false;
}


drawPlayers(){
    const image1 = new Image();
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(75, 380, 90, 90);
    image1.src = "images/player/player1.png";
    image1.onload = () => {
    this.ctx.drawImage(image1, 80, 380, 80, 80);
    };

    const image2 = new Image();
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(245, 380, 90, 90);
    image2.src = "images/player/player2.png";
    image2.onload = () => {
    this.ctx.drawImage(image2, 250, 380, 80, 80);
    };

    const image3 = new Image();
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(75, 480, 90, 90);
    image3.src = "images/player/player3.png";
    image3.onload = () => {
    this.ctx.drawImage(image3, 80, 480, 80, 80);
    };

    const image4 = new Image();
    this.ctx.strokeStyle = "red";
    this.ctx.strokeRect(245, 480, 90, 90);
    image4.src = "images/player/player4.png";
    image4.onload = () => {
    this.ctx.drawImage(image4, 250, 480, 80, 80);
    };

}

drawBuyButtons() {
    this.ctx.font = "14px Arial";

    const buttonWidth = 50;
    const buttonHeight = 20;

    // BUY gombok a Player képekhez
    this.drawMiniButton(20, 420, buttonWidth, buttonHeight, "BUY", "green");
    this.drawMiniButton(190, 420, buttonWidth, buttonHeight, "BUY", "green");
    this.drawMiniButton(20, 520, buttonWidth, buttonHeight, "BUY", "green");
    this.drawMiniButton(190, 520, buttonWidth, buttonHeight, "BUY", "green");

    if (this.player1Bought) {
        this.drawMiniButton(20, 420, buttonWidth, buttonHeight, "Bought", "#f05107"); // narancssárga
    }
    if (this.player2Bought) {
        this.drawMiniButton(190, 420, buttonWidth, buttonHeight, "Bought", "#f05107");
    }
    if (this.player3Bought) {
        this.drawMiniButton(20, 520, buttonWidth, buttonHeight, "Bought", "#f05107");
    }
    if (this.player4Bought) {
        this.drawMiniButton(190, 520, buttonWidth, buttonHeight, "Bought", "#f05107");
    }

    // BUY gombok a Field képekhez
    this.drawMiniButton(645, 400, buttonWidth, buttonHeight, "BUY", "green");
    this.drawMiniButton(835, 400, buttonWidth, buttonHeight, "BUY", "green");
    this.drawMiniButton(645, 520, buttonWidth, buttonHeight, "BUY", "green");
    this.drawMiniButton(835, 520, buttonWidth, buttonHeight, "BUY", "green");

    if (this.field1Bought) {
        this.drawMiniButton(645, 400, buttonWidth, buttonHeight, "Bought", "#f05107");
    }
    if (this.field2Bought) {
        this.drawMiniButton(835, 400, buttonWidth, buttonHeight, "Bought", "#f05107");
    }
    if (this.field3Bought) {
        this.drawMiniButton(645, 520, buttonWidth, buttonHeight, "Bought", "#f05107");
    }
    if (this.field4Bought) {
        this.drawMiniButton(835, 520, buttonWidth, buttonHeight, "Bought", "#f05107");
    }
}


drawSelectButtons() {
    this.ctx.font = "12px Arial";

    const buttonWidth = 50;
    const buttonHeight = 20;

    // Select gombok a player képekhez
    this.drawMiniButton(20, 445, buttonWidth, buttonHeight, "SELECT", "#1b71c2"); // blue
    this.drawMiniButton(190, 445, buttonWidth, buttonHeight, "SELECT", "#1b71c2");
    this.drawMiniButton(20, 545, buttonWidth, buttonHeight, "SELECT", "#1b71c2");
    this.drawMiniButton(190, 545, buttonWidth, buttonHeight, "SELECT", "#1b71c2");

    if(this.player1Bought === false){
        this.drawMiniButton(20, 445, buttonWidth, buttonHeight, "SELECT", "grey");
    }
    if(this.player2Bought === false){
        this.drawMiniButton(190, 445, buttonWidth, buttonHeight, "SELECT", "grey");
    }
    if(this.player3Bought === false){
        this.drawMiniButton(20, 545, buttonWidth, buttonHeight, "SELECT", "grey");
    }
    if(this.player4Bought === false){
        this.drawMiniButton(190, 545, buttonWidth, buttonHeight, "SELECT", "grey");
    }

    // SELECT gombok a Field képekhez
    this.drawMiniButton(645, 425, buttonWidth, buttonHeight, "SELECT", "#1b71c2");
    this.drawMiniButton(835, 425, buttonWidth, buttonHeight, "SELECT", "#1b71c2");
    this.drawMiniButton(645, 545, buttonWidth, buttonHeight, "SELECT", "#1b71c2");
    this.drawMiniButton(835, 545, buttonWidth, buttonHeight, "SELECT", "#1b71c2");

    if (this.field1Bought === false) {
        this.drawMiniButton(645, 425, buttonWidth, buttonHeight, "SELECT", "grey");
    }
    if (this.field2Bought === false) {
        this.drawMiniButton(835, 425, buttonWidth, buttonHeight, "SELECT", "grey");
    }
    if (this.field3Bought === false) {
        this.drawMiniButton(645, 545, buttonWidth, buttonHeight, "SELECT", "grey");
    }
    if (this.field4Bought === false) {
         this.drawMiniButton(835, 545, buttonWidth, buttonHeight, "SELECT", "grey");
    }

}

drawMiniButton(x, y, width, height, text, color) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = "black";

    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeRect(x, y, width, height);

    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, x + width / 2, y + height / 2 + 5);
}

drawFields(){

    const image5 = new Image();
    this.ctx.strokeStyle = "yellow";
    this.ctx.strokeRect(700, 350, 100, 100);
    image5.src = "images/background/desert.png";
    image5.onload = () => {
    this.ctx.drawImage(image5, 700, 350, 100, 100);
    };

    const image6 = new Image();
    this.ctx.strokeStyle = "yellow";
    this.ctx.strokeRect(890, 350, 100, 100);
    image6.src = "images/background/space.png";
    image6.onload = () => {
    this.ctx.drawImage(image6, 890, 350, 100, 100);
    };

    const image7 = new Image();
    this.ctx.strokeStyle = "yellow";
    this.ctx.strokeRect(700, 470, 100, 100);
    image7.src = "images/background/cosmic.png";
    image7.onload = () => {
    this.ctx.drawImage(image7, 700, 470, 100, 100);
    };
        
    const image8 = new Image();
    this.ctx.strokeStyle = "yellow";
    this.ctx.strokeRect(890, 470, 100, 100);
    image8.src = "images/background/earth.jpg";
    image8.onload = () => {
    this.ctx.drawImage(image8, 890, 470, 100, 100);
    };

}


drawButtonBack() {
    this.ctx.drawImage(this.buttonBackImage, 910, 10, 64, 64);
}

drawPlayerBulletColor() {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(450, 130, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(450 + this.squareSize + this.squareGap, 130, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "#39FF14";
    this.ctx.fillRect(450 + 2 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(450 + 3 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "#e01fd0";
    this.ctx.fillRect(450 + 4 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(450 + 5 * (this.squareSize + this.squareGap), 130, this.squareSize, this.squareSize);
}

drawEnemyBulletColor() {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(450, 230, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(450 + this.squareSize + this.squareGap, 230, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "#39FF14";
    this.ctx.fillRect(450 + 2 * (this.squareSize + this.squareGap), 230, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(450 + 3 * (this.squareSize + this.squareGap), 230, this.squareSize, this.squareSize);
    
    this.ctx.fillStyle = "#e01fd0";
    this.ctx.fillRect(450 + 4 * (this.squareSize + this.squareGap), 230, this.squareSize, this.squareSize);

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(450 + 5 * (this.squareSize + this.squareGap), 230 , this.squareSize, this.squareSize);
}

drawAnimatedRuby(){
    // A megszerzett rubint jelző animáció
    this.animateRuby(850, 150, 1.5);

    // player choose melletti animációk
    this.animateRuby(50, 390, 1);
    this.animateRuby(220, 390, 1);
    this.animateRuby(50, 490, 1);
    this.animateRuby(220, 490, 1);

    // field choose meletti animációk
    this.animateRuby(675, 370, 1);
    this.animateRuby(865, 370, 1);
    this.animateRuby(675, 490, 1); 
    this.animateRuby(865, 490, 1);
}

DrawRubyText() {
    // player
    this.drawTextToRuby(50, 410, "x0", 10);
    this.drawTextToRuby(220, 410, "x50", 15);
    this.drawTextToRuby(50, 510, "x75", 22);
    this.drawTextToRuby(220, 510, "x100", 22);

    // field
    this.drawTextToRuby(675, 390, "x50", 15);
    this.drawTextToRuby(865, 390, "x0", 10);
    this.drawTextToRuby(675, 510, "x100", 22);
    this.drawTextToRuby(865, 510, "x150", 22);  
}

drawTextToRuby(x, y, text, distance) {
    this.ctx.fillStyle = "white";  
    this.ctx.font = "22px Arial";
    this.ctx.fillText(text, x - distance, y);
}

    
}