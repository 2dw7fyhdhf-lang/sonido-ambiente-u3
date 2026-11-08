// el programa mide el nivel de sonido del micrófono.
// cambia el movimiento y el color de las partículas.
// no graba ni guarda audio y no reconoce palabras.

// bastian: micrófono y señal
let mic;
let senal = 0;
let nivel = null;
let estado = "haz clic para activar el micrófono";
let iniciando = false;

// rango inicial para ajustar después de medir
let minimo = 0;
let maximo = 0.15;

// gabriela: creación de las partículas
let particulas = [];

function setup() {
  createCanvas(400, 400);
  mic = new p5.AudioIn();

  for (let i = 0; i < 100; i++) {
    particulas.push({
      x: random(width),
      y: random(height),
      velocidad: random(0.5, 2),
      tamano: random(2, 5)
    });
  }
}

// bastian: leer el micrófono
function leerCrudo() {
  if (!mic.enabled) {
    return null;
  }

  return mic.getLevel();
}

// convertir el nivel a un valor entre 0 y 1
function leerSenal() {
  let s = map(nivel, minimo, maximo, 0, 1);
  return constrain(s, 0, 1);
}

function draw() {
  background(15, 20, 40);
  nivel = leerCrudo();

  // bastian: suavizar los cambios
  if (nivel !== null) {
    senal = lerp(senal, leerSenal(), 0.15);
  }

  // flo: color según el sonido
  let frio = color(70, 150, 255);
  let caliente = color(255, 100, 60);

  noStroke();
  fill(120);

  if (nivel !== null) {
    fill(lerpColor(frio, caliente, senal));
  }

  // benjamin: movimiento y bordes
  for (let p of particulas) {
    if (nivel !== null) {
      p.x += p.velocidad + senal * 5;

      p.y += sin(frameCount * 0.02 + p.x * 0.01)
        * (1 + senal * 5);

      if (p.x > width) p.x = 0;
      if (p.y > height) p.y = 0;
      if (p.y < 0) p.y = height;
    }

    circle(p.x, p.y, p.tamano);
  }

  // flo: título e información
  fill(15, 20, 40, 230);
  rect(10, 10, 380, 110);

  fill(255);
  textSize(22);
  text("sonido ambiente", 20, 40);

  textSize(13);

  if (nivel === null) {
    text("sin datos", 20, 65);
  } else {
    text("nivel: " + nf(nivel, 1, 3), 20, 65);
  }

  textSize(11);
  text(estado, 20, 95);
}

// bastian: activar y detener el micrófono
function mousePressed() {
  if (
    mouseX < 0 || mouseX > width ||
    mouseY < 0 || mouseY > height ||
    iniciando
  ) {
    return;
  }

  if (mic.enabled) {
    mic.stop();
    senal = 0;
    estado = "haz clic para activar el micrófono";
  } else {
    userStartAudio();
    iniciando = true;
    estado = "acepta el permiso del navegador";
    mic.start(microfonoListo, errorMicrofono);
  }
}

function microfonoListo() {
  iniciando = false;
  estado = "micrófono activo. haz clic para detener";
}

function errorMicrofono() {
  iniciando = false;
  estado = "revisa el permiso y haz clic para reintentar";
}