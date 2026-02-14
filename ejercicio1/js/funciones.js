/*
 Función para mostrar la tabla de usuarios
    usuarios: Lista de usuarios a mostrar
    cuerpoTabla: Elemento tbody donde insertar las filas de usuarios
    mensajeSinResultados: Elemento mensaje "sin resultados" para mostrar u ocultar según corresponda
 */
function renderizarUsuarios(usuarios, cuerpoTabla, mensajeSinResultados) {
  cuerpoTabla.innerHTML = ""; // Limpiamos el contenido actual de la tabla

  // Si no hay usuarios, mostramos el mensaje de sin resultados
  if (usuarios.length === 0) mensajeSinResultados.classList.remove("oculto");
  // Si hay usuarios, ocultamos el mensaje de sin resultados
  else mensajeSinResultados.classList.add("oculto");

  // Recorremos cada usuario y creamos una fila en la tabla
  usuarios.forEach((usuario) => {
    const fila = document.createElement("tr"); // Creamos la fila

    const celdaNombre = document.createElement("td"); // Creamos la celda para el nombre

    celdaNombre.textContent = usuario.name; // Le asignamos el nombre del usuario

    const celdaCalle = document.createElement("td"); // Creamos la celda para la calle

    celdaCalle.textContent = usuario.address.street; // Le asignamos la calle del usuario

    const celdaCiudad = document.createElement("td"); // Creamos la celda para la ciudad

    celdaCiudad.textContent = usuario.address.city; // Le asignamos la ciudad del usuario

    // Añadimos las celdas nombre, calle y ciudad a la fila
    fila.append(celdaNombre, celdaCalle, celdaCiudad);

    cuerpoTabla.appendChild(fila); // Añadimos la fila al cuerpo de la tabla
  });
}

/*
Función para mostrar u ocultar el botón limpiar según el contenido del input de búsqueda. 
Si el input tiene texto, se muestra el botón y si está vacío, se oculta.
  input: Input de búsqueda
  btn: Botón limpiar
*/
function alternarBtnLimpiar(input, btn) {
  // Si el input tiene contenido, mostramos el botón limpiar
  if (input.value.length > 0) btn.classList.remove("oculto");
  // Si el input está vacío, ocultamos el botón limpiar
  else btn.classList.add("oculto"); // Ocultamos el botón
}


/*
Función para ordenar el array de usuarios según la columna y dirección indicadas.
  columna: Columna por la que ordenar (name, street, city)
  direccion: Dirección en la que ordenar (ascendente o descendente)
  arrayUsuarios: Array de usuarios a ordenar
*/
function ordenarArrayUsuarios(columna, direccion, arrayUsuarios) {
  // Ordenamos el array con el método sort
  arrayUsuarios.sort((a, b) => {
    let valorA, valorB; // Variables para almacenar los valores a comparar

    // Si la columna es name, comparamos por el nombre del usuario
    if (columna === "name") {
      valorA = a.name.toLowerCase(); // Valor del nombre del usuario A

      valorB = b.name.toLowerCase(); // Valor del nombre del usuario B

      // Si la columna es street, comparamos por la calle del usuario
    } else if (columna === "street") {
      valorA = a.address.street.toLowerCase(); // Valor de la calle del usuario A

      valorB = b.address.street.toLowerCase(); // Valor de la calle del usuario B

      // Si la columna es city, comparamos por la ciudad del usuario
    } else if (columna === "city") {
      valorA = a.address.city.toLowerCase(); // Valor de la ciudad del usuario A

      valorB = b.address.city.toLowerCase(); // Valor de la ciudad del usuario B
    }

    // Comparación para ordenar según la dirección (ascendente o descendente)
    // Si valorA es menor retorna -1 para ascendente o 1 para descendente
    if (valorA < valorB) return direccion === "asc" ? -1 : 1;

    // Si valorA es mayor que valorB, retornamos 1 para ascendente o -1 para descendente
    if (valorA > valorB) return direccion === "asc" ? 1 : -1; // Si valorA es mayor

    return 0; // Retorna 0 si son iguales
  });
}

/*
Función para filtrar la lista de usuarios según la consulta y el ámbito de búsqueda.
  usuarios: Array de usuarios a filtrar
  consulta: Texto a buscar (ya en minúsculas)
  buscarEnTodo: Si es true busca en calle y ciudad también, si es false solo busca en el nombre
*/
function filtrarListaUsuarios(usuarios, consulta, buscarEnTodo) {
  if (!consulta) return [...usuarios]; // Si no hay consulta, retornamos todos los usuarios

  // Filtramos el array de usuarios
  // Retornamos un nuevo array con los usuarios que cumplen la condición de búsqueda
  return usuarios.filter((usuario) => {
    const nombre = usuario.name.toLowerCase(); // Obtenemos el nombre en minúsculas

    // Si buscarEnTodo es true, buscamos en nombre, calle y ciudad
    if (buscarEnTodo) {
      const calle = usuario.address.street.toLowerCase(); // Obtenemos la calle en minúsculas

      const ciudad = usuario.address.city.toLowerCase(); // Obtenemos la ciudad en minúsculas

      // Retornamos true si la consulta está en alguno de los campos
      return (
        nombre.includes(consulta) ||
        calle.includes(consulta) ||
        ciudad.includes(consulta)
      );

      // Si buscarEnTodo es false, solo buscamos en el nombre
    } else return nombre.includes(consulta); // Retornamos true si la consulta está en el nombre
  });
}
