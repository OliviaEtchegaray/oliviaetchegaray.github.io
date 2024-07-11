let monitorear = true;

const AMP_MIN = 0.01;
const AMP_MAX = 0.01;

let mic;
let pitch;
let audioContext;
let gestorAmp;
const model_url = "https://teachablemachine.withgoogle.com/models/fk3o_GpeA/model.json";

let haySonido;
let antesHabiaSonido = false;

let fondo;
let texturas;
let imgFondo;
const FondoColor = ['#3767A6', '#508C2C', '#E63D30', '#F4B703'];
const fadeSpeed = 0.02;
const slowFadeSpeed = 0.005;
let imagenes = [];

let classifier;

let aplausoTimeout;
const aplausoDuration = 2000; 
let ultimoAplauso = 0; 
const tiempoEntreReubicacion = 1000; 
let reubicacionRealizada = false;

let silencioTimeout;
const silencioActivationTime = 3000; 

let tiempoSilencio = 0; 
let tiempoAplauso = 0; 

function preload() {
    for (let n = 1; n <= 50; n++) {
        let img = loadImage('libraries/t' + n + '.png');
        imagenes.push(img);
    }
    
    imgFondo = loadImage('libraries/texturafondo.jpg');
    console.log('Imagen de fondo cargada correctamente');
    classifier = ml5.soundClassifier(model_url, modelReady);
}

function setup() {
    createCanvas(600, 700);
    background(255);

    fondo = new Fondo(FondoColor, fadeSpeed);
    fondo.initBackground();

    texturas = new Texturas(imagenes, width, height);

    audioContext = getAudioContext();
    mic = new p5.AudioIn();
    mic.start();

    userStartAudio();

    gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);

    antesHabiaSonido = false;
}

function draw() {
    let vol = mic.getLevel();
    gestorAmp.actualizar(vol);

    haySonido = gestorAmp.filtrada > 0.1;

    if (monitorear) {
        gestorAmp.dibujar();
    }


    fondo.draw();


    tint(255, fondo.opacity * 60); 
    image(imgFondo, 0, 0, width, height);



    texturas.draw(fondo.opacity, mouseY);


    if (!haySonido) {
        tiempoSilencio += deltaTime; 

        if (!antesHabiaSonido && tiempoSilencio > silencioActivationTime) {
            fondo.opacity = lerp(fondo.opacity, 0, slowFadeSpeed);
            texturas.opacity = lerp(texturas.opacity, 0, slowFadeSpeed);
        }
    } else {
        tiempoSilencio = 0; 
        fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
        texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
        fondo.colorsShuffled = false;
        clearTimeout(silencioTimeout);
    }

    if (tiempoAplauso > 0 && millis() < aplausoTimeout) {
        fondo.opacity = 1; 
        texturas.opacity = 1; 
    } else {
        tiempoAplauso = 0; 
    }

    antesHabiaSonido = haySonido;
}

function modelReady() {
    console.log("Modelo cargado correctamente");
    classifier.classify(gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }
    
    let label = results[0].label;
    
 switch (label) {
 case 'agudo':
 console.log(' agudo');
fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
 texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
  texturas.adjustTextureSizes('agudo');
 break;
        case 'grave':
 console.log('graveo');
fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
 texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
  texturas.adjustTextureSizes('grave');
            break;
            case 'aplausos':
  console.log('aplausos');
                let tiempoActual = millis();
                if (!reubicacionRealizada) {
 texturas.reubicarTexturasAleatorio();
  reubicacionRealizada = true;
 aplausoTimeout = tiempoActual + aplausoDuration;
  tiempoAplauso = tiempoActual;
                    ultimoAplauso = tiempoActual;
                    setTimeout(() => {
                        reubicacionRealizada = false;
                    }, tiempoEntreReubicacion);
                }
                fondo.opacity = 1; 
                texturas.opacity = 1;
                break;
        case 'silencio':
            console.log('silencio');
            fondo.opacity = lerp(fondo.opacity, 0, fadeSpeed);
            texturas.opacity = lerp(texturas.opacity, 0, fadeSpeed);
            texturas.restaurarTamanosIniciales(); 
            texturas.ajustarTamanoTexturasNormal(); 
            break;
        case 'normal':
            console.log('normal');
            texturas.ajustarTamanoTexturasNormal();
            break;
        default:
            break;
    }
}

function reubicarTexturas() {
    texturas.reubicarTexturas();
}

function toggleMonitorear() {
    monitorear = !monitorear;
}