const TipoCultivo = require("../models/TipoCultivo");

exports.getAll = (req, res) => {
  try {
    const tipos = TipoCultivo.getAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener tipos de cultivo" });
  }
};

exports.getById = (req, res) => {
  try {
    const tipo = TipoCultivo.getById(req.params.id);
    if (!tipo)
      return res.status(404).json({ error: "Tipo de cultivo no encontrado" });
    res.status(200).json(tipo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tipo de cultivo" });
  }
};

exports.create = (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const nuevoTipo = TipoCultivo.create({ nombre });
    res.status(201).json(nuevoTipo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el tipo de cultivo" });
  }
};

exports.update = (req, res) => {
  try {
    const { nombre } = req.body;
    const tipoActualizado = TipoCultivo.update(req.params.id, { nombre });

    if (!tipoActualizado)
      return res.status(404).json({ error: "Tipo de cultivo no encontrado" });
    res.status(200).json(tipoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el tipo de cultivo" });
  }
};

exports.delete = (req, res) => {
  try {
    const eliminado = TipoCultivo.delete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ error: "Tipo de cultivo no encontrado" });
    res
      .status(200)
      .json({ mensaje: "Tipo de cultivo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el tipo de cultivo" });
  }
};
