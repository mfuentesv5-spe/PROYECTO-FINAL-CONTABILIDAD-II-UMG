document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const anio = document.getElementById("anio");

  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      const abierto = menu.classList.toggle("abierto");

      menuBtn.setAttribute("aria-expanded", String(abierto));
      menuBtn.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
      );
    });

    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menu.classList.remove("abierto");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
});

function moneda(valor) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

function porcentaje(valor) {
  return valor.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " %";
}

function leerNumero(id, nombre, opciones = {}) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error("No se encontró el campo: " + nombre);
  }

  const texto = elemento.value.trim();

  if (texto === "") {
    throw new Error("Ingresa el dato: " + nombre);
  }

  const numero = Number(texto);

  if (!Number.isFinite(numero)) {
    throw new Error("El dato " + nombre + " no es válido.");
  }

  if (opciones.positivo && numero <= 0) {
    throw new Error(nombre + " debe ser mayor que cero.");
  }

  if (opciones.noNegativo && numero < 0) {
    throw new Error(nombre + " no puede ser negativo.");
  }

  return numero;
}

function mostrarResultado(id, contenido, error = false) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    return;
  }

  elemento.textContent = contenido;
  elemento.classList.toggle("error", error);
}

function ejecutar(id, operacion) {
  try {
    const resultado = operacion();
    mostrarResultado(id, resultado);
  } catch (error) {
    mostrarResultado(id, error.message, true);
  }
}

function leerFlujos(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error("No se encontró el campo de flujos.");
  }

  const texto = elemento.value.trim();

  if (!texto) {
    throw new Error("Ingresa los flujos de efectivo anuales.");
  }

  const partes = texto.split(",");

  if (partes.length > 100) {
    throw new Error("Ingresa como máximo 100 flujos anuales.");
  }

  return partes.map(function (parte) {
    const dato = parte.trim();

    if (dato === "") {
      throw new Error("No dejes flujos vacíos entre comas.");
    }

    const valor = Number(dato);

    if (!Number.isFinite(valor)) {
      throw new Error(
        "Flujo inválido. Usa comas entre años y puntos decimales."
      );
    }

    return valor;
  });
}

function calcularEquilibrio() {
  ejecutar("resultadoEquilibrio", function () {
    const fijos = leerNumero(
      "peFijos",
      "Costos fijos",
      { noNegativo: true }
    );

    const precio = leerNumero(
      "pePrecio",
      "Precio unitario",
      { positivo: true }
    );

    const variable = leerNumero(
      "peVariable",
      "Costo variable",
      { noNegativo: true }
    );

    const contribucion = precio - variable;

    if (contribucion <= 0) {
      throw new Error(
        "El precio debe ser mayor que el costo variable unitario."
      );
    }

    const equilibrio = fijos / contribucion;
    const unidades = Math.ceil(equilibrio);

    return "Punto de equilibrio: " +
      equilibrio.toFixed(2) +
      " unidades. Debes vender al menos " +
      unidades +
      " unidades completas para cubrir los costos.";
  });
}

function calcularMargen() {
  ejecutar("resultadoMargen", function () {
    const utilidad = leerNumero(
      "margenUtilidad",
      "Utilidad neta"
    );

    const ventas = leerNumero(
      "margenVentas",
      "Ventas netas",
      { positivo: true }
    );

    const margen = (utilidad / ventas) * 100;

    return "Margen de utilidad neta: " +
      porcentaje(margen) +
      ". Por cada Q100 vendidos, el resultado neto es " +
      moneda(margen) + ".";
  });
}

function calcularVariacion() {
  ejecutar("resultadoVariacion", function () {
    const presupuesto = leerNumero(
      "varPresupuesto",
      "Valor presupuestado"
    );

    const real = leerNumero(
      "varReal",
      "Valor real"
    );

    const variacion = real - presupuesto;

    let descripcion = "No existe variación.";

    if (variacion > 0) {
      descripcion = "El valor real supera al presupuestado.";
    } else if (variacion < 0) {
      descripcion = "El valor real es menor que el presupuestado.";
    }

    return "Variación: " +
      moneda(variacion) +
      ". " +
      descripcion +
      " Su efecto favorable o desfavorable depende de si son ingresos o gastos.";
  });
}

function calcularROA() {
  ejecutar("resultadoROA", function () {
    const utilidad = leerNumero(
      "roaUtilidad",
      "Utilidad neta"
    );

    const activos = leerNumero(
      "roaActivos",
      "Activos promedio",
      { positivo: true }
    );

    const roa = (utilidad / activos) * 100;

    return "Rentabilidad sobre activos: " +
      porcentaje(roa) +
      ". Compara el indicador con empresas similares.";
  });
}

function calcularEficiencia() {
  ejecutar("resultadoEficiencia", function () {
    const gastos = leerNumero(
      "efGastos",
      "Gastos operativos",
      { noNegativo: true }
    );

    const ventas = leerNumero(
      "efVentas",
      "Ventas netas",
      { positivo: true }
    );

    const indicador = (gastos / ventas) * 100;

    return "Gastos operativos sobre ventas: " +
      porcentaje(indicador) +
      ". Este porcentaje debe analizarse según el sector y período.";
  });
}

function calcularFlujo() {
  ejecutar("resultadoFlujo", function () {
    const entradas = leerNumero(
      "flujoEntradas",
      "Entradas",
      { noNegativo: true }
    );

    const salidas = leerNumero(
      "flujoSalidas",
      "Salidas",
      { noNegativo: true }
    );

    const flujo = entradas - salidas;

    let mensaje = "El flujo neto es cero.";

    if (flujo > 0) {
      mensaje = "Las entradas superan las salidas.";
    } else if (flujo < 0) {
      mensaje = "Las salidas superan las entradas.";
    }

    return "Flujo neto: " +
      moneda(flujo) +
      ". " +
      mensaje;
  });
}

function calcularComprarProducir() {
  ejecutar("resultadoComprarProducir", function () {
    const unidades = leerNumero(
      "cpUnidades",
      "Unidades",
      { positivo: true }
    );

    if (!Number.isInteger(unidades)) {
      throw new Error("La cantidad de unidades debe ser entera.");
    }

    const compra = leerNumero(
      "cpCompra",
      "Precio de compra",
      { noNegativo: true }
    );

    const variable = leerNumero(
      "cpVariable",
      "Costo variable",
      { noNegativo: true }
    );

    const fijo = leerNumero(
      "cpFijo",
      "Costos fijos adicionales",
      { noNegativo: true }
    );

    const costoComprar = unidades * compra;
    const costoProducir = unidades * variable + fijo;
    const diferencia = Math.abs(costoComprar - costoProducir);

    let recomendacion;

    if (costoComprar < costoProducir) {
      recomendacion = "Comprar resulta más económico.";
    } else if (costoProducir < costoComprar) {
      recomendacion = "Producir resulta más económico.";
    } else {
      recomendacion = "Ambas alternativas tienen el mismo costo.";
    }

    return "Comprar: " +
      moneda(costoComprar) +
      ". Producir: " +
      moneda(costoProducir) +
      ". Diferencia: " +
      moneda(diferencia) +
      ". " +
      recomendacion;
  });
}

function calcularPatrimonio() {
  ejecutar("resultadoPatrimonio", function () {
    const activos = leerNumero(
      "patActivos",
      "Activos",
      { positivo: true }
    );

    const pasivos = leerNumero(
      "patPasivos",
      "Pasivos",
      { noNegativo: true }
    );

    const patrimonio = activos - pasivos;
    const endeudamiento = (pasivos / activos) * 100;

    return "Patrimonio contable: " +
      moneda(patrimonio) +
      ". Endeudamiento: " +
      porcentaje(endeudamiento) +
      ".";
  });
}

function valorActualNeto(inversion, tasa, flujos) {
  let van = -inversion;

  for (let i = 0; i < flujos.length; i++) {
    van += flujos[i] / Math.pow(1 + tasa, i + 1);
  }

  return van;
}

function calcularVAN() {
  ejecutar("resultadoVAN", function () {
    const inversion = leerNumero(
      "vanInversion",
      "Inversión inicial",
      { positivo: true }
    );

    const tasaPorcentaje = leerNumero(
      "vanTasa",
      "Tasa de descuento"
    );

    if (tasaPorcentaje <= -100) {
      throw new Error("La tasa debe ser mayor que -100 %.");
    }

    const flujos = leerFlujos("vanFlujos");
    const tasa = tasaPorcentaje / 100;

    const van = valorActualNeto(inversion, tasa, flujos);

    if (!Number.isFinite(van)) {
      throw new Error(
        "No fue posible calcular el VAN con estos datos."
      );
    }

    let interpretacion;

    if (Math.abs(van) < 0.005) {
      interpretacion =
        "El proyecto está aproximadamente en el punto de indiferencia.";
    } else if (van > 0) {
      interpretacion =
        "El proyecto genera valor bajo la tasa utilizada.";
    } else {
      interpretacion =
        "El proyecto no alcanza la rentabilidad exigida.";
    }

    return "Valor Actual Neto: " +
      moneda(van) +
      ". " +
      interpretacion;
  });
}

function calcularTIR() {
  ejecutar("resultadoTIR", function () {
    const inversion = leerNumero(
      "tirInversion",
      "Inversión inicial",
      { positivo: true }
    );

    const flujos = leerFlujos("tirFlujos");

    if (flujos.some(function (flujo) {
      return flujo < 0;
    })) {
      throw new Error(
        "Esta calculadora requiere flujos anuales no negativos."
      );
    }

    const total = flujos.reduce(function (a, b) {
      return a + b;
    }, 0);

    if (total <= 0) {
      throw new Error(
        "Debe existir al menos un flujo de efectivo positivo."
      );
    }

    let inferior = -0.999999;
    let superior = 1;

    while (
      valorActualNeto(inversion, superior, flujos) > 0 &&
      superior < 1000000
    ) {
      superior = superior * 2 + 1;
    }

    if (valorActualNeto(inversion, superior, flujos) > 0) {
      throw new Error(
        "No se pudo delimitar la TIR con los datos proporcionados."
      );
    }

    for (let i = 0; i < 200; i++) {
      const medio = (inferior + superior) / 2;
      const van = valorActualNeto(inversion, medio, flujos);

      if (van > 0) {
        inferior = medio;
      } else {
        superior = medio;
      }
    }

    const tir = ((inferior + superior) / 2) * 100;

    if (!Number.isFinite(tir)) {
      throw new Error("No fue posible calcular la TIR.");
    }

    return "Tasa Interna de Retorno: " +
      porcentaje(tir) +
      ". Compárala con la tasa mínima de rendimiento requerida.";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const fotografias = document.querySelectorAll(".galeria-universitaria a");

  if (fotografias.length === 0) return;

  const visor = document.createElement("div");
  visor.className = "visor-fotos";
  visor.setAttribute("role", "dialog");
  visor.setAttribute("aria-modal", "true");
  visor.setAttribute("aria-label", "Visor de fotografías");

  const imagen = document.createElement("img");
  imagen.alt = "";

  const cerrar = document.createElement("button");
  cerrar.className = "cerrar-visor";
  cerrar.type = "button";
  cerrar.textContent = "×";
  cerrar.setAttribute("aria-label", "Cerrar fotografía");

  visor.appendChild(imagen);
  visor.appendChild(cerrar);
  document.body.appendChild(visor);

  let enlaceAnterior = null;

  function cerrarFotografia() {
    visor.classList.remove("activo");
    imagen.removeAttribute("src");
    document.body.style.overflow = "";

    if (enlaceAnterior) {
      enlaceAnterior.focus();
    }
  }

  fotografias.forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();

      const foto = enlace.querySelector("img");
      if (!foto) return;

      enlaceAnterior = enlace;
      imagen.src = enlace.getAttribute("href");
      imagen.alt = foto.alt;

      visor.classList.add("activo");
      document.body.style.overflow = "hidden";
      cerrar.focus();
    });
  });

  cerrar.addEventListener("click", cerrarFotografia);

  visor.addEventListener("click", function (evento) {
    if (evento.target === visor) {
      cerrarFotografia();
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (!visor.classList.contains("activo")) return;

    if (evento.key === "Escape") {
      cerrarFotografia();
    }

    if (evento.key === "Tab") {
      evento.preventDefault();
      cerrar.focus();
    }
  });
});
