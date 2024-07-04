class Fondo {
    constructor(FondoColor, fadeSpeed) {
        this.FondoColor = FondoColor;
        this.fadeSpeed = fadeSpeed;
        this.opacity = 0;
        this.currentColorIndex = 0;
        this.numColors = FondoColor.length;
        this.colorsShuffled = false;
        this.anteriorHaySonido = false;
    }

    initBackground() {
        this.updateBackground();
    }

    updateBackground() {

        if (haySonido) {
            this.opacity = lerp(this.opacity, 1, this.fadeSpeed);
            this.colorsShuffled = false;
            
            if (!this.anteriorHaySonido) {

                this.currentColorIndex = (this.currentColorIndex + 1) % this.numColors;
                this.anteriorHaySonido = true;
            }
        } else {
   
            this.opacity = lerp(this.opacity, 0, this.fadeSpeed);
            this.anteriorHaySonido = false;
        }

        if (this.opacity === 0 && !this.colorsShuffled) {
            this.shuffleColors();
            this.colorsShuffled = true;
        }


        background(255);
        noStroke();
        fill(
            red(this.FondoColor[this.currentColorIndex]),
            green(this.FondoColor[this.currentColorIndex]),
            blue(this.FondoColor[this.currentColorIndex]),
            this.opacity * 255
        );
        rect(0, 0, width, height);
    }

    draw() {
        this.updateBackground();
    }

    shuffleColors() {

        for (let i = this.FondoColor.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.FondoColor[i], this.FondoColor[j]] = [this.FondoColor[j], this.FondoColor[i]];
        }
    }
}