const formRegistro = document.querySelector(".registro");
const inputNombre = document.querySelector(".registro input[name='nombre']");
const inputApellidos = document.querySelector(
  ".registro input[name='apellidos']"
);
const inputEmail = document.querySelector(".registro input[type='email']");
const inputPassword = document.querySelector(
  ".registro input[type='password']"
);
const alertaError = document.querySelector(".alerta-error");
const alertaExito = document.querySelector(".alerta-exito");

const nombreRegex = /^[a-zA-Z]{3,16}$/;
const apellidosRegex = /^[a-zA-Z]{3,16}$/;
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordRegex = /^[a-zA-Z0-9_.+-]{4,12}$/;

const estadoValidacionCampos = {
  nombre: false,
  apellidos: false,
  email: false,
  password: false,
};

document.addEventListener("DOMContentLoaded", () => {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      enviarFormulario();
    }
  });

  inputNombre.addEventListener("input", () => {
    validarCampo(
      nombreRegex,
      inputNombre,
      "El nombre debe contener de 3 a 16 caracteres, sólo puede contener letras."
    );
  });
  inputApellidos.addEventListener("input", () => {
    validarCampo(
      apellidosRegex,
      inputApellidos,
      "El apellido debe contener de 3 a 16 caracteres, sólo puede contener letras."
    );
  });
  inputEmail.addEventListener("input", () => {
    validarCampo(
      emailRegex,
      inputEmail,
      "El email sólo puede contener letras, números, puntos y guiones."
    );
  });
  inputPassword.addEventListener("input", () => {
    validarCampo(
      passwordRegex,
      inputPassword,
      "La contraseña debe contener de 4 a 12 dígitos, sólo admite letras, números, puntos y guiones."
    );
  });
});

function validarCampo(regularExpression, campo, mensaje) {
  const validarCampo = regularExpression.test(campo.value);
  if (validarCampo) {
    eliminarAlerta(campo.parentElement.parentElement);
    estadoValidacionCampos[campo.name] = true;
    campo.parentElement.classList.remove("error");
    return;
  }
  estadoValidacionCampos[campo.name] = false;
  mostrarAlerta(campo.parentElement.parentElement, mensaje);
  campo.parentElement.classList.add("error");
}

function mostrarAlerta(referencia, mensaje) {
  eliminarAlerta(referencia);
  const alertaDiv = document.createElement("div");
  alertaDiv.classList.add("alerta");
  alertaDiv.textContent = mensaje;
  referencia.appendChild(alertaDiv);
}

function eliminarAlerta(referencia) {
  const alerta = referencia.querySelector(".alerta");

  if (alerta) {
    alerta.remove();
  }
}

function validarFormulario() {
  if (
    !inputNombre.value ||
    !inputApellidos.value ||
    !inputEmail.value ||
    !inputPassword.value
  ) {
    alertaError.classList.add("alertaError");
    alertaError.textContent = "Por favor, completa todos los campos.";
    setTimeout(() => {
      alertaError.classList.remove("alertaError");
    }, 3000);
    return false;
  }
  const CamposValidos = Object.values(estadoValidacionCampos).every(
    (valido) => valido
  );
  if (!CamposValidos) {
    alertaError.classList.add("alertaError");
    alertaError.textContent =
      "Por favor, corrige los errores para registrarte.";
    setTimeout(() => {
      alertaError.classList.remove("alertaError");
    }, 3000);
    return false;
  }
  return true;
}

function enviarFormulario() {
  const datosUsuario = {
    nombre: inputNombre.value,
    apellidos: inputApellidos.value,
    email: inputEmail.value,
    password: inputPassword.value,
  };

  const isProduction =
    window.location.hostname === "comfycoworking.onrender.com";

  const url = isProduction
    ? "https://comfycoworking.onrender.com/registro"
    : "http://localhost:5000/registro";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosUsuario),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alertaError.classList.add("alertaError");
        alertaError.textContent = data.error;
        setTimeout(() => {
          alertaError.classList.remove("alertaError");
        }, 3000);
      } else {
        alertaExito.classList.add("alertaExito");
        setTimeout(() => {
          alertaExito.classList.remove("alertaExito");
        }, 5000);
        formRegistro.reset();
      }
    })

    .catch((error) => {
      alertaError.classList.add("alertaError");
      alertaError.textContent = "Error en la conexión con el servidor.";
      setTimeout(() => {
        alertaError.classList.remove("alertaError");
      }, 3000);
    });
}
