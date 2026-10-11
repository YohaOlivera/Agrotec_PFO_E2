const mongoose = require("mongoose");
const Tecnico = require("../models/Tecnico");

// GET /api/tecnicos
exports.getAll = async (req, res) => {
  try {
    const tecnicos = await Tecnico.find();
    res.status(200).json(tecnicos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener técnicos" });
  }
};

// GET /api/tecnicos/:id
exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de técnico no válido" });
    }

    const tecnico = await Tecnico.findById(req.params.id);
    if (!tecnico) {
      return res.status(404).json({ error: "Técnico no encontrado" });
    }
    res.status(200).json(tecnico);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el técnico" });
  }
};

// POST /api/tecnicos
exports.create = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, especialidad } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ error: "El nombre y el apellido son obligatorios" });
    }

    const nuevoTecnico = await Tecnico.create({
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
exports.update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de técnico no válido" });
    }

    const { nombre, apellido, telefono, email, especialidad } = req.body;

    const tecnicoActualizado = await Tecnico.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, telefono, email, especialidad },
      { new: true, runValidators: true }
    );

    if (!tecnicoActualizado) {
      return res.status(404).json({ error: "Técnico no encontrado" });
    }

    res.status(200).json(tecnicoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/tecnicos/:id
exports.delete = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de técnico no válido" });
    }

    const eliminado = await Tecnico.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Técnico no encontrado" });
    }

    res.status(200).json({ mensaje: "Técnico eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el técnico" });
  }
};