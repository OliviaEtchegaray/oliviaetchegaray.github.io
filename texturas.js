class Texturas {
    constructor(imagenes, canvasWidth, canvasHeight) {
        this.imagenes = [];
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.textureSize = 150; 
        this.textureSpacing = -20; 
        this.positions = [];
        this.currentSizes = [];
        this.targetSizes = [];

        const colores = [
            { name: 'naranja', color: color(205, 99, 36) },
            { name: 'rojo', color: color(226, 58, 41) },
            { name: 'amarillo', color: color(241, 193, 53) },
            { name: 'rosa', color: color(185, 127, 154) },
            { name: 'violeta', color: color(143, 8, 255, 190) },
            { name: 'azul', color: color(93, 118, 255, 190) },
            { name: 'celeste', color: color(29, 95, 185) },
            { name: 'verde', color: color(92, 178, 44) },
            { name: 'lima', color: color(141, 163, 52) },
            { name: 'negro', color: color(0, 0, 0) },
            { name: 'naranja fuerte', color: color(207, 11, 40) },
            { name: 'rojo extraño', color: color(223, 77, 84) },
            { name: 'verde agua', color: color(91, 165, 129) }
        ];

        this.tiposTextura = {
            'rojo': { initialSize: 150, growFactor: 0.7, shrinkFactor: 0.5 },
            'azul': { initialSize: 140, growFactor: 0.5, shrinkFactor: 0.3 },
            'naranja': { initialSize: 120, growFactor: 1.5, shrinkFactor: 0.5 },
            'verde': { initialSize: 150, growFactor: 0.8, shrinkFactor: 0.5 },
            'rosa': { initialSize: 120, growFactor: 1, shrinkFactor: 0.7 },
            'violeta': { initialSize: 150, growFactor: 1, shrinkFactor: 0.7 },
            'celeste': { initialSize: 150, growFactor: 1.2, shrinkFactor: 0.5 },
            'lima': { initialSize: 140, growFactor: 0.7, shrinkFactor: 0.4 },
            'amarillo': { initialSize: 150, growFactor: 0.7, shrinkFactor: 0.3 },
            'negro': { initialSize: 145, growFactor: 0.8, shrinkFactor: 0.7 },
            'naranja fuerte': { initialSize: 150, growFactor: 1.5, shrinkFactor: 1 },
            'rojo extraño': { initialSize: 120, growFactor: 1, shrinkFactor: 0.7 },
            'verde agua': { initialSize: 120, growFactor: 1.2, shrinkFactor: 0.5 }
        };

        for (let j = 0; j < imagenes.length; j++) {
            let img = imagenes[j];
            let colorData = colores[j % colores.length];

            // Imagen original con su filtro
            let imgFiltradaOriginal = this.cambiarColor(img, colorData.color);
            this.imagenes.push({ img: imgFiltradaOriginal, tipo: colorData.name });

            // Imagen duplicada con filtro diferente
            let imgFiltradaDuplicada = this.cambiarColor(img, colores[(j + 1) % colores.length].color);
            this.imagenes.push({ img: imgFiltradaDuplicada, tipo: colores[(j + 1) % colores.length].name });

            // Imagen triplicada con otro filtro diferente
            let imgFiltradaTriplicada = this.cambiarColor(img, colores[(j + 2) % colores.length].color);
            this.imagenes.push({ img: imgFiltradaTriplicada, tipo: colores[(j + 2) % colores.length].name });
        }

        this.reubicarTexturas();
    }

    reubicarTexturas() {
        this.positions = [];
        this.currentSizes = [];
        this.targetSizes = [];
        this.imagenes.forEach(({ img, tipo }, index) => {
            let top = Math.random() * (this.canvasHeight - this.textureSize - this.textureSpacing) + this.textureSpacing;
            let left = Math.random() * (this.canvasWidth - this.textureSize - this.textureSpacing) + this.textureSpacing;
            this.positions.push({ img, top, left, type: tipo });
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
            const { initialSize, growFactor, shrinkFactor } = this.tiposTextura[pos.type];
    
            if (soundType === 'agudo') {
                if (['naranja', 'naranja fuerte', 'rojo extraño', 'rojo', 'rosa', 'amarillo'].includes(pos.type)) {
                    this.targetSizes[index] = initialSize * shrinkFactor;
                } else {
                    this.targetSizes[index] = initialSize * growFactor;
                }
            } else if (soundType === 'grave') {
                if (['naranja', 'naranja fuerte', 'rojo extraño', 'rojo', 'rosa', 'amarillo'].includes(pos.type)) {
                    this.targetSizes[index] = initialSize * growFactor;
                } else {
                    this.targetSizes[index] = initialSize * shrinkFactor;
                }
            }
    
        });
    }

    restaurarTamanosIniciales() {
        this.targetSizes = this.positions.map((pos) => {
            return this.tiposTextura[pos.type].initialSize;
        });
    }

    ajustarTamanoTexturasNormal() {
        this.restaurarTamanosIniciales();
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
    
        buffer.noSmooth(); 
    
        buffer.push();
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
}