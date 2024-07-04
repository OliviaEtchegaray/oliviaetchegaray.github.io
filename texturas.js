class Texturas {
    constructor(imagenes, canvasWidth, canvasHeight) {
        this.imagenes = [];
        this.texturasCalidas = [];
        this.texturasFrias = [];
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.textureSize = 155;
        this.textureSpacing = -3;
        this.positions = [];
        this.currentSizes = [];
        this.targetSizes = [];

        const colores = [
            color(205, 99, 36, 190),   // Naranja
            color(205, 40, 36, 190),   // Rojo
            color(244, 200, 102, 190), // Amarillo
            color(220, 126, 130, 190), // Rosa
            color(143, 8, 255, 190),   // Violeta
            color(93, 118, 255, 190),  // Azul
            color(112, 166, 255, 190), // Celeste
            color(93, 140, 47, 190),   // Verde
            color(0, 0, 0, 190)        // Negro
        ];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < imagenes.length; j++) {
                let img = imagenes[j];
                let filtro = colores[j % colores.length];
                let imgFiltrada = this.cambiarColor(img, filtro);
                this.imagenes.push(imgFiltrada);

                if (j % colores.length <= 3) {
                    this.texturasCalidas.push(imgFiltrada);
                } else {
                    this.texturasFrias.push(imgFiltrada);
                }
            }
        }

        this.reubicarTexturas();
    }

    reubicarTexturas() {
        this.positions = [];
        this.currentSizes = [];
        this.targetSizes = [];
        this.imagenes.forEach((img, index) => {
            let top = Math.random() * (this.canvasHeight - this.textureSize - this.textureSpacing) + this.textureSpacing;
            let left = Math.random() * (this.canvasWidth - this.textureSize - this.textureSpacing) + this.textureSpacing;
            this.positions.push({ img, top, left, type: this.getType(img) });
            this.currentSizes.push(this.textureSize);
            this.targetSizes.push(this.textureSize);
        });
    }

    reubicarTexturasAleatorio() {
        this.positions.forEach(pos => {
            pos.top = Math.random() * (this.canvasHeight - this.textureSize - this.textureSpacing) + this.textureSpacing;
            pos.left = Math.random() * (this.canvasWidth - this.textureSize - this.textureSpacing) + this.textureSpacing;
        });
    }
    adjustTextureSizes(soundType) {
        this.positions.forEach((pos, index) => {
            if (soundType === 'agudo') {
                if (this.isTexturaFria(pos.type)) {
                    this.targetSizes[index] = this.textureSize * 1.5; 
                } else if (this.isTexturaCalida(pos.type)) {
                    this.targetSizes[index] = this.textureSize * 0.7; 
                }
            } else if (soundType === 'grave') {
                if (this.isTexturaCalida(pos.type)) {
                    this.targetSizes[index] = this.textureSize * 1.5; 
                } else if (this.isTexturaFria(pos.type)) {
                    this.targetSizes[index] = this.textureSize * 0.7; 
                }
            }
        });
    }

    restaurarTamanosIniciales() {
        this.targetSizes = this.targetSizes.map(size => this.textureSize); 
    }

    ajustarTamanoTexturasNormal() {
   
        this.targetSizes = this.targetSizes.map(() => this.textureSize);
    }
    draw(opacity) {
        this.positions.forEach((pos, index) => {
    
            this.currentSizes[index] = lerp(this.currentSizes[index], this.targetSizes[index], 0.05);

            push();
            translate(pos.left + (this.textureSize - this.currentSizes[index]) / 2, pos.top + (this.textureSize - this.currentSizes[index]) / 2);
            tint(255, opacity * 255); 
            image(pos.img, 0, 0, this.currentSizes[index], this.currentSizes[index]);
            pop();
        });
    }

    cambiarColor(img, colorBase) {
        let buffer = createGraphics(img.width, img.height);
        

        buffer.push();
        buffer.drawingContext.shadowOffsetX = 5;
        buffer.drawingContext.shadowOffsetY = 5;
        buffer.drawingContext.shadowBlur = 10;
        buffer.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
        
        buffer.image(img, 0, 0);
        buffer.pop();
        
        buffer.loadPixels();

        for (let i = 0; i < buffer.pixels.length; i += 4) {
            let r = red(colorBase);
            let g = green(colorBase);
            let b = blue(colorBase);
            let a = alpha(colorBase); 
            buffer.pixels[i] = lerp(buffer.pixels[i], r, a / 255);
            buffer.pixels[i + 1] = lerp(buffer.pixels[i + 1], g, a / 255);
            buffer.pixels[i + 2] = lerp(buffer.pixels[i + 2], b, a / 255);
        }

        buffer.updatePixels();
        return buffer;
    }

    isTexturaCalida(type) {
        return type === 'calida';
    }

    isTexturaFria(type) {
        return type === 'fria';
    }

    getType(img) {
        if (this.texturasCalidas.includes(img)) {
            return 'calida';
        } else {
            return 'fria';
        }
    }
}