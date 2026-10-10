const Productor = require("../models/Productor");

// GET /api/productores
exports.getAll = (req, res) => {
  try {
    const productores = Productor.getAll();
    res.status(200).json(productores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productores" });
  }
};

// GET /api/productores/:id
exports.getById = (req, res) => {
  try {
    const productor = Productor.getById(req.params.id);
    if (!productor)
      return res.status(404).json({ error: "Productor no encontrado" });
    res.status(200).json(productor);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el productor" });
  }
};

// POST /api/productores
exports.create = (req, res) => {
  try {
    const { nombre, apellido, telefono, email, establecimiento } = req.body;
    const nuevoProductor = Productor.create({
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
exports.update = (req, res) => {
  try {
    const { nombre, apellido, telefono, email, establecimiento } = req.body;
    const productorActualizado = Productor.update(req.params.id, {
      nombre,
      apellido,
      telefono,
      email,
      establecimiento,
    });

    if (!productorActualizado)
      return res.status(404).json({ error: "Productor no encontrado" });
    res.status(200).json(productorActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/productores/:id
exports.delete = (req, res) => {
  try {
    const eliminado = Productor.delete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ error: "Productor no encontrado" });
    res.status(200).json({ mensaje: "Productor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el productor" });
  }
};
