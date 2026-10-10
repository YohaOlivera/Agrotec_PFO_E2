const JsonManager = require("./JsonManager");
const db = new JsonManager("tipos_cultivo.json");

class TipoCultivo {
  static getAll() {
    return db.findAll();
  }

  static getById(id) {
    return db.findById(id);
  }

  static create(data) {
    return db.create(data);
  }

  static update(id, data) {
    return db.update(id, data);
  }

  static delete(id) {
    return db.delete(id);
  }
}

module.exports = TipoCultivo;
