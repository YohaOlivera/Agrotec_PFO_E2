const Lote = require("../models/Lote");
const Productor = require("../models/Productor");
const Observacion = require("../models/Observacion");

// GET /api/lotes (Soporta query de filtrado ?alerta=Critico)
exports.getAll = (req, res) => {
  try {
    const { alerta } = req.query;
    let lotes = Lote.getAll();

    if (alerta) {
      const alertasValidas = ["Normal", "Atención", "Crítico"];
      if (!alertasValidas.includes(alerta)) {
        return res
          .status(400)
          .json({
            error:
              'Nivel de alerta inválido para la búsqueda. Use "Normal", "Atención" o "Crítico"',
          });
      }

      const observacionesConAlerta = Observacion.getByNivelAlerta(alerta);
      const idsLotesConAlerta = observacionesConAlerta.map(
        (obs) => obs.id_lote,
      );

      lotes = lotes.filter((lote) => idsLotesConAlerta.includes(lote.id));
    }

    res.status(200).json(lotes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lotes" });
  }
};

// GET /api/lotes/:id
exports.getById = (req, res) => {
  try {
    const lote = Lote.getById(req.params.id);
    if (!lote) return res.status(404).json({ error: "Lote no encontrado" });
    res.status(200).json(lote);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el lote" });
  }
};

// POST /api/lotes
exports.create = (req, res) => {
  try {
    const { nombre_numero, id_productor } = req.body;

    if (!nombre_numero || !id_productor) {
      return res
        .status(400)
        .json({ error: "El nombre_numero y el id_productor son obligatorios" });
    }

    const productor = Productor.getById(id_productor);
    if (!productor) {
      return res
        .status(400)
        .json({ error: "El id_productor proporcionado no existe" });
    }

    const nuevoLote = Lote.create({
      nombre_numero,
      id_productor: parseInt(id_productor),
    });
    res.status(201).json(nuevoLote);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el lote" });
  }
};

// PUT /api/lotes/:id
exports.update = (req, res) => {
  try {
    const { nombre_numero, id_productor } = req.body;

    if (id_productor) {
      const productor = Productor.getById(id_productor);
      if (!productor) {
        return res
          .status(400)
          .json({ error: "El id_productor proporcionado no existe" });
      }
    }

    const loteActualizado = Lote.update(req.params.id, {
      nombre_numero,
      id_productor: id_productor ? parseInt(id_productor) : undefined,
    });

    if (!loteActualizado)
      return res.status(404).json({ error: "Lote no encontrado" });
    res.status(200).json(loteActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el lote" });
  }
};

// DELETE /api/lotes/:id
exports.delete = (req, res) => {
  try {
    const eliminado = Lote.delete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ error: "Lote no encontrado" });
    res.status(200).json({ mensaje: "Lote eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el lote" });
  }
};

// GET /api/lotes/:id/observaciones
exports.getHistorial = (req, res) => {
  try {
    const lote = Lote.getById(req.params.id);
    if (!lote) return res.status(404).json({ error: "Lote no encontrado" });

    const observaciones = Observacion.getByLote(req.params.id);
    res.status(200).json(observaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial del lote" });
  }
};
