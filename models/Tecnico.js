const Persona = require("./Persona");
const JsonManager = require("./JsonManager");
const db = new JsonManager("tecnicos.json");

class Tecnico extends Persona {
  constructor(datos = {}) {
    super(datos);
    // Atributo específico del técnico
    this.especialidad = datos.especialidad || "";
  }

  // Validación combinada (Persona + Tecnico)
  validar() {
    super.validar();
    return true;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      especialidad: this.especialidad.trim()
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
    const tecnico = new Tecnico(data);
    tecnico.validar();
    return db.create(tecnico.toJSON());
  }

  static update(id, data) {
    const actual = db.findById(id);
    if (!actual) return null;

    const tecnico = new Tecnico({ ...actual, ...data });
    tecnico.validar();

    return db.update(id, tecnico.toJSON());
  }

  static delete(id) {
    return db.delete(id);
  }
}

module.exports = Tecnico;