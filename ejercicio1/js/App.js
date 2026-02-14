// Clase App
class App {
  constructor() {
    // Inicializamos estado de la aplicación
    this.estado = {
      todosUsuarios: [], // Array con todos los usuarios vacío

      usuariosFiltrados: [], // Array con los usuarios filtrados vacío

      // Configuración del orden (columna y dirección)
      orden: {
        columna: null, // Columna por la que ordenar (name, street, city)

        direccion: "asc", // Dirección del orden (asc o desc)
      },

      filtroTiempoReal: false, // Filtro en tiempo real por defecto lo inicializamos en false (desactivado)

      filtroCualquierCampo: false, // Filtro en cualquier campo por defecto lo inicializamos en false (desactivado)
    };

    // Recuperamos referencias al DOM y las guardamos en el objeto dom
    this.dom = {
      // Recuperamos el cuerpo de la tabla para insertar los usuarios
      cuerpoTabla: document.querySelector("#tablaUsuarios tbody"),

      // Recuperamos el elemento input de búsqueda
      inputBusqueda: document.getElementById("inputBusqueda"),

      // Recuperamos el elemento botón de búsqueda
      btnBuscar: document.getElementById("btnBuscar"),

      // Recuperamos el elemento botón de limpiar
      btnLimpiar: document.getElementById("btnLimpiar"),

      // Recuperamos el mensaje de sin resultados
      mensajeSinResultados: document.getElementById("sinResultados"),

      //  Recuperamos el mensaje de cargando
      mensajeCargando: document.getElementById("mensajeCargando"),

      // Recuperamos el toggle de tiempo real
      toggleTiempoReal: document.getElementById("toggleTiempoReal"),

      // Recuperamos el toggle de ámbito de búsqueda
      toggleAmbitoBusqueda: document.getElementById("toggleAmbitoBusqueda"),

      // Recuperamos el thead de la tabla (Delegación de eventos)
      theadTabla: document.querySelector("#tablaUsuarios thead"),

      // Recuperamos el contenedor de los controles
      contenedorControles: document.querySelector(".contenedor-controles"),
    };
  }

  // Función asíncrona para cargar los usuarios
  async cargarUsuarios() {
    // Si existe el mensaje de cargando, lo mostramos
    if (this.dom.mensajeCargando)
      this.dom.mensajeCargando.classList.remove("oculto"); // Quitamos la clase oculto

    // Limpiamos el cuerpo de la tabla
    this.dom.cuerpoTabla.innerHTML = ""; // Vaciamos el contenido

    // Probamos a obtener los usuarios
    try {
      // Usamos el servicio (api.js) para obtener los usuarios
      const resultado = await servicioObtenerUsuarios();

      // Guardamos los usuarios en el estado
      this.estado.todosUsuarios = resultado.datos; // Guardamos los datos

      // Si no es exitoso, mostramos aviso offline
      if (!resultado.exito) this.mostrarAvisoOffline(); // Mostramos el aviso

      // Config inicial
      this.estado.orden.columna = "name"; // Columna name por defecto

      this.estado.orden.direccion = "asc"; // Dirección asc por defecto

      this.estado.usuariosFiltrados = [...this.estado.todosUsuarios]; // Copiamos los usuarios

      this.aplicarOrden(); // Aplicamos el orden inicial

      this.actualizarIconosOrden(); // Actualizamos los iconos de orden
    } finally {
      // Si existe el mensaje de cargando, lo ocultamos
      if (this.dom.mensajeCargando)
        this.dom.mensajeCargando.classList.add("oculto"); // Añadimos la clase oculto
    }
  }

  // Función para mostrar aviso offline
  mostrarAvisoOffline() {
    // Si ya existe el aviso, no lo mostramos de nuevo saliendo de la función
    if (document.querySelector(".aviso-offline")) return; // Salimos de la función

    // Creamos un elemento párrafo (p) para el aviso
    const aviso = document.createElement("p");

    // Le asignamos el texto del aviso
    aviso.textContent = "⚠️Modo Offline: Mostrando datos de ejemplo";

    // Le asignamos la clase aviso-offline
    aviso.classList.add("aviso-offline");

    // Insertamos el aviso después del contenedor de los controles
    this.dom.contenedorControles.after(aviso); // Lo insertamos en el DOM
  }


