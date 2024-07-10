let altoGestor = 100;
let anchoGestor = 400;



class GestorSenial {
    constructor(ampMin, ampMax) {
        this.ampMin = ampMin;
        this.ampMax = ampMax;
        this.ampBase = 0;
        this.amp = 0;
        this.filtrada = 0;
    }

    actualizar(amp) {
        this.amp = amp;
        this.filtrada = map(amp, this.ampMin, this.ampMax, 0, 1);
    }

    dibujar() {
        noFill();
        stroke(0);
        rect(10, 10, 20, 100);
        fill(0);
        rect(10, 110 - this.filtrada * 100, 20, this.filtrada * 100);
    }
}