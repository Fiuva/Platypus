const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Calidad = Object.freeze({
    Comun: {
        nombre: "Común",
        color: "#E6E6FA"
    },
    Especial: {
        nombre: "Especial",
        color: "#98FB98"
    },
    Raro: {
        nombre: "Raro",
        color: "#4169E1"
    },
    Ultra_raro: {
        nombre: "Ultra Raro",
        color: "#C71585"
    },
    Legendario: {
        nombre: "Legendario",
        color: "#FFDAB9"
    },
})

const Clase = Object.freeze({
    Pez: "Peces",
    Reptil: "Reptiles",
    Ave: "Aves",
    Mamifero: "Mamíferos",
    Roedor: "Roedores",
    Equinodermo: "Equinodermos",
    Anelido: "Anélidos",
    Insecto: "Insectos",
    Anfibio: "Anfibios",
    Crustaceo: "Crustáceos"
})
const Habitat = Object.freeze({
    Rio: "Rio",
    Oceano: "Océano",
    Granja: "Granja",
    Hielo: "Hielo",
    Desierto: "Desierto",
    Sabana: "Sabana",
    Monte: "Montaña",
    Bosque: "Bosque",
    Selva: "Selva",
    Tierra: "Tierra",
    Meseta: "Meseta",
    Casa: "Tú casa"
})
const Modo = Object.freeze({
    Normal: "Normal",
    Sudoroso: "Sudoroso",
    Lechoso: "Lechoso"
})
function Animal(nombre, clase, habitat, calidad) {
    this.nombre = nombre;
    this.clase = clase;
    this.habitat = habitat;
    this.calidad = calidad;
}

const wiki = Object.freeze({
    animales: [
        new Animal("Pez", Clase.Pez, Habitat.Rio, Calidad.Comun),
        new Animal("Pollo", Clase.Ave, Habitat.Granja, Calidad.Comun),
        new Animal("Gato", Clase.Mamifero, Habitat.Casa, Calidad.Comun),
        new Animal("Perro", Clase.Mamifero, Habitat.Casa, Calidad.Comun),
        new Animal("Conejo", Clase.Mamifero, Habitat.Casa, Calidad.Comun),
        new Animal("Pato", Clase.Ave, Habitat.Rio, Calidad.Comun),
        new Animal("Ratón", Clase.Roedor, Habitat.Casa, Calidad.Comun),
        new Animal("Lombriz", Clase.Anelido, Habitat.Tierra, Calidad.Comun),
        new Animal("Mariposa", Clase.Insecto, Habitat.Selva, Calidad.Comun),
        new Animal("Cangrejo", Clase.Crustaceo, Habitat.Oceano, Calidad.Comun),
        new Animal("Gamba", Clase.Crustaceo, Habitat.Oceano, Calidad.Comun),
        new Animal("Cabra", Clase.Mamifero, Habitat.Monte, Calidad.Comun),
        new Animal("Sapo", Clase.Anfibio, Habitat.Bosque, Calidad.Comun),
        new Animal("Elefante", Clase.Mamifero, Habitat.Sabana, Calidad.Comun),
        new Animal("Mono", Clase.Mamifero, Habitat.Selva, Calidad.Comun),
        new Animal("Morsa", Clase.Mamifero, Habitat.Hielo, Calidad.Comun),

        new Animal("Cocodrilo", Clase.Reptil, Habitat.Rio, Calidad.Especial),
        new Animal("Gato salvaje", Clase.Mamifero, Habitat.Bosque, Calidad.Especial),
        new Animal("León", Clase.Mamifero, Habitat.Sabana, Calidad.Especial),
        new Animal("Leopardo", Clase.Mamifero, Habitat.Sabana, Calidad.Especial),
        new Animal("Oso", Clase.Mamifero, Habitat.Bosque, Calidad.Especial),
        new Animal("Ardilla", Clase.Roedor, Habitat.Bosque, Calidad.Especial),
        new Animal("Tucán", Clase.Ave, Habitat.Selva, Calidad.Especial),
        new Animal("Cacatúa", Clase.Ave, Habitat.Bosque, Calidad.Especial),
        new Animal("Hámster", Clase.Roedor, Habitat.Casa, Calidad.Especial),
        new Animal("Tiburón", Clase.Pez, Habitat.Oceano, Calidad.Especial),
        new Animal("Jirafa", Clase.Mamifero, Habitat.Sabana, Calidad.Especial),
        new Animal("Luciérnaga", Clase.Insecto, Habitat.Rio, Calidad.Especial),
        new Animal("Rinoceronte", Clase.Mamifero, Habitat.Sabana, Calidad.Especial),
        new Animal("Anchoa", Clase.Pez, Habitat.Oceano, Calidad.Especial),
        new Animal("Mapache", Clase.Mamifero, Habitat.Bosque, Calidad.Especial),

        new Animal("Gallina", Clase.Ave, Habitat.Granja, Calidad.Raro),
        new Animal("Cerdo", Clase.Mamifero, Habitat.Granja, Calidad.Raro),
        new Animal("Castor", Clase.Roedor, Habitat.Rio, Calidad.Raro),
        new Animal("Capibara", Clase.Roedor, Habitat.Bosque, Calidad.Raro),
        new Animal("Oso polar", Clase.Mamifero, Habitat.Hielo, Calidad.Raro),
        new Animal("Rape", Clase.Pez, Habitat.Oceano, Calidad.Raro),
        new Animal("Pez ballesta", Clase.Pez, Habitat.Oceano, Calidad.Raro),
        new Animal("Rata", Clase.Roedor, Habitat.Casa, Calidad.Raro),
        new Animal("Zorro", Clase.Mamifero, Habitat.Bosque, Calidad.Raro),
        new Animal("Camaleón", Clase.Reptil, Habitat.Selva, Calidad.Raro),
        new Animal("Foca", Clase.Mamifero, Habitat.Hielo, Calidad.Raro),
        new Animal("Alpaca", Clase.Mamifero, Habitat.Meseta, Calidad.Raro),
        new Animal("Armadillo", Clase.Mamifero, Habitat.Bosque, Calidad.Raro),
        new Animal("Mofeta", Clase.Mamifero, Habitat.Bosque, Calidad.Raro),

        new Animal("Pingüino", Clase.Ave, Habitat.Hielo, Calidad.Ultra_raro),
        new Animal("Nutria", Clase.Mamifero, Habitat.Rio, Calidad.Ultra_raro),
        new Animal("Marmota", Clase.Roedor, Habitat.Monte, Calidad.Ultra_raro),
        new Animal("Equidna", Clase.Mamifero, Habitat.Desierto, Calidad.Ultra_raro),
        new Animal("Kiwi", Clase.Ave, Habitat.Bosque, Calidad.Ultra_raro),
        new Animal("Estrella de mar", Clase.Equinodermo, Habitat.Oceano, Calidad.Ultra_raro),
        new Animal("Dodo", Clase.Ave, Habitat.Bosque, Calidad.Ultra_raro),
        new Animal("Llama", Clase.Mamifero, Habitat.Meseta, Calidad.Ultra_raro),
        new Animal("Koala", Clase.Mamifero, Habitat.Bosque, Calidad.Ultra_raro),
        new Animal("Oso hormiguero", Clase.Mamifero, Habitat.Bosque, Calidad.Ultra_raro),

        new Animal("Ornitorrinco", Clase.Mamifero, Habitat.Rio, Calidad.Legendario),
        new Animal("Cuco ardilla", Clase.Ave, Habitat.Selva, Calidad.Legendario),
    ],

    filterAnimalesByCalidad(calidad) {
        return this.animales.filter(animal => animal.calidad == calidad);
    },
    filterAnimalesByClase(clase) {
        return this.animales.filter(animal => animal.clase == clase);
    },
    filterAnimalesByHabitat(habitat) {
        return this.animales.filter(animal => animal.habitat == habitat);
    },
})

class Mascota {
    constructor(animal) {
        this.nombre = animal.nombre;
        this.animal = animal;
        this.modo = Modo.Normal;
        this.exp = 0;
        this.refUltimoRol = new Date().getTime().toString();
    }
}

const mascotaSchema = new Schema({
    idDiscord: { type: String, unique: true },
    refRolMascota: { type: String, default: '0' },
    refRolMascotaP: { type: String, default: '0' },
    mascotas: { type: Array, default: [] }
})
const MascotasData = mongoose.model('Mascotas', mascotaSchema);

module.exports = { MascotasData, wiki, Mascota, Calidad, Clase, Habitat, Animal };