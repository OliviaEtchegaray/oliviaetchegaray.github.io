
let monitorear = true;

const AMP_MIN = 0.01; // alto o bajo 
const AMP_MAX = 0.01;

let mic;
let pitch;
let audioContext;
let gestorAmp; //siempregestor

const model_url = "https://teachablemachine.withgoogle.com/models/fk3o_GpeA/model.json";

let haySonido;
let antesHabiaSonido = false;

let fondo;
let texturas;
const FondoColor = ['#3769C5', '#2ecc71', '#e74c3c', '#f1c40f'];
const fadeSpeed = 0.02;
let imagenes = [];

let classifier;

function preload() {
    for (let n = 1; n <= 18; n++) {
        let img = loadImage('libraries/t' + n + '.png');
        imagenes.push(img);
    }

    classifier = ml5.soundClassifier(model_url, modelReady); // modleocargado
}

function setup() {
    createCanvas(600, 600);
    background(255);

    fondo = new Fondo(FondoColor, fadeSpeed);
    fondo.initBackground();

    texturas = new Texturas(imagenes, width, height);

    audioContext = getAudioContext(); //motor d audio 

    mic = new p5.AudioIn();//esoto inciia el microfono  
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
    texturas.draw(fondo.opacity, mouseY);

    antesHabiaSonido = haySonido;
}

function modelReady() {
    console.log("Modelo cargado correctamente");
    classifier.classify(gotResult);
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
    let confidence = results[0].confidence;
    
    console.log(`Label: ${label}, Confidence: ${confidence}`);
    
    switch (label) {
        case 'agudo':
            console.log('agudo');
            fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
            texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
            texturas.adjustTextureSizes('agudo'); 
            break;
        case 'grave':
            console.log('grave');
            fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
            texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
            texturas.adjustTextureSizes('grave'); 
            break;
            case 'aplausos':
                console.log('aplauso');
                fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
                texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
                texturas.reubicarTexturasAleatorio(); 
                console.log('cambiotextura');
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
                fondo.opacity = lerp(fondo.opacity, 1, fadeSpeed);
                texturas.opacity = lerp(texturas.opacity, 1, fadeSpeed);
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