const mongoose = require("mongoose");
const Productor = require("../models/Productor");

// GET /api/productores
exports.getAll = async (req, res) => {
  try {
    const productores = await Productor.find();
    res.status(200).json(productores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productores" });
  }
};

// GET /api/productores/:id
exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de productor no válido" });
    }

    const productor = await Productor.findById(req.params.id);
    if (!productor) {
      return res.status(404).json({ error: "Productor no encontrado" });
    }
    res.status(200).json(productor);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el productor" });
  }
};

// POST /api/productores
exports.create = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, establecimiento } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({ error: "El nombre y el apellido son obligatorios" });
    }

    const nuevoProductor = await Productor.create({
      nombre,
      apellido,
      telefono,
      email,
      establecimiento,
    });
    res.status(201).json(nuevoProductor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/productores/:id
exports.update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de productor no válido" });
    }

    const { nombre, apellido, telefono, email, establecimiento } = req.body;

    const productorActualizado = await Productor.findByIdAndUpdate(
      req.params.id,
      { nombre, apellido, telefono, email, establecimiento },
      { new: true, runValidators: true }
    );

    if (!productorActualizado) {
      return res.status(404).json({ error: "Productor no encontrado" });
    }

    res.status(200).json(productorActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/productores/:id
exports.delete = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de productor no válido" });
    }

    const eliminado = await Productor.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Productor no encontrado" });
    }

    res.status(200).json({ mensaje: "Productor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el productor" });
  }
};