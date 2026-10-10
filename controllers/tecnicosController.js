const Tecnico = require("../models/Tecnico");

// GET /api/tecnicos
exports.getAll = (req, res) => {
  try {
    const tecnicos = Tecnico.getAll();
    res.status(200).json(tecnicos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener técnicos" });
  }
};

// GET /api/tecnicos/:id
exports.getById = (req, res) => {
  try {
    const tecnico = Tecnico.getById(req.params.id);
    if (!tecnico)
      return res.status(404).json({ error: "Técnico no encontrado" });
    res.status(200).json(tecnico);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el técnico" });
  }
};

// POST /api/tecnicos
exports.create = (req, res) => {
  try {
    const { nombre, apellido, telefono, email, especialidad } = req.body;
    const nuevoTecnico = Tecnico.create({
      nombre,
      apellido,
      telefono,
      email,
      especialidad,
    });
    res.status(201).json(nuevoTecnico);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/tecnicos/:id
exports.update = (req, res) => {
  try {
    const { nombre, apellido, telefono, email, especialidad } = req.body;
    const tecnicoActualizado = Tecnico.update(req.params.id, {
      nombre,
      apellido,
      telefono,
      email,
      especialidad,
    });

    if (!tecnicoActualizado)
      return res.status(404).json({ error: "Técnico no encontrado" });
    res.status(200).json(tecnicoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/tecnicos/:id
exports.delete = (req, res) => {
  try {
    const eliminado = Tecnico.delete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ error: "Técnico no encontrado" });
    res.status(200).json({ mensaje: "Técnico eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el técnico" });
  }
};
