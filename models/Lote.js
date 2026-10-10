const JsonManager = require("./JsonManager");
const db = new JsonManager("lotes.json");

class Lote {
  constructor({ id = null, nombre_numero = "", id_productor = null } = {}) {
    this.id = id;
    this.nombre_numero = nombre_numero;
    this.id_productor = id_productor !== null ? parseInt(id_productor) : null;
  }

  // Validación de reglas de negocio
  validar() {
    if (
      !this.nombre_numero ||
      typeof this.nombre_numero !== "string" ||
      this.nombre_numero.trim() === ""
    ) {
      throw new Error("El nombre o número de lote es obligatorio.");
    }

    if (!this.id_productor || isNaN(this.id_productor)) {
      throw new Error(
        "El lote debe pertenecer a un productor válido (id_productor requerido)."
      );
    }

    return true;
  }

  toJSON() {
    return {
      nombre_numero: this.nombre_numero.trim(),
      id_productor: this.id_productor,
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
    const nuevoLote = new Lote(data);
    nuevoLote.validar();
    return db.create(nuevoLote.toJSON());
  }

  static update(id, data) {
    const actual = db.findById(id);
    if (!actual) return null;

    const loteActualizado = new Lote({
      id: actual.id,
      nombre_numero:
        data.nombre_numero !== undefined
          ? data.nombre_numero
          : actual.nombre_numero,
      id_productor:
        data.id_productor !== undefined
          ? data.id_productor
          : actual.id_productor,
    });

    loteActualizado.validar();
    return db.update(id, loteActualizado.toJSON());
  }

  static delete(id) {
    return db.delete(id);
  }
}

module.exports = Lote;