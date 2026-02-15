// Para obtener los datos

// Función asíncrona para obtener las bicicletas desde la API
async function servicioObtenerBicicletas(categoria) {
  let url = URL_API; // URL base de la API

  // Filtrado servidor (si la API funciona es lo ideal)
  if (categoria !== "Todas") url += `?cat=${encodeURIComponent(categoria)}`; // Añadimos el parámetro cat a la URL

  url = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  // Intentamos obtener los datos de la API
  try {
    const response = await fetch(url); // Hacemos la petición a la API

    // Si la respuesta no es OK, lanzamos un error
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`); // Lanzamos un error

    const datos = await response.json(); // Convertimos la respuesta a JSON

    return { exito: true, datos: datos }; // Retornamos los datos con marca de éxito

    // Si hay un error, lo capturamos y retornamos los datos de ejemplo
  } catch (error) {
    console.warn(
      "API Offline. Usando datos de ejemplo.", // Mostramos un aviso en la consola
    );

    // Como no podemos pedirle al servidor que filtre, filtramos nosotros el array local
    let datosFallback =
      typeof BICICLETAS_EJEMPLO !== "undefined" ? [...BICICLETAS_EJEMPLO] : []; // Copiamos los datos de ejemplo

    // Si la categoría no es "Todas", filtramos los datos localmente
    if (categoria !== "Todas") {
      datosFallback = datosFallback.filter(
        (bici) => bici.cat === categoria, // Filtramos por categoría
      );
    }

    return { exito: false, datos: datosFallback }; // Retornamos los datos de ejemplo con marca de error
  }
}
