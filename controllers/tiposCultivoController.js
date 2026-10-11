const mongoose = require("mongoose");
const TipoCultivo = require("../models/TipoCultivo");

// GET /api/tipos-cultivo
exports.getAll = async (req, res) => {
  try {
    const tipos = await TipoCultivo.find();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tipos de cultivo" });
  }
};

// GET /api/tipos-cultivo/:id
exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de tipo de cultivo no válido" });
    }

    const tipo = await TipoCultivo.findById(req.params.id);
    if (!tipo) {
      return res.status(404).json({ error: "Tipo de cultivo no encontrado" });
    }
    res.status(200).json(tipo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tipo de cultivo" });
  }
};

// POST /api/tipos-cultivo
exports.create = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre del cultivo es obligatorio" });
    }

    const nuevoTipo = await TipoCultivo.create({ nombre: nombre.trim() });
    res.status(201).json(nuevoTipo);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "El tipo de cultivo ya existe" });
    }
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/tipos-cultivo/:id
exports.update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de tipo de cultivo no válido" });
    }

    const { nombre } = req.body;
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: "El nombre del cultivo es obligatorio" });
    }

    const tipoActualizado = await TipoCultivo.findByIdAndUpdate(
      req.params.id,
      { nombre: nombre.trim() },
      { new: true, runValidators: true }
    );

    if (!tipoActualizado) {
      return res.status(404).json({ error: "Tipo de cultivo no encontrado" });
    }

    res.status(200).json(tipoActualizado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "El tipo de cultivo ya existe" });
    }
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/tipos-cultivo/:id
exports.delete = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de tipo de cultivo no válido" });
    }

    const eliminado = await TipoCultivo.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Tipo de cultivo no encontrado" });
    }

    res.status(200).json({ mensaje: "Tipo de cultivo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tipo de cultivo" });
  }
};