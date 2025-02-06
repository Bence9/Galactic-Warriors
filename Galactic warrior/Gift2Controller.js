import Gift2 from "./Gift2.js";

export default class Gift2Controller {
    gifts = [];
    timeTillNextGiftAllowed = 10;

    constructor(canvas, maxGiftsAtTime) {

        this.canvas = canvas;
        this.maxGiftsAtTime = maxGiftsAtTime;

    }

    draw(ctx) {
        // kirajzolás a canvas x = 0 és a width, a canvas y = 0 és height közé
        this.gifts = this.gifts.filter(gift => gift.y + gift.width > 0 && gift.y <= this.canvas.height && gift.x + gift.width < this.canvas.width);

        this.gifts.forEach(gift => gift.draw(ctx));

        if (this.timeTillNextGiftAllowed > 0) {
            this.timeTillNextGiftAllowed--;
        }
    }

    drop(x, y, Yvelocity, Xvelocity, timeTillNextGiftAllowed) {
        if (this.timeTillNextGiftAllowed <= 0 && this.gifts.length < this.maxGiftsAtTime) {
            const gift = new Gift2(this.canvas, x, y, Yvelocity, Xvelocity);
            this.gifts.push(gift);

            this.timeTillNextGiftAllowed = timeTillNextGiftAllowed;
        }
    }

    collideWith(sprite) {
        const GiftThatHitSpriteIndex = this.gifts.findIndex((gift) =>
            gift.collideWith(sprite)
        );

        if (GiftThatHitSpriteIndex >= 0) {
            this.gifts.splice(GiftThatHitSpriteIndex, 1);
            return true;
        } else {
            return false;
        }
    }

    // giftek eltüntetése a képernyőről
    clearGifts() {
        this.gifts = [];
    }

}