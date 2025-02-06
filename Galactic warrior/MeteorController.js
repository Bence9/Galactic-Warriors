import Meteor from "./Meteor.js";

export default class MeteorController {
    meteors = [];
    timeTillNextMeteorAllowed = 10;

    constructor(canvas, maxMeteorsAtTime, soundEnabled) {

        this.canvas = canvas;
        this.maxMeteorssAtTime = maxMeteorsAtTime;
        this.soundEnabled = soundEnabled;

        this.meteorBoom = new Audio("sounds/meteorbum.mp3");
        this.meteorBoom.volume = 1;

    }

    draw(ctx) {
        // kirajzolás a canvas x = 0 és a width, a canvas y = 0 és height közé
        this.meteors = this.meteors.filter(meteor => meteor.y + meteor.width > 0 && meteor.y <= this.canvas.height && meteor.x + meteor.width < this.canvas.width);

        this.meteors.forEach(meteor => meteor.draw(ctx));

        if (this.timeTillNextMeteorAllowed > 0) {
            this.timeTillNextMeteorAllowed--;
        }
    }

    drop(x, y, Yvelocity, timeTillNextMeteorsAllowed) {
        if (this.timeTillNextMeteorAllowed <= 0 && this.meteors.length < this.maxMeteorssAtTime) {
            const meteor = new Meteor(this.canvas, x, y, Yvelocity);
            this.meteors.push(meteor);

            this.timeTillNextMeteorAllowed = timeTillNextMeteorsAllowed;
        }
    }

    collideWith(sprite) {
        const MeteorThatHitSpriteIndex = this.meteors.findIndex((meteor) =>
            meteor.collideWith(sprite)
        );

        if (MeteorThatHitSpriteIndex >= 0) {
            this.meteors.splice(MeteorThatHitSpriteIndex, 1);
            if(this.soundEnabled){
                this.meteorBoom.currentTime = 0;
                this.meteorBoom.play();
            }
            return true;
        } else {
            return false;
        }
    }

    // Clear the gifts off the screen
    clearMeteors() {
        this.meteors = [];
    }

}