let reservas = [];
let edificios = [];
let salas = [];
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
function obtenerToken() {
  return localStorage.getItem("token");
}

function verificarTokenExpirado() {
  const token = obtenerToken();

  if (token) {
    const decoded = jwt_decode(token);
    const expDate = new Date(decoded.exp * 1000);
    return expDate >= new Date();
  }
  return false;
}
document.addEventListener("DOMContentLoaded", async function () {
  const fechaSeleccionada = document.getElementById("fechaMod");
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
    .getElementById("iconoCalendarioMod")
    .addEventListener("click", function () {
      fp.open();
    });
  const horaInicio = flatpickr("#horaInicioMod", {
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

  const horaFin = flatpickr("#horaFinMod", {
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
    const fecha = document.getElementById("fechaMod").value;

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
      if (!horaInicio.selectedDates.length) {
        if (horaInicio) {
          horaInicio.set("minTime", horaFormateada);
        }
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

  async function eliminarReserva(reserva) {
    console.log(reserva);
    console.log(reserva.ReservaId);
    if (confirm("¿Estás seguro de que deseas elimina esta reservar?")) {
      try {
        const token = obtenerToken();
        if (!verificarTokenExpirado()) {
          alert(
            "El token ha expirado o no está disponible. Inicia sesión nuevamente."
          );
          return;
        }
        const decoded = jwt_decode(token);
        const usuarioId = decoded.id;
        const reservaId = reserva.ReservaId;
        const salaId = reserva.SalaId;
        const fechaLarga = reserva.Fecha;
        const fechaFormateada = new Date(fechaLarga);
        const fecha = fechaFormateada.toLocaleDateString("es-Es");
        const horaInicio = reserva.HoraInicio;
        const horaFin = reserva.HoraFin;

        const response = await axios.post(
          `http://localhost:5000/eliminarReserva`,
          { reservaId, usuarioId, salaId, horaInicio, horaFin, fecha },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          alert(response.data.message);
          recargarPagina();
        } else {
          alert("Hubo un problema al eliminar la reserva.");
        }
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        alert("Hubo un error en la conexión con el servidor.");
      }
    }
  }

  async function abrirModalReserva(reserva) {
    if (reserva) {
      const hiddenReserva = document.getElementById("reservaId");
      hiddenReserva.value = reserva.ReservaId;
      console.log(reserva.ReservaId);

      await cargarEdificios();

      const selectEdificio = document.getElementById("edificiosMod");
      selectEdificio.value = reserva.EdificioId;

      await cargarSalas(reserva.EdificioId);

      const selectSala = document.getElementById("salasMod");
      selectSala.value = reserva.SalaId;
      if (reserva.Fecha) {
        const fechaLocal = new Date(reserva.Fecha);
        const fechaFormateada = fechaLocal.toLocaleDateString("es-ES");
        document.getElementById("fechaMod").value = fechaFormateada;
      } else {
        console.error("La fecha no está definida en la reserva");
        document.getElementById("fechaMod").value = "";
      }

      document.getElementById("horaInicioMod").value = formatearHora(
        reserva.HoraInicio
      );
      document.getElementById("horaFinMod").value = formatearHora(
        reserva.HoraFin
      );

      document
        .getElementById("guardarCambios")
        .addEventListener("click", function (event) {
          if (event.target === this) {
            guardarCambios();
          }
        });

      document.getElementById("modificarReservaModal").style.display = "block";
    } else {
      console.error("Reserva no encontrada");
    }
  }

  async function cargarEdificios() {
    try {
      const response = await axios.get("http://localhost:5000/edificios");
      const selectEdificio = document.getElementById("edificiosMod");
      selectEdificio.innerHTML = "";

      response.data.forEach((edificio) => {
        const opcion = document.createElement("option");
        opcion.value = edificio.EdificioId;
        opcion.textContent = edificio.Nombre;
        selectEdificio.appendChild(opcion);
      });
    } catch (error) {
      console.error("Error al cargar los edificios:", error);
    }
  }

  async function cargarSalas(edificioId) {
    try {
      const response = await axios.get(
        `http://localhost:5000/salas/${edificioId}`
      );
      const selectSalas = document.getElementById("salasMod");
      selectSalas.innerHTML = "";

      if (response.data.length === 0) {
        selectSalas.innerHTML = "<option>No hay salas disponibles</option>";
        return;
      }
      const arraySalasFiltrado = response.data.map((item) => ({
        salaId: item.SalaId,
        Capacidad: isNaN(Number(item.Capacidad)) ? 0 : Number(item.Capacidad),
      }));

      const capacidadesUnicas = [
        ...new Set(arraySalasFiltrado.map((item) => item.Capacidad)),
      ];

      const arrayS = arraySalasFiltrado.filter((item) =>
        capacidadesUnicas.includes(item.Capacidad)
      );

      const capacidadesOrdenadas = arrayS.sort((a, b) => {
        return Number(a.Capacidad) - Number(b.Capacidad);
      });

      capacidadesOrdenadas.map((item) => {
        const opcion = document.createElement("option");

        opcion.value = item.salaId;
        opcion.textContent = `${item.Capacidad} personas`;
        selectSalas.appendChild(opcion);
      });
    } catch (error) {
      console.error("Error al cargar las salas:", error);
    }
  }
  document
    .getElementById("edificiosMod")
    .addEventListener("change", async function () {
      const edificioId = this.value;
      if (edificioId) {
        await cargarSalas(edificioId);
      } else {
        console.error("El ID del edificio no es válido");
      }
    });

  document
    .getElementById("modificarReservaModal")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        cerrarModal();
      }
    });

  if (verificarTokenExpirado()) {
    const token = obtenerToken();
    const decoded = jwt_decode(token);
    const usuarioId = decoded.id;

    try {
      const response = await axios.post(
        `http://localhost:5000/consultarReserva`,
        { usuarioId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      reservas = response.data;
      console.log(reservas);
      const tabla = document
        .getElementById("tablaReservas")
        .getElementsByTagName("tbody")[0];
      tabla.innerHTML = "";

      if (reservas.length > 0) {
        reservas.forEach((reserva) => {
          const fila = document.createElement("tr");

          const celdaEdificio = document.createElement("td");
          const celdaSalaNombre = document.createElement("td");
          const celdaSalaCapacidad = document.createElement("td");
          const celdaFecha = document.createElement("td");
          const celdaHoraInicio = document.createElement("td");
          const celdaHoraFin = document.createElement("td");
          const celdaAcciones = document.createElement("td");

          celdaEdificio.textContent = reserva.EdificioNombre;
          celdaSalaNombre.textContent = reserva.SalaNombre;
          celdaSalaCapacidad.textContent = reserva.Capacidad;
          const fechaFormateada = new Date(reserva.Fecha).toLocaleDateString(
            "es-ES"
          );
          celdaFecha.textContent = fechaFormateada;
          celdaHoraInicio.textContent = formatearHora(reserva.HoraInicio);
          celdaHoraFin.textContent = formatearHora(reserva.HoraFin);

          const iconoModificar = document.createElement("i");
          iconoModificar.classList.add("fa", "fa-edit", "iconoAccion");
          iconoModificar.title = "Modificar";
          const iconoEliminar = document.createElement("i");
          iconoEliminar.classList.add("fa", "fa-trash", "iconoAccion");
          iconoEliminar.title = "Eliminar";

          celdaAcciones.appendChild(iconoModificar);
          celdaAcciones.appendChild(iconoEliminar);

          fila.appendChild(celdaEdificio);
          fila.appendChild(celdaSalaNombre);
          fila.appendChild(celdaSalaCapacidad);
          fila.appendChild(celdaFecha);
          fila.appendChild(celdaHoraInicio);
          fila.appendChild(celdaHoraFin);
          fila.appendChild(celdaAcciones);

          tabla.appendChild(fila);

          iconoModificar.addEventListener("click", () => {
            abrirModalReserva(reserva);
          });

          iconoEliminar.addEventListener("click", async () => {
            eliminarReserva(reserva);
          });
        });
      } else {
        alert("No tienes reservas.");
      }
    } catch (error) {
      console.error("Error al consultar las reservas:", error);
    }
  } else {
    alert(
      "El token ha expirado o no está disponible. Inicia sesión nuevamente."
    );
  }
});

async function guardarCambios() {
  const reservaId = document.getElementById("reservaId").value;
  const edificioId = document.getElementById("edificiosMod").value;
  const salaId = document.getElementById("salasMod").value;
  const fecha = document.getElementById("fechaMod").value;
  const horaInicio = document.getElementById("horaInicioMod").value;
  const horaFin = document.getElementById("horaFinMod").value;

  if (!verificarTokenExpirado()) {
    alert(
      "El token ha expirado o no está disponible. Inicia sesión nuevamente."
    );
    return;
  }
  const decodedToken = jwt_decode(obtenerToken());
  const usuarioId = decodedToken.id;

  const datosReserva = {
    usuarioId,
    reservaId,
    edificioId,
    salaId,
    fecha,
    horaInicio,
    horaFin,
  };
  console.log("Datos de reserva a enviar al backend:", datosReserva);
  try {
    const token = obtenerToken();

    const responseMod = await axios.post(
      "http://localhost:5000/modificarReserva",
      datosReserva,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Token en el encabezado Authorization:", `Bearer ${token}`);
    console.log("Respuesta del servidor:", responseMod);
    console.log("Respuesta del servidor:", responseMod.data);
    console.log("Código de estado de la respuesta:", responseMod.status);
    if (responseMod.data.success) {
      alert(responseMod.data.message);
      document.getElementById("edificiosMod").value = "";
      document.getElementById("salasMod").innerHTML =
        "<option value='' disabled selected></option>";
      document.getElementById("fechaMod").value = "";
      document.getElementById("horaInicioMod").value = "";
      document.getElementById("horaFinMod").value = "";
      cerrarModal();
      recargarPagina();
    } else {
      alert("Hubo un problema al modificar la reserva.");
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

function recargarPagina() {
  window.location.reload();
}

function cerrarModal() {
  const modal = document.getElementById("modificarReservaModal");
  if (modal) {
    modal.style.display = "none";
  }
}
function formatearHora(hora) {
  const [h, m] = hora.split(":");
  return `${h}:${m}`;
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "/Login/Login.html";
}
