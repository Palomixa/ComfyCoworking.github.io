import { logoEmail } from "../logoEmail.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_APPLICATION_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const enviarCorreoConfirmacion = async (nombre, apellidos, email) => {
  const firmaHTML = `
  <p></p>
  <p><img src="${logoEmail}" alt="ComfyLogo" style="max-width: 150px; height: auto;"></p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Paseo de las Acacias, 25, 2ªIzquierda</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">28005, Madrid</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Teléfono: 687 512 493</p>
  `;

  const emailInfo = {
    from: process.env.EMAIL_USUARIO,
    to: email,
    subject: "Confirmación de registro en ComfyCoworking",
    html: `<p>Hola ${nombre} ${apellidos},</p>
      <p>Te has registrado correctamente en nuestra aplicación.</p>
      <p>¡Bienvenido!</p>
      <p>Ya puedes comenzar a hacer reservas de una forma cómoda y sencilla.</p>
      
    ${firmaHTML}`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(emailInfo, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

export const enviarCorreoReserva = async (
  Nombre,
  Apellidos,
  Email,
  nombreEdificio,
  Direccion,
  Capacidad,
  nombreSala,
  horaInicio,
  horaFin,
  fecha
) => {
  const firmaHTML = `
  <p></p>
  <p><img src="${logoEmail}" alt="ComfyLogo" style="max-width: 150px; height: auto;"></p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Paseo de las Acacias, 25, 2ªIzquierda</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">28005, Madrid</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Teléfono: 687 512 493</p>
  `;

  const emailInfo = {
    from: process.env.EMAIL_USUARIO,
    to: Email,
    subject: `Confirmación de Reserva ${fecha}`,
    html: `
      <p>Hola ${Nombre} ${Apellidos},</p>
      <p>Te confirmamos que has realizado una reserva en nuestra plataforma. A continuación te mostramos los detalles:</p>
      <p><strong>Edificio:</strong> ${nombreEdificio}</p>
      <p><strong>Dirección:</strong> ${Direccion}</p>
      <p><strong>Sala:</strong> ${nombreSala}</p>
      <p><strong>Capacidad:</strong> ${Capacidad} personas</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora de inicio:</strong> ${horaInicio}</p>
      <p><strong>Hora de fin:</strong> ${horaFin}</p>
      <p>Para cualquier duda no dudes en contactar con nosotros.</p>
      <p>Esperamos que disfrutes de la estancia.</p>
      <br></br>
      <br></br>
    ${firmaHTML}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailInfo, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

export const enviarCorreoModificacionReserva = async (
  Nombre,
  Apellidos,
  Email,
  nombreEdificio,
  Direccion,
  Capacidad,
  nombreSala,
  horaInicio,
  horaFin,
  fecha
) => {
  const firmaHTML = `
  <p></p>
  <p><img src="${logoEmail}" alt="ComfyLogo" style="max-width: 150px; height: auto;"></p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Paseo de las Acacias, 25, 2ªIzquierda</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">28005, Madrid</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Teléfono: 687 512 493</p>
  `;

  const emailInfo = {
    from: process.env.EMAIL_USUARIO,
    to: Email,
    subject: `Confirmación de modificación de Reserva ${fecha}`,
    html: `
      <p>Hola ${Nombre} ${Apellidos},</p>
      <p>Te confirmamos que has modificado una reserva en nuestra plataforma. A continuación te mostramos los detalles de la nueva reserva:</p>
      <p><strong>Edificio:</strong> ${nombreEdificio}</p>
      <p><strong>Dirección:</strong> ${Direccion}</p>
      <p><strong>Sala:</strong> ${nombreSala}</p>
      <p><strong>Capacidad:</strong> ${Capacidad} personas</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora de inicio:</strong> ${horaInicio}</p>
      <p><strong>Hora de fin:</strong> ${horaFin}</p>
      <p>Para cualquier duda no dudes en contactar con nosotros.</p>
      <p>Esperamos que disfrutes de la estancia.</p>
      <br></br>
      <br></br>
    ${firmaHTML}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailInfo, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

export const enviarCorreoCancelacionReserva = async (
  Nombre,
  Apellidos,
  Email,
  nombreEdificio,
  Direccion,
  Capacidad,
  nombreSala,
  horaInicio,
  horaFin,
  fecha
) => {
  const firmaHTML = `
  <p></p>
  <p><img src="${logoEmail}" alt="ComfyLogo" style="max-width: 150px; height: auto;"></p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Paseo de las Acacias, 25, 2ªIzquierda</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">28005, Madrid</p>
  <p style="margin: 0; padding: 0; font-size: 14px;">Teléfono: 687 512 493</p>
  `;

  const emailInfo = {
    from: process.env.EMAIL_USUARIO,
    to: Email,
    subject: `Cancelación de Reserva ${fecha}`,
    html: `
      <p>Hola ${Nombre} ${Apellidos},</p>
      <p>Te confirmamos que se ha cancelado la reserva en nuestra plataforma. Los datos de la reserva cancelada son los siguientes:</p>
      <p><strong>Edificio:</strong> ${nombreEdificio}</p>
      <p><strong>Dirección:</strong> ${Direccion}</p>
      <p><strong>Sala:</strong> ${nombreSala}</p>
      <p><strong>Capacidad:</strong> ${Capacidad} personas</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora de inicio:</strong> ${horaInicio}</p>
      <p><strong>Hora de fin:</strong> ${horaFin}</p>
      <p>Para cualquier duda no dudes en contactar con nosotros.</p>
      <p>Te esperamos en otra ocasión.</p>
      <br></br>
      <br></br>
    ${firmaHTML}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailInfo, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};
