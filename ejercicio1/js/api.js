// Para obtener los datos
/*
Función asíncrona para obtener los datos de la API
Si falla la conexión con la API, se utilizarán datos de ejemplo de solo los campos que usamos en la tabla.
*/
async function servicioObtenerUsuarios() {
  // Intentamos obtener los datos de la API
  try {
    // Hacemos la petición a la API (la tenemos en datos.js) y almacenamos la respuesta en la constante response
    const response = await fetch(URL_API);

    // Si la respuesta no es OK, lanzamos un error
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const datos = await response.json(); // Convertimos la respuesta a JSON

    // Retornamos un objeto con los valores true en la clave exito y los datos en la clave datos
    return { exito: true, datos: datos };

    // Si hay un error, lo capturamos y retornamos los datos de ejemplo
  } catch (error) {
    // Mostramos el error en la consola
    console.error("Error API:", error);

    // informamos al usuario que se están usando datos de ejemplo
    console.log("Usando datos de ejemplo");

    // Retornamos los datos de ejemplo (tenemos el array USUARIOS_EJEMPLO en datos.js) y false en la clave exito
    return { exito: false, datos: [...USUARIOS_EJEMPLO] };
  }
}
