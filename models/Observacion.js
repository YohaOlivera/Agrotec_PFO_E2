const JsonManager = require("./JsonManager");
const db = new JsonManager("observaciones.json");

class Observacion {
  constructor({
    id = null,
    id_lote,
    id_tecnico,
    fecha,
    tipo_cultivo,
    estado_cultivo = "",
    observaciones = "",
    nivel_alerta,
    activa = true,
  } = {}) {
    this.id = id;
    this.id_lote = id_lote ? parseInt(id_lote) : null;
    this.id_tecnico = id_tecnico ? parseInt(id_tecnico) : null;
    this.fecha = fecha;
    this.tipo_cultivo = tipo_cultivo;
    this.estado_cultivo = estado_cultivo;
    this.observaciones = observaciones;
    this.nivel_alerta = nivel_alerta;
    this.activa = activa !== false;
  }

  toJSON() {
    return {
      id_lote: this.id_lote,
      id_tecnico: this.id_tecnico,
      fecha: this.fecha,
      tipo_cultivo: this.tipo_cultivo,
      estado_cultivo: this.estado_cultivo,
      observaciones: this.observaciones,
      nivel_alerta: this.nivel_alerta,
      activa: this.activa,
    };
  }

  static getAll() {
    return db.findAll().filter((obs) => obs.activa !== false);
  }

  static getById(id) {
    const obs = db.findById(id);
    if (obs && obs.activa !== false) return obs;
    return null;
  }

  static getByLote(idLote) {
    return this.getAll().filter((obs) => obs.id_lote === parseInt(idLote));
  }

  static getByNivelAlerta(nivel) {
    return this.getAll().filter((obs) => obs.nivel_alerta === nivel);
  }

  static create(data) {
    const nuevaObs = new Observacion({ ...data, activa: true });
    return db.create(nuevaObs.toJSON());
  }

  static update(id, data) {
    return db.update(id, data);
  }

  static delete(id) {
    return db.update(id, { activa: false });
  }
}

module.exports = Observacion;