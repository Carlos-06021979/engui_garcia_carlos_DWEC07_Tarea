/*
Función para renderizar las tarjetas de bicicletas en el grid
bicicletas: Array de objetos bicicleta a renderizar
grid: Elemento HTML donde se insertarán las tarjetas
*/
function renderizarBicicletas(bicicletas, grid) {
  // Comprobamos si no hay bicicletas o el array está vacío
  // Si es así, mostramos un mensaje indicando que no hay resultados
  if (!bicicletas || bicicletas.length === 0) {
    grid.innerHTML =
      '<p class="mensaje-vacio">No se encontraron bicicletas para esta categoría.</p>';
    // Salimos de la función
    return;
  }

  // Recorremos el array de bicicletas para crear una tarjeta por cada una
  bicicletas.forEach((bici) => {
    // Creamos el elemento div para la tarjeta
    const tarjeta = document.createElement("div");

    // Le asignamos la clase CSS tarjeta-bicicleta
    tarjeta.className = "tarjeta-bicicleta";

    // Creamos el contenedor para la imagen
    const contenedorImg = document.createElement("div");

    // Asignamos la clase contenedor-img-bicicleta al contenedor de la imagen
    contenedorImg.className = "contenedor-img-bicicleta";

    // Creamos el elemento img
    const img = document.createElement("img");

    // Asignamos la fuente de la imagen usando la URL base (en datos.js) y el código de la bici
    img.src = `${URL_IMG_BASE}${bici.cod}`;

    // Asignamos el texto alternativo (alt) con el nombre de la bici o un genérico si no tuviera nombre
    img.alt = bici.nom || "Bicicleta";

    // Configuramos el evento onerror para cargar una imagen local por defecto si falla
    img.onerror = function () {
      this.src = "img/sin-imagen.png";
    };

    // Añadimos la imagen al su contenedor
    contenedorImg.append(img);

    // Creamos el div para la información (texto)
    const divInfo = document.createElement("div");

    // Asignamos la clase CSS info-bicicleta
    divInfo.className = "info-bicicleta";

    // Creamos el título (h3) para el nombre
    const nombre = document.createElement("h3");

    // Asignamos la clase CSS nombre-bicicleta
    nombre.className = "nombre-bicicleta";

    // Asignamos el texto del nombre
    nombre.textContent = `Nombre: ${bici.nom}`;

    // Creamos el div para la categoría
    const categoria = document.createElement("div");

    // Asignamos la clase CSS categoria-bicicleta
    categoria.className = "categoria-bicicleta";

    // Asignamos el texto de la categoría
    categoria.textContent = `Categoría: ${bici.cat}`;

    // Creamos el párrafo para la descripción
    const desc = document.createElement("p");

    // Asignamos la clase CSS desc-bicicleta
    desc.className = "desc-bicicleta";

    // Asignamos el texto de la descripción
    desc.textContent = `Descripción: ${bici.des}`;

    // Añadimos los elementos (nombre, descripción, categoría) al div de información
    divInfo.append(nombre, desc, categoria);

    // Añadimos el contenedor de imagen a la tarjeta
    tarjeta.append(contenedorImg);

    // Añadimos el div de información a la tarjeta
    tarjeta.append(divInfo);

    // Añadimos la tarjeta completa al grid principal
    grid.append(tarjeta);
  });
}

/*
Función para mostrar un mensaje de error en el contenedor indicado. Se puede 
personalizar el mensaje, pero por defecto muestra "Error al cargar datos."
  contenedor: Elemento HTML donde se mostrará el mensaje de error
  mensaje: Texto del mensaje de error (opcional) que por defecto es "Error al cargar datos."
*/
function mostrarErrorCarga(contenedor, mensaje = "Error al cargar datos.") {
  contenedor.innerHTML = `<p class="mensaje-error">${mensaje}</p>`;
}
