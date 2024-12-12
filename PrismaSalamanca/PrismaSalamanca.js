let peticion = new XMLHttpRequest();
peticion.open("GET", "salasPrismaSalamanca.xml");
peticion.send();
peticion.onreadystatechange = cargaTexto;

function cargaTexto() {
  if (peticion.readyState == 4) {
    if (peticion.status == 200) {
      let mixml = peticion.responseXML;
      console.log(mixml);
      let salas = mixml.querySelectorAll("sala");
      console.log(salas.length);

      for (let i = 0; i < salas.length; i++) {
        let cartel = document.createElement("div");
        cartel.classList.add("col-4");

        let foto = document.createElement("img");
        foto.src = "/imagenes/" + salas[i].querySelector("foto").textContent;

        let nombreSala = document.createElement("h3");
        nombreSala.innerText = salas[i].querySelector("nombre").textContent;

        cartel.append(foto, nombreSala);
        document.querySelector("#salas").appendChild(cartel);

        cartel.addEventListener("click", function () {
          document.querySelector("#nombre").innerHTML =
            "<span>Nombre de la sala: </span>" +
            salas[i].querySelector("nombre").textContent;
          document.querySelector("#capacidad").innerHTML =
            "<span>Capacidad: </span>" +
            salas[i].querySelector("capacidad").textContent;
          document.querySelector("#ubicacion").innerHTML =
            "<span>Ubicación: </span>" +
            salas[i].querySelector("ubicacion").textContent;
          document.querySelector("#imagen").src =
            "/imagenes/" + salas[i].querySelector("foto_grande").textContent;
        });
      }
    }
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "/Login/Login.html";
}
