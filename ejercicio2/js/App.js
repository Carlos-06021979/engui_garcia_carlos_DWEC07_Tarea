// Clase AppCatalogo
class AppCatalogo {
  constructor() {
    // Referencias al DOM
    this.dom = {
      gridBicicletas: document.getElementById("gridBicicletas"), // Grid donde mostraremos las bicicletas

      selectCategoria: document.getElementById("selectCategoria"), // Select para filtrar por categoría

      mensajeCargando: document.getElementById("mensajeCargando"), // Mensaje de cargando
    };
  }

  /*
 Función para iniciar la aplicación. Configura los listeners de eventos 
 y realiza la carga inicial de bicicletas.
*/
  iniciar() {
    this.configurarListeners(); // Configura los listeners de eventos

    // Carga inicial
    this.cargarBicicletas("Todas"); // Cargamos todas las bicicletas al inicio
  }

  // Función para configurar los listeners de eventos (por ahora sólo 1)
  configurarListeners() {
    // Capturamos el evento change del select de categoría
    this.dom.selectCategoria.addEventListener("change", (e) => {
      this.cargarBicicletas(e.target.value); // Cargamos las bicicletas de la categoría seleccionada
    });
  }

  /*
  Función asíncrona para cargar las bicicletas desde la API y renderizarlas en el grid.
  categoria: Categoría de bicicletas a cargar (Todas, Carretera, Gravel, MTB)
  */
  async cargarBicicletas(categoria) {
    
    // Si tenemos un mensaje de cargando, lo mostramos
    if (this.dom.mensajeCargando)
      this.dom.mensajeCargando.classList.remove("oculto"); // Quitamos la clase oculto

    this.dom.gridBicicletas.innerHTML = ""; // Limpiamos el grid

    // Intentamos obtener las bicicletas
    try {
      const resultado = await servicioObtenerBicicletas(categoria); // Obtenemos las bicicletas

      // Si es exitoso, renderizamos las bicicletas
      if (resultado.exito)
        renderizarBicicletas(resultado.datos, this.dom.gridBicicletas);
      // Si no es exitoso, mostramos un mensaje de error
      else {
        this.dom.gridBicicletas.innerHTML = `<p style="color: red; text-align: center; width: 100%;">Error al cargar datos. Verifique su conexión.</p>`;
      }
      //
    } finally {
      // Si tenemos un mensaje de cargando, lo ocultamos
      if (this.dom.mensajeCargando)
        this.dom.mensajeCargando.classList.add("oculto"); // Añadimos la clase oculto
    }
  }
}

// Instanciamos y arrancamos la aplicación
const app = new AppCatalogo();

app.iniciar();
