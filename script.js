
// PROYECTO AULA FINANCIERA
// Contabilidad Administrativa - UMG

document.addEventListener("DOMContentLoaded", function () {

  const botonMenu = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const enlaces = document.querySelectorAll(".barra-lateral a");

  // Abrir y cerrar menú en dispositivos móviles
  botonMenu.addEventListener("click", function () {
    const abierto = menu.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
  });

  // Navegación y selección de secciones
  enlaces.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      enlaces.forEach(function (elemento) {
        elemento.classList.remove("activo");
      });

      enlace.classList.add("activo");
      menu.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
    });
  });

  // Año automático en el pie de página
  document.getElementById("anio").textContent =
    new Date().getFullYear();

});

// Leer valores numéricos de los formularios
function leerNumero(id) {
  const campo = document.getElementById(id);
  const texto = campo.value.trim();

  if (texto === "") {
    return null;
  }

  const numero = Number(texto);

  if (!Number.isFinite(numero)) {
    return null;
  }

  return numero;
}

// Formatear cantidades en quetzales
function moneda(valor) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

// Mostrar resultados
function mostrarResultado(id, mensaje, esError = false) {
  const elemento = document.getElementById(id);

  elemento.textContent = mensaje;
  elemento.style.display = "block";
  elemento.classList.toggle("error", esError);
}

// CALCULADORA 1: PUNTO DE EQUILIBRIO
function calcularEquilibrio() {

  const costosFijos = leerNumero("costoFijo");
  const precio = leerNumero("precioVenta");
  const costoVariable = leerNumero("costoVariable");

  const destino = "resultadoEquilibrio";

  if (
    costosFijos === null ||
    precio === null ||
    costoVariable === null
  ) {
    mostrarResultado(destino, "Completa todos los campos.", true);
    return;
  }

  if (
    costosFijos < 0 ||
    precio <= 0 ||
    costoVariable < 0
  ) {
    mostrarResultado(
      destino,
      "Ingresa costos no negativos y un precio mayor que cero.",
      true
    );
    return;
  }

  if (precio <= costoVariable) {
    mostrarResultado(
      destino,
      "El precio debe ser mayor que el costo variable unitario.",
      true
    );
    return;
  }

  const margenContribucion = precio - costoVariable;
  const puntoEquilibrio = costosFijos / margenContribucion;
  const unidades = Math.ceil(puntoEquilibrio);

  mostrarResultado(
    destino,
    "Punto de equilibrio: " +
    unidades.toLocaleString("es-GT") +
    " unidades. Margen de contribución unitario: " +
    moneda(margenContribucion) + "."
  );
}

// CALCULADORA 2: MARGEN DE UTILIDAD NETA
function calcularMargen() {

  const ventas = leerNumero("ventas");
  const utilidad = leerNumero("utilidad");

  const destino = "resultadoMargen";

  if (ventas === null || utilidad === null) {
    mostrarResultado(destino, "Completa todos los campos.", true);
    return;
  }

  if (ventas <= 0) {
    mostrarResultado(
      destino,
      "Las ventas deben ser mayores que cero.",
      true
    );
    return;
  }

  const margen = (utilidad / ventas) * 100;

  mostrarResultado(
    destino,
    "Margen de utilidad neta: " +
    margen.toFixed(2) + "%."
  );
}

// CALCULADORA 3: VARIACIÓN PRESUPUESTARIA
function calcularVariacion() {

  const presupuesto = leerNumero("presupuesto");
  const real = leerNumero("real");

  const destino = "resultadoVariacion";

  if (presupuesto === null || real === null) {
    mostrarResultado(destino, "Completa todos los campos.", true);
    return;
  }

  if (presupuesto < 0 || real < 0) {
    mostrarResultado(
      destino,
      "Los importes no pueden ser negativos.",
      true
    );
    return;
  }

  const diferencia = real - presupuesto;

  let porcentajeTexto = "No calculable";

  if (presupuesto !== 0) {
    const porcentaje = (diferencia / presupuesto) * 100;
    porcentajeTexto = porcentaje.toFixed(2) + "%";
  }

  let interpretacion = "Sin variación";

  if (diferencia > 0) {
    interpretacion = "El importe real supera al presupuestado";
  } else if (diferencia < 0) {
    interpretacion = "El importe real es menor al presupuestado";
  }

  mostrarResultado(
    destino,
    "Variación: " + moneda(diferencia) +
    ". Variación porcentual: " + porcentajeTexto +
    ". " + interpretacion + "."
  );
}