  // Función para configurar los listeners
  configurarListeners() {
    // Capturamos el evento click del botón buscar el cual llama a la función filtrarUsuarios
    this.dom.btnBuscar.addEventListener("click", () => this.filtrarUsuarios());

    // Capturamos el evento input del input de búsqueda para alternar el botón limpiar y llamar a la función filtrarUsuarios
    this.dom.inputBusqueda.addEventListener("input", () => {
      alternarBtnLimpiar(this.dom.inputBusqueda, this.dom.btnLimpiar); // Alternamos el botón limpiar

      // Actualizamos el estado de los filtros
      this.actualizarEstadoFiltros();

      // Si el filtro es en tiempo real o el input está vacío...
      if (
        this.estado.filtroTiempoReal ||
        this.dom.inputBusqueda.value.trim() === ""
      ) {
        // ...llamamos a la función filtrarUsuarios
        this.filtrarUsuarios();
      }
    });

    // Capturamos el evento keyup del input de búsqueda para llamar a la función filtrarUsuarios cuando se presiona y se suelta la tecla Enter
    this.dom.inputBusqueda.addEventListener("keyup", (e) => {
      if (e.key === "Enter") this.filtrarUsuarios(); // Si se presiona Enter, filtramos
    });

    /*
    Capturamos el evento click del botón limpiar el cual:
       -Vacía el input
       -Alternamos el botón limpiar
       -Le damos el foco al input
       -Llama a la función filtrarUsuarios
    */
    this.dom.btnLimpiar.addEventListener("click", () => {
      this.dom.inputBusqueda.value = ""; // Vaciamos el input

      alternarBtnLimpiar(this.dom.inputBusqueda, this.dom.btnLimpiar); // Alternamos el botón limpiar

      this.dom.inputBusqueda.focus(); // Le damos el foco al input

      this.filtrarUsuarios(); // Llamamos a la función filtrarUsuarios
    });

    /*
    Capturamos el evento change del toggle de tiempo real el cual:
       -Actualiza el estado de los filtros
       -Deshabilita el botón buscar si el filtro es en tiempo real
       -Si el filtro es en tiempo real y el input no está vacío,
       llama a la función filtrarUsuarios
    */
    this.dom.toggleTiempoReal.addEventListener("change", () => {
      this.actualizarEstadoFiltros(); // Actualizamos el estado de los filtros

      this.dom.btnBuscar.disabled = this.estado.filtroTiempoReal; // Deshabilitamos el botón buscar si el filtro es en tiempo real

      // Si el filtro es en tiempo real y el input no está vacío llama a la función filtrarUsuarios
      if (this.estado.filtroTiempoReal && this.dom.inputBusqueda.value)
        this.filtrarUsuarios(); // Filtramos los usuarios
    });

    /*
    Capturamos el evento change del toggle de ámbito de búsqueda el cual:
       -Actualiza el estado de los filtros
       -Actualiza el placeholder del input de búsqueda
       -Si el input no está vacío llama a la función filtrarUsuarios
    */
    this.dom.toggleAmbitoBusqueda.addEventListener("change", () => {
      this.actualizarEstadoFiltros(); // Actualizamos el estado de los filtros

      // Placeholder dependiente si el filtro es en cualquier campo o solo nombre
      this.dom.inputBusqueda.placeholder = this.estado.filtroCualquierCampo
        ? "Buscar por nombre, calle o ciudad..." // Si es en cualquier campo
        : "Buscar por nombre..."; // Si es solo nombre

      // Si el input no está vacío llama a la función filtrarUsuarios
      if (this.dom.inputBusqueda.value) this.filtrarUsuarios(); // Filtramos
    });

    // Capturamos el evento click en el THEAD (Delegación de Eventos)
    this.dom.theadTabla.addEventListener("click", (e) => {

      // Buscamos el elemento TH más cercano al click (por si clicamos en el span interno)
      const th = e.target.closest("th"); // Obtenemos el TH

      // Si existe un TH y tiene el atributo data-ordenar
      if (th && th.dataset.ordenar) {

        const columna = th.dataset.ordenar; // Obtenemos la columna

        this.manejarClickOrden(columna, th); // Manejamos el click
      }
    });
  }

  // Función para actualizar el estado de los filtros
  actualizarEstadoFiltros() {

    this.estado.filtroTiempoReal = this.dom.toggleTiempoReal.checked; // Actualizamos el estado del filtro de tiempo real

    this.estado.filtroCualquierCampo = this.dom.toggleAmbitoBusqueda.checked; // Actualizamos el estado del filtro de ámbito de búsqueda
  }


  // Función para filtrar los usuarios
  filtrarUsuarios() {

    const consulta = this.dom.inputBusqueda.value.toLowerCase().trim(); // Obtenemos la consulta (con minúsculas y sin espacios en blanco)

    // Si la consulta está vacía, mostramos todos los usuarios
    if (!consulta)
      this.estado.usuariosFiltrados = [...this.estado.todosUsuarios]; // Copiamos todos los usuarios
    // Si no está vacía...
    else {
      // ...filtramos los usuarios
      this.estado.usuariosFiltrados = this.estado.todosUsuarios.filter(
        (usuario) => {
          // Obtenemos los datos del usuario (con minúsculas y sin espacios en blanco)
          const nombre = usuario.name.toLowerCase();

          // Si el usuario tiene dirección, obtenemos los datos de la dirección (con minúsculas y sin espacios en blanco)
          const calle = usuario.address?.street.toLowerCase() || "";

          // Si el usuario tiene dirección, obtenemos los datos de la dirección (con minúsculas y sin espacios en blanco)
          const ciudad = usuario.address?.city.toLowerCase() || "";

          // Si el filtro es en cualquier campo...
          if (this.estado.filtroCualquierCampo) {
            // ...retornamos true si el nombre, la calle o la ciudad incluyen la consulta
            return (
              nombre.includes(consulta) ||
              calle.includes(consulta) ||
              ciudad.includes(consulta)
            );
          }

          // Si el filtro es en nombre, retornamos true si el nombre incluye la consulta
          else return nombre.includes(consulta); // Retornamos true si el nombre incluye la consulta
        },
      );
    }

    // Si hay orden aplicado, aplicamos orden
    if (this.estado.orden.columna)
      this.aplicarOrden(); 

    // Si no hay orden aplicada, renderizamos (mostramos los resultados filtrados)
    else this.render(); // Renderizamos
  }


  // Función que maneja el clic en una cabecera de la tabla
  manejarClickOrden(columna, thElemento) {

    // Recorremos las cabeceras para resetear estilos
    // Nota: Podríamos cachearlas o buscarlas aquí dinámicamente
    const todasLasCabeceras = this.dom.theadTabla.querySelectorAll("th"); // Obtenemos todas las cabeceras

    todasLasCabeceras.forEach((th) => {

      // Si no es la cabecera clicada, quitamos las clases de orden
      if (th !== thElemento) th.classList.remove("sort-asc", "sort-desc"); // Quitamos las clases
    });

    // Si la columna clicada es la misma que la ordenada...
    if (this.estado.orden.columna === columna) {
      // ...invertimos la dirección (de asc a desc o viceversa)
      this.estado.orden.direccion =
        this.estado.orden.direccion === "asc" ? "desc" : "asc"; // Invertimos

      // Si no es la misma, ordenamos por la columna clicada
    } else {
      this.estado.orden.columna = columna; // Columna clicada

      this.estado.orden.direccion = "asc"; // Inicializamos dirección
    }

    // Actualizamos el icono de orden
    thElemento.classList.remove("sort-asc", "sort-desc"); // Quitamos las clases previas

    thElemento.classList.add(`sort-${this.estado.orden.direccion}`); // Añadimos la clase correspondiente

    this.aplicarOrden(); // Aplicamos el orden
  }


  // Función que actualiza los iconos de orden
  actualizarIconosOrden() {
    const col = this.estado.orden.columna; // Columna ordenada

    const dir = this.estado.orden.direccion; // Dirección ordenada

    const th = document.querySelector(`th[data-ordenar="${col}"]`); // Cabecera ordenada

    // Si hay cabecera ordenada, añadimos la clase de orden
    if (th) th.classList.add(`sort-${dir}`); // Añadimos la clase de orden
  }


  // Función que aplica ordenación y renderiza (muestra los resultados ordenados)
  aplicarOrden() {

    // Desestructuramos el estado de orden
    const { columna, direccion } = this.estado.orden; // Columna y dirección ordenada

    // Ordenamos el array de usuarios filtrados
    ordenarArrayUsuarios(columna, direccion, this.estado.usuariosFiltrados); // Llamamos a la función de ordenación

    // Renderizamos (mostramos los resultados ordenados)
    this.render(); // Llamamos a render
  }

  // Función que renderiza (muestra los resultados ordenados)
  render() {
    renderizarUsuarios(

      this.estado.usuariosFiltrados, // Usuarios filtrados

      this.dom.cuerpoTabla, // Cuerpo de la tabla

      this.dom.mensajeSinResultados, // Mensaje de sin resultados
    );
  }


  // Función asíncrona que inicia la aplicación
  async iniciar() {

    this.configurarListeners(); // Configura los listeners de eventos

    await this.cargarUsuarios(); // Carga los usuarios desde la API
  }
}

const app = new App(); // Instanciamos App

app.iniciar(); // Iniciamos la aplicación
