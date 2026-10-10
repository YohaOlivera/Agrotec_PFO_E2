const Persona = require("./Persona");
const JsonManager = require("./JsonManager");
const db = new JsonManager("productores.json");

class Productor extends Persona {
  constructor(datos = {}) {
    super(datos);
    // Nombre del establacimiento
    this.establecimiento = datos.establecimiento || "";
  }

  // Validación combinada (Persona + Productor)
  validar() {
    super.validar(); // Valida nombre y apellido
    return true;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      establecimiento: this.establecimiento.trim()
    };
  }

  // --- Métodos de persistencia ---
  static getAll() {
    return db.findAll();
  }

  static getById(id) {
    return db.findById(id);
  }

  static create(data) {
    const productor = new Productor(data);
    productor.validar();
    return db.create(productor.toJSON());
  }

  static update(id, data) {
    const actual = db.findById(id);
    if (!actual) return null;

    const productor = new Productor({ ...actual, ...data });
    productor.validar();

    return db.update(id, productor.toJSON());
  }

  static delete(id) {
    return db.delete(id);
  }
}

module.exports = Productor;