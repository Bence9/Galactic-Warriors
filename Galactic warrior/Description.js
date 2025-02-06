export default class Description {
    constructor(canvas, ctx, background, menuCallback) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.background = background;
        this.menuCallback = menuCallback; 
        this.buttonImage = new Image();
        this.buttonImage.src = "images/ikon/back.png";
        this.descriptionImage = new Image();
        this.descriptionImage.src = "images/ikon/description.png";

        const clickHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            if (x >= 910 && x <= 974 && y >= 10 && y <= 74) {
                this.menuCallback(); // menu() visszahívása
            }
        };

        this.canvas.addEventListener('click', clickHandler);
    }

draw() {
    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "50px sans-serif";
    this.ctx.fillText("Description", 500, 80);

    this.drawButtonBack();

    var text="Galactic Warrior is a fun and exciting arcade game where players control a spaceship, avoiding enemy attacks and dangerous meteors. As the game goes on, the enemies become stronger, requiring quick reactions and accurate shooting. Players can customize their ships and battlefields, creating a more personal and challenging experience. By collecting Rubies, the game's currency, players can unlock special features and improve their gameplay. With its thrilling gameplay and strategic elements, Galactic Warrior stands out as a top space combat game, where players' skills and tactics determine their survival in the huge and dangerous universe.";

    var maxWidth = 450;
    var lineHeight = 30;
    var x = 500;
    var y = 150;

    this.drawWrappedText(text, x, y, maxWidth, lineHeight);

    this.ctx.drawImage(this.descriptionImage, 50, 250, 150, 150);
    this.ctx.drawImage(this.descriptionImage, 800, 250, 150, 150);
}

drawButtonBack() {
    this.ctx.drawImage(this.buttonImage, 910, 10, 64, 64);
}

drawWrappedText(text, x, y, maxWidth, lineHeight) {
    this.ctx.font = "20px sans-serif";
    var words = text.split(' ');
    var line = '';
    var lines = [];

    words.forEach((word) => {
        var testLine = line + word + ' ';
        var metrics = this.ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    });

    lines.push(line);

    lines.forEach((line, index) => {
        this.ctx.font = "25px Arial"; // szöveg méretezése
        this.ctx.fillStyle = "white";
        this.ctx.fillText(line, x, y + (index * lineHeight));
    });
}


}