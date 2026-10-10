const Observacion = require("../models/Observacion");
const Lote = require("../models/Lote");
const Tecnico = require("../models/Tecnico");
const TipoCultivo = require("../models/TipoCultivo");

// GET /api/observaciones
exports.getAll = (req, res) => {
  try {
    const observaciones = Observacion.getAll();
    res.status(200).json(observaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener observaciones" });
  }
};

// GET /api/observaciones/:id
exports.getById = (req, res) => {
  try {
    const obs = Observacion.getById(req.params.id);
    if (!obs) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }
    res.status(200).json(obs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la observación" });
  }
};

// POST /api/observaciones
exports.create = (req, res) => {
  try {
    const {
      id_lote,
      id_tecnico,
      fecha,
      tipo_cultivo,
      estado_cultivo,
      observaciones,
      nivel_alerta,
    } = req.body;

    // Validación de campos obligatorios mínimos
    if (!id_lote || !id_tecnico || !fecha || !tipo_cultivo || !nivel_alerta) {
      return res.status(400).json({
        error: "id_lote, id_tecnico, fecha, tipo_cultivo y nivel_alerta son obligatorios",
      });
    }

    // Validar formato de fecha
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ 
        error: "La fecha proporcionada no es válida" 
      });
    }

    // Validar nivel de alerta permitido
    const alertasValidas = ["Normal", "Atención", "Crítico"];
    if (!alertasValidas.includes(nivel_alerta)) {
      return res.status(400).json({
        error: 'El nivel_alerta debe ser "Normal", "Atención" o "Crítico"',
      });
    }

    // Validar existencia del Lote
    const lote = Lote.getById(id_lote);
    if (!lote) {
      return res.status(400).json({ 
        error: "El id_lote proporcionado no existe" 
      });
    }

    // Validar existencia del Técnico
    const tecnico = Tecnico.getById(id_tecnico);
    if (!tecnico) {
      return res.status(400).json({ 
        error: "El id_tecnico proporcionado no existe" 
      });
    }

    // Validar existencia del Tipo de Cultivo en el catálogo
    const tiposRegistrados = TipoCultivo.getAll().map((t) =>
      t.nombre.trim().toLowerCase()
    );
    if (!tiposRegistrados.includes(tipo_cultivo.trim().toLowerCase())) {
      return res.status(400).json({
        error: `El tipo de cultivo '${tipo_cultivo}' no existe en el catálogo de cultivos.`,
      });
    }

    // Crear la observación
    const nuevaObservacion = Observacion.create({
      id_lote: parseInt(id_lote),
      id_tecnico: parseInt(id_tecnico),
      fecha,
      tipo_cultivo: tipo_cultivo.trim(),
      estado_cultivo: estado_cultivo ? estado_cultivo.trim() : "",
      observaciones: observaciones ? observaciones.trim() : "",
      nivel_alerta,
    });

    res.status(201).json(nuevaObservacion);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la observación" });
  }
};

// DELETE /api/observaciones/:id
exports.delete = (req, res) => {
  try {
    const eliminado = Observacion.delete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }
    res.status(200).json({ 
      mensaje: "Observación eliminada (soft delete) correctamente" 
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la observación" });
  }
};
