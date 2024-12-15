document.addEventListener("DOMContentLoaded", function () {
  const isProduction =
    window.location.hostname === "comfycoworking.onrender.com";

  const urlEdificio = isProduction
    ? `https://comfycoworking.onrender.com/edificios`
    : `http://localhost:5000/edificios`;

  axios
    .get(urlEdificio)
    .then((response) => {
      const selectEdificio = document.getElementById("edificios");

      console.log(response.data);
      if (response.data.length > 0) {
        response.data.forEach((edificio) => {
          const opcion = document.createElement("option");
          opcion.value = edificio.EdificioId;
          opcion.dataset.id = edificio.EdificioId;
          opcion.dataset.Nombre = edificio.Nombre;
          opcion.textContent = edificio.Nombre;
          selectEdificio.appendChild(opcion);
        });
      } else {
        console.log("no hay edificios disponibles.");
      }
    })
    .catch((error) => console.error("Error al cargar los edificios:", error));

  const selectEdificio = document.getElementById("edificios");
  selectEdificio.addEventListener("change", function () {
    const edificioId =
      selectEdificio.options[selectEdificio.selectedIndex]?.dataset.id;
    if (!edificioId) {
      console.error("El id del edificio es invalido");
      return;
    }
    const isProduction =
      window.location.hostname === "comfycoworking.onrender.com";

    const urlSalaEdificio = isProduction
      ? `https://comfycoworking.onrender.com/salas/${edificioId}`
      : `http://localhost:5000/salas/${edificioId}`;

    axios
      .get(urlSalaEdificio)
      .then((response) => {
        const selectSalas = document.getElementById("salas");
        selectSalas.innerHTML = "Selecciona la capacidad";

        if (response.data.length === 0) {
          selectSalas.innerHTML = "No hay capacidades disponibles";
          return;
        }

        const noRepetCapacidades = new Set();

        response.data.forEach((sala) => {
          noRepetCapacidades.add(sala.Capacidad);
        });

        const ordenarCapacidad = [...noRepetCapacidades].sort((a, b) => a - b);

        ordenarCapacidad.forEach((capacidad) => {
          const opcion = document.createElement("option");
          opcion.value = capacidad;
          opcion.textContent = `${capacidad} personas`;

          selectSalas.appendChild(opcion);
        });
      })
      .catch((error) => console.error("Error al cargar las opciones:", error));
  });

  const fechaSeleccionada = document.getElementById("fecha");
  const fp = flatpickr(fechaSeleccionada, {
    dateFormat: "d-m-Y",
    minDate: "today",
    locale: "es",
    theme: "light",
    disableMobile: true,
    firstDayOfWeek: 1,
    showTodayButton: true,
    todayText: "Hoy",
    disable: [
      function (date) {
        return date.getDay() === 0 || date.getDay() === 6;
      },
      function (date) {
        const festivos = [
          { day: 6, month: 11, year: 2024 },
          { day: 25, month: 11, year: 2024 },
          { day: 1, month: 0, year: 2025 },
          { day: 6, month: 0, year: 2025 },
        ];

        const diaSeleccionado = date.getDate();
        const mesSeleccionado = date.getMonth();
        const anioSeleccionado = date.getFullYear();

        return festivos.some(
          (festivo) =>
            festivo.day === diaSeleccionado &&
            festivo.month === mesSeleccionado &&
            festivo.year === anioSeleccionado
        );
      },
    ],
    onChange: function (selectedDates, dateStr, instance) {
      fechaSeleccionada.value = dateStr;
      actualizarHoraInicio();
    },
  });

  document
    .getElementById("iconoCalendario")
    .addEventListener("click", function () {
      fp.open();
    });

  const horaInicio = flatpickr("#horaInicio", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minTime: "8:00",
    maxTime: "20:30",
    defaultHour: 8,
    defaultMinute: 0,
    minuteIncrement: 30,
    onChange: actualizarhoraFin,
  });

  const horaFin = flatpickr("#horaFin", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minTime: "8:30",
    maxTime: "21:00",
    defaultHour: 8,
    defaultMinute: 30,
    minuteIncrement: 30,
  });

  function actualizarHoraInicio() {
    const fecha = document.getElementById("fecha").value;

    if (fecha === obtenFechaHoy()) {
      const horaActual = new Date();
      const minutos = horaActual.getMinutes();
      const siguienteIntervalo = Math.ceil(minutos / 30) * 30;

      if (siguienteIntervalo === 60) {
        horaActual.setHours(horaActual.getHours() + 1);
        horaActual.setMinutes(0);
      } else {
        horaActual.setMinutes(siguienteIntervalo);
      }

      const horaFormateada = `${horaActual
        .getHours()
        .toString()
        .padStart(2, "0")}:${horaActual
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      if (horaInicio) {
        horaInicio.set("minTime", horaFormateada);
      }
    } else {
      if (horaInicio) {
        horaInicio.set("minTime", "8:00");
      }
    }
  }

  function obtenFechaHoy() {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, `0`);
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  function actualizarhoraFin(selectedDates, dateStr, instance) {
    const horaInicioSeleccionada = horaInicio.selectedDates[0];

    if (horaInicioSeleccionada) {
      const horaMinimaFin = new Date(horaInicioSeleccionada.getTime());
      horaMinimaFin.setMinutes(horaMinimaFin.getMinutes() + 30);

      const horas = horaMinimaFin.getHours().toString().padStart(2, "0");
      const minutos = horaMinimaFin.getMinutes().toString().padStart(2, "0");

      const horaMinimaFinStr = `${horas}:${minutos}`;

      horaFin.set("minTime", horaMinimaFinStr);

      if (horaFin.selectedDates.length > 0) {
        const horaFinSeleccionada = horaFin.selectedDates[0];

        if (horaFinSeleccionada < horaMinimaFin) {
          horaFin.clear();
        }
      }
    }
  }
});

function mostrarEleccion() {
  const selectEdificio = document.getElementById("edificios");
  const edificioSeleccionado =
    selectEdificio.options[selectEdificio.selectedIndex];
  const edificio = edificioSeleccionado
    ? edificioSeleccionado.textContent
    : null;
  const salas = document.getElementById("salas").value;
  const fecha = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;

  var resultado = `Has seleccionado las siguientes opciones: <br>Edificio: ${edificio}<br>Capacidad: ${salas} personas<br>Fecha: 
  ${fecha}<br>Hora de inicio: ${horaInicio}<br>Hora de finalización: ${horaFin}<br>Pulsa el botón de reservar para hacer efectiva la reserva.`;

  document.getElementById("resultado").innerHTML = resultado;
}

async function reservar() {
  function obtenerToken() {
    return localStorage.getItem("token");
  }

  function verificarTokenExpirado() {
    const token = obtenerToken();

    if (token) {
      const decodedToken = jwt_decode(token);
      console.log("Token decodificado:", decodedToken);

      const expDate = new Date(decodedToken.exp * 1000);
      console.log("Fecha de expiración del token:", expDate);

      if (expDate < new Date()) {
        console.log("El token ha expirado.");

        return false;
      } else {
        console.log("El token es válido.");
        return true;
      }
    } else {
      console.log("No hay token almacenado.");
      return false;
    }
  }

  const selectEdificio = document.getElementById("edificios");
  const edificioId = selectEdificio.value;
  const capacidad = document.getElementById("salas").value;
  const fecha = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;

  if (!edificioId || !capacidad || !fecha || !horaInicio || !horaFin) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  if (!verificarTokenExpirado()) {
    alert(
      "El token ha expirado o no está disponible. Inicia sesión nuevamente."
    );
    return;
  }
  try {
    const salaId = await obtenerSalaId(edificioId, capacidad);

    if (salaId) {
      const decodedToken = jwt_decode(obtenerToken());
      const datosReserva = {
        usuarioId: decodedToken.id,
        salaId: salaId,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin,
      };

      console.log("Datos de reserva a enviar al backend:", datosReserva);
      if (verificarTokenExpirado()) {
        const token = obtenerToken();

        const isProduction =
          window.location.hostname === "comfycoworking.onrender.com";

        const url = isProduction
          ? `https://comfycoworking.onrender.com/reservas`
          : `http://localhost:5000/reservas`;

        const response = await axios.post(url, datosReserva, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Token en el encabezado Authorization:", `Bearer ${token}`);
        console.log("Respuesta del servidor:", response);
        if (response.data.success) {
          alert(response.data.message);
          document.getElementById("edificios").value = "";
          document.getElementById("salas").innerHTML =
            "<option value='' disabled selected></option>";
          document.getElementById("fecha").value = "";
          document.getElementById("horaInicio").value = "";
          document.getElementById("horaFin").value = "";
          recargarPagina();
        } else {
          alert("Hubo un problema al realizar la reserva.");
        }
      } else {
        alert("No se encontró la sala correspondiente.");
      }
    }
  } catch (error) {
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      console.error("Error al realizar la reserva:", error);
      alert("Hubo un error en la conexión con el servidor.");
    }
  }
}

function obtenerSalaId(edificioId, capacidad) {
  const isProduction =
    window.location.hostname === "comfycoworking.onrender.com";

  const url = isProduction
    ? `https://comfycoworking.onrender.com/salas/${edificioId}`
    : `http://localhost:5000/salas/${edificioId}`;

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        console.log("Datos obtenidos de las salas:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          const capacidadNumero = Number(capacidad);

          const sala = response.data.find(
            (sala) => sala.Capacidad == capacidadNumero
          );
          console.log("Sala encontrada:", sala);

          if (!sala) {
            console.error(
              `No se encontró una sala con la capacidad de ${capacidad} personas.`
            );
            alert(
              `No hay ninguna sala con la capacidad de ${capacidad} personas disponible.`
            );
            resolve(null);
          } else {
            console.log("Sala encontrada:", sala);
            resolve(sala.SalaId);
          }
        } else {
          reject(new Error("La respuesta no es un array"));
        }
      })
      .catch((error) => {
        console.error("Error al obtener la sala por la capacidad;", error);
        reject(error);
      });
  });
}
function recargarPagina() {
  window.location.reload();
}
function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "/Login/login.html";
}
