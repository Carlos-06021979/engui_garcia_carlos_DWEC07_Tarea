// Constante con la URL de la API de bicicletas
const URL_API = "http://api.raulserranoweb.es/rest.php";

// Constante con la URL base de las imágenes de las bicicletas
const URL_IMG_BASE = "http://api.raulserranoweb.es/imagenes_art/";

// Array de objetos de ejemplo de bicicletas por si fallara la carga desde la API externa
const BICICLETAS_EJEMPLO = [
  {
    cod: 1,
    nom: "Montaña Xtreme",
    cat: "Montaña",
    des: "Ideal para senderos difíciles.",
  },
  {
    cod: 2,
    nom: "Speed Road",
    cat: "Carretera",
    des: "Velocidad pura en asfalto.",
  },
  {
    cod: 3,
    nom: "City Cruiser",
    cat: "Paseo",
    des: "Comodidad para la ciudad.",
  },
  {
    cod: 4,
    nom: "Electric Power",
    cat: "Eléctrica",
    des: "Sube cuestas sin esfuerzo.",
  },
];
