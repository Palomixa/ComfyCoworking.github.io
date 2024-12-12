let fotos = [
  "/imagenes/FotoPortada1.jpg",
  "/imagenes/FotoPortada2.jpg",
  "/imagenes/FotoPortada3.jpg",
  "/imagenes/FotoPortada4.png",
];
let numFoto = 0;
let intervalId;

function iniciar() {
  let fotosSlider = document.querySelectorAll(".imagen");
  let puntos = document.querySelectorAll(".punto");

  for (let i = 0; i < fotosSlider.length; i++) {
    puntos[i].onclick = function () {
      cargarFoto(i);
    };

    fotosSlider[i].setAttribute("src", fotos[i]);
    fotosSlider[i].classList.add("ocultar");

    if (i === 0) {
      fotosSlider[i].classList.remove("ocultar");
    }
  }

  intervalId = setInterval(function () {
    avanzar("adelante");
  }, 3000);
}
function avanzar(direccion) {
  let fotosSlider = document.querySelectorAll(".imagen");

  fotosSlider[numFoto].classList.add("ocultar");

  if (direccion === "adelante") {
    numFoto = (numFoto + 1) % fotos.length;
  } else if (direccion === "atras") {
    numFoto = (numFoto - 1 + fotos.length) % fotos.length;
  }

  fotosSlider[numFoto].classList.remove("ocultar");
}

function cargarFoto(i) {
  let fotosSlider = document.querySelectorAll(".imagen");

  for (let i = 0; i < fotosSlider.length; i++) {
    fotosSlider[i].classList.add("ocultar");
  }

  fotosSlider[i].classList.remove("ocultar");
  numFoto = i;
  clearInterval(intervalId);
  intervalId = setInterval(function () {
    avanzar("adelante");
  }, 3000);
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "/Login/Login.html";
}
