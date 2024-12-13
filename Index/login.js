const formLogin = document.querySelector(".login");
const inputEmail = document.querySelector(".login input[type='email']");
const inputPassword = document.querySelector(".login input[type='password']");
const alertaError = document.querySelector(".alerta-error");
const alertaExito = document.querySelector(".alerta-exito");

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordRegex = /^[a-zA-Z0-9_.+-]{4,12}$/;

const estadoValidacionCampos = {
  email: false,
  password: false,
};

document.addEventListener("DOMContentLoaded", () => {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    enviarFormulario();
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

async function enviarFormulario() {
  if (!inputEmail.value || !inputPassword.value) {
    alertaError.textContent = "Por favor, completa todos los campos.";
    alertaError.classList.add("alertaError");
    setTimeout(() => {
      alertaError.classList.remove("alertaError");
    }, 3000);
    return;
  }

  if (estadoValidacionCampos.email && estadoValidacionCampos.password) {
    const email = inputEmail.value;
    const password = inputPassword.value;

    const baseURL =
      process.env.NODE_ENV === "production"
        ? "https://comfycoworking.onrender.com"
        : "http://127.0.0.1:5000";

    try {
      const response = await axios.post(
        `${baseURL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      console.log("Respuesta del servidor:", data);
      if (data.message) {
        const token = data.message;
        console.log("Token enviado:", token);

        localStorage.setItem("token", token);

        const tokenFromStorage = localStorage.getItem("token");
        console.log("Token recuperado:", tokenFromStorage);

        console.log(localStorage.getItem("token"));

        const decodedToken = jwt_decode(token);

        console.log("Usuario ID (decodificado):", decodedToken.id);
        console.log("Usuario nombre (decodificado):", decodedToken.nombre);
        console.log("Token decodificado:", decodedToken);

        alertaExito.textContent = "Inicio de sesion exitoso";
        alertaExito.classList.add("alertaExito");
        setTimeout(() => {
          window.location.href = "/index/ComfyCoworking.html";
        }, 1500);
      } else {
        alertaError.textContent = data.error;
        alertaError.classList.add("alertaError");
        setTimeout(() => {
          alertaError.classList.remove("alertaError");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al conectarse con el servidor:", error);
      if (error.response && error.response.status === 400) {
        alertaError.textContent =
          error.response.data.error || "Error desconocido";
      } else {
        alertaError.textContent = "Error al conectarse con el servidor.";
      }
      alertaError.classList.add("alertaError");
      setTimeout(() => {
        alertaError.classList.remove("alertaError");
      }, 3000);
    }
  } else {
    alertaError.classList.add("alertaError");
    alertaError.textContent =
      "Por favor, corrige los errores para iniciar sesión.";
    setTimeout(() => {
      alertaError.classList.remove("alertaError");
    }, 3000);
  }
}
