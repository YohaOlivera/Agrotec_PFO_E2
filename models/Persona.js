class Persona {
  constructor({ id = null, nombre = "", apellido = "", telefono = "", email = "" } = {}) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
  }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  // Validaciones
  validar() {
    if (!this.nombre || typeof this.nombre !== "string" || this.nombre.trim() === "") {
      throw new Error("El nombre es obligatorio.");
    }
    if (!this.apellido || typeof this.apellido !== "string" || this.apellido.trim() === "") {
      throw new Error("El apellido es obligatorio.");
    }
    return true;
  }

  toJSON() {
    return {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      telefono: this.telefono.trim(),
      email: this.email.trim()
    };
  }
}

module.exports = Persona;