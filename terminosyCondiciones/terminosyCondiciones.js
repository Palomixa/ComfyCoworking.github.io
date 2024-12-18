function cerrarSesion() {
  localStorage.removeItem("usuario");
  window.location.href = "/Login/login.html";
}
