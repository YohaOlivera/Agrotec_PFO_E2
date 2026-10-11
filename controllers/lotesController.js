const mongoose = require("mongoose");
const Lote = require("../models/Lote");
const Productor = require("../models/Productor");
const Observacion = require("../models/Observacion");

// GET /api/lotes (admite query opcional ?alerta=Normal|Atención|Crítico)
exports.getAll = async (req, res) => {
  try {
    const { alerta } = req.query;

    if (alerta) {
      const alertasValidas = ["Normal", "Atención", "Crítico"];
      if (!alertasValidas.includes(alerta)) {
        return res.status(400).json({
          error: 'Nivel de alerta inválido. Debe ser "Normal", "Atención" o "Crítico"',
        });
      }

      // Buscar observaciones activas con ese nivel de alerta
      const observacionesConAlerta = await Observacion.find({
        nivel_alerta: alerta,
        activa: true,
      }).select("id_lote");

      const idsLotes = observacionesConAlerta.map((obs) => obs.id_lote);

      // Traer los lotes correspondientes sin duplicados
      const lotes = await Lote.find({ _id: { $in: idsLotes } }).populate("id_productor");
      return res.status(200).json(lotes);
    }

    const lotes = await Lote.find().populate("id_productor");
    res.status(200).json(lotes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lotes" });
  }
};

// GET /api/lotes/:id
exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de lote no válido" });
    }

    const lote = await Lote.findById(req.params.id).populate("id_productor");
    if (!lote) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }
    res.status(200).json(lote);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el lote" });
  }
};

// POST /api/lotes
exports.create = async (req, res) => {
  try {
    const { nombre_numero, id_productor } = req.body;

    if (!nombre_numero || !id_productor) {
      return res.status(400).json({
        error: "El nombre_numero y el id_productor son obligatorios",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id_productor)) {
      return res.status(400).json({ error: "ID de productor no válido" });
    }

    const productor = await Productor.findById(id_productor);
    if (!productor) {
      return res.status(400).json({ error: "El id_productor no existe" });
    }

    const nuevoLote = await Lote.create({ nombre_numero, id_productor });
    res.status(201).json(nuevoLote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/lotes/:id
exports.update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de lote no válido" });
    }

    const { nombre_numero, id_productor } = req.body;

    if (id_productor) {
      if (!mongoose.Types.ObjectId.isValid(id_productor)) {
        return res.status(400).json({ error: "ID de productor no válido" });
      }
      const productor = await Productor.findById(id_productor);
      if (!productor) {
        return res.status(400).json({ error: "El id_productor no existe" });
      }
    }

    const loteActualizado = await Lote.findByIdAndUpdate(
      req.params.id,
      { nombre_numero, id_productor },
      { new: true, runValidators: true }
    );

    if (!loteActualizado) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    res.status(200).json(loteActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/lotes/:id
exports.delete = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de lote no válido" });
    }

    const eliminado = await Lote.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    res.status(200).json({ mensaje: "Lote eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el lote" });
  }
};

// GET /api/lotes/:id/observaciones (Historial de observaciones del lote)
exports.getHistorial = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de lote no válido" });
    }

    const lote = await Lote.findById(req.params.id);
    if (!lote) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    const observaciones = await Observacion.find({
      id_lote: req.params.id,
      activa: true,
    }).populate("id_tecnico");

    res.status(200).json(observaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial del lote" });
  }
};