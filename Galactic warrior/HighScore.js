export default class Highscore {
    constructor(canvas, ctx, background, menuCallback, highscoremenuactive) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.backButton = new Image();
        this.backButton.src = "images/ikon/back.png";
        this.resetButton = new Image();
        this.resetButton.src = "images/ikon/reset.png";
        this.highscoreImage = new Image();
        this.highscoreImage.src = "images/ikon/highscore.png";
        this.isMenuActive = highscoremenuactive;

        const savedScores = localStorage.getItem('highscores');
        if (savedScores) {
            this.highscores = JSON.parse(savedScores);
        } else {
            this.highscores = {
                1: { score: 0, complete: false }, // Level 1
                2: { score: 0, complete: false }, 
                3: { score: 0, complete: false },
                4: { score: 0, complete: false }, 
                5: { score: 0, complete: false }
            };
        }

        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 820 && x <= 900 && y >= 150 && y <= 230 && this.isMenuActive === true) {
                this.resetScore();
            }

            if (x >= 910 && x <= 974 && y >= 10 && y <= 74 && this.isMenuActive === true) {
                this.menuCallback(); // menu() visszahívása
                this.isMenuActive = false;
            }

        };

        this.canvas.addEventListener('click', clickHandler);
    }

draw() {
    this.isMenuActive = true;
    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
//    console.log(localStorage.getItem('highscores'));

    this.ctx.fillStyle = "white";
    this.ctx.font = "50px sans-serif";
    this.ctx.fillText("Highscore", 500, 80);

    this.drawButtonBack();

    this.ctx.drawImage(this.highscoreImage, 700, 300, 250, 250);

    this.ctx.font = "40px sans-serif";
    this.ctx.fillText("Reset:", 750, 200);
    this.ctx.drawImage(this.resetButton, 820, 150, 80, 80);

    const levelX = 200;
    const scoreX = 330;
    const completeX = 500;
    
    // szint Y pozíciók (egymás alatt)
    const levelY = [200, 280, 360, 440, 520];

    this.ctx.fillStyle = "gold";
    this.ctx.font = "40px sans-serif";
    for (let i = 1; i <= 5; i++) {
        this.ctx.fillText("Level " + i + ":", levelX, levelY[i - 1]);
        this.ctx.fillText(this.highscores[i].score, scoreX, levelY[i - 1]);
        const status = this.highscores[i].complete ? "Completed" : "not done"; // status meghatározása
        this.ctx.fillText(status, completeX, levelY[i - 1]); 
    }

}

setHighscore(level, score, complete) {
    if (level >= 1 && level <= 5) {
        if (score > this.highscores[level].score) {
            this.highscores[level].score = score; 
            this.highscores[level].complete = complete;

            // Adatok mentése a localStorage-ba
            localStorage.setItem('highscores', JSON.stringify(this.highscores));
        }
    }
}

resetScore() {
    for (let level = 1; level <= 5; level++) {
        this.highscores[level].score = 0;
        this.highscores[level].complete = false;
    }

    // highscores törlése a localStorage-ból
    localStorage.removeItem('highscores');
    this.draw();
}

drawButtonBack() {
    this.ctx.drawImage(this.backButton, 910, 10, 64, 64);
}


}