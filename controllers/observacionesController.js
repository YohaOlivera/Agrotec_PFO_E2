const mongoose = require("mongoose");
const Observacion = require("../models/Observacion");
const Lote = require("../models/Lote");
const Tecnico = require("../models/Tecnico");
const TipoCultivo = require("../models/TipoCultivo");

/**
 * @openapi
 * components:
 *   schemas:
 *     Observacion:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         id_lote:
 *           $ref: '#/components/schemas/ObjectId'
 *         id_tecnico:
 *           $ref: '#/components/schemas/ObjectId'
 *         fecha:
 *           type: string
 *           format: date-time
 *         tipo_cultivo:
 *           type: string
 *           example: Soja
 *         estado_cultivo:
 *           type: string
 *           example: En crecimiento
 *         observaciones:
 *           type: string
 *           example: Se detectó leve sequía en el sector norte.
 *         nivel_alerta:
 *           type: string
 *           enum: [Normal, Atención, Crítico]
 *         activa:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     ObservacionPopulada:
 *       allOf:
 *         - $ref: '#/components/schemas/Observacion'
 *         - type: object
 *           properties:
 *             id_lote:
 *               $ref: '#/components/schemas/Lote'
 *             id_tecnico:
 *               $ref: '#/components/schemas/Tecnico'
 *     ObservacionConTecnico:
 *       allOf:
 *         - $ref: '#/components/schemas/Observacion'
 *         - type: object
 *           properties:
 *             id_tecnico:
 *               $ref: '#/components/schemas/Tecnico'
 *     ObservacionInput:
 *       type: object
 *       required: [id_lote, id_tecnico, fecha, tipo_cultivo, nivel_alerta]
 *       properties:
 *         id_lote:
 *           $ref: '#/components/schemas/ObjectId'
 *         id_tecnico:
 *           $ref: '#/components/schemas/ObjectId'
 *         fecha:
 *           type: string
 *           format: date-time
 *         tipo_cultivo:
 *           type: string
 *           example: Soja
 *         estado_cultivo:
 *           type: string
 *         observaciones:
 *           type: string
 *         nivel_alerta:
 *           type: string
 *           enum: [Normal, Atención, Crítico]
 */

/**
 * @openapi
 * /api/observaciones:
 *   get:
 *     tags: [Observaciones]
 *     summary: Listar observaciones activas
 *     operationId: listObservaciones
 *     responses:
 *       '200':
 *         description: Observaciones activas con lote y técnico poblados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ObservacionPopulada'
 *       '500':
 *         description: Error al obtener observaciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getAll = async (req, res) => {
  try {
    const observaciones = await Observacion.find({ activa: true })
      .populate("id_lote")
      .populate("id_tecnico");
    res.status(200).json(observaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener observaciones" });
  }
};

/**
 * @openapi
 * /api/observaciones/{id}:
 *   get:
 *     tags: [Observaciones]
 *     summary: Obtener observación activa por ID
 *     operationId: getObservacionById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Observación con lote y técnico poblados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ObservacionPopulada'
 *       '400':
 *         description: ID de observación no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Observación no encontrada o inactiva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener la observación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de observación no válido" });
    }

    const obs = await Observacion.findOne({ _id: req.params.id, activa: true })
      .populate("id_lote")
      .populate("id_tecnico");

    if (!obs) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }

    res.status(200).json(obs);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la observación" });
  }
};

/**
 * @openapi
 * /api/observaciones:
 *   post:
 *     tags: [Observaciones]
 *     summary: Crear observación
 *     operationId: createObservacion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ObservacionInput'
 *     responses:
 *       '201':
 *         description: Observación creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Observacion'
 *       '400':
 *         description: Datos requeridos, referencias o valores no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.create = async (req, res) => {
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

    // 1. Validar campos requeridos obligatorios
    if (!id_lote || !id_tecnico || !fecha || !tipo_cultivo || !nivel_alerta) {
      return res.status(400).json({
        error: "id_lote, id_tecnico, fecha, tipo_cultivo y nivel_alerta son obligatorios",
      });
    }

    // 2. Validar formato de fecha
    if (isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: "La fecha proporcionada no es válida" });
    }

    // 3. Validar nivel de alerta permitido
    const alertasValidas = ["Normal", "Atención", "Crítico"];
    if (!alertasValidas.includes(nivel_alerta)) {
      return res.status(400).json({
        error: 'El nivel_alerta debe ser "Normal", "Atención" o "Crítico"',
      });
    }

    // 4. Validar formato de ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id_lote) || !mongoose.Types.ObjectId.isValid(id_tecnico)) {
      return res.status(400).json({ error: "id_lote o id_tecnico tienen un formato no válido" });
    }

    // 5. Validar existencia del lote
    const lote = await Lote.findById(id_lote);
    if (!lote) {
      return res.status(400).json({ error: "El id_lote proporcionado no existe" });
    }

    // 6. Validar existencia del técnico
    const tecnico = await Tecnico.findById(id_tecnico);
    if (!tecnico) {
      return res.status(400).json({ error: "El id_tecnico proporcionado no existe" });
    }

    // 7. Validar existencia del tipo de cultivo en la base de datos
    const existeCultivo = await TipoCultivo.findOne({
      nombre: { $regex: new RegExp(`^${tipo_cultivo.trim()}$`, "i") },
    });
    if (!existeCultivo) {
      return res.status(400).json({
        error: `El tipo de cultivo '${tipo_cultivo}' no existe en el catálogo de cultivos`,
      });
    }

    // Crear la observación
    const nuevaObservacion = await Observacion.create({
      id_lote,
      id_tecnico,
      fecha,
      tipo_cultivo: tipo_cultivo.trim(),
      estado_cultivo: estado_cultivo ? estado_cultivo.trim() : "",
      observaciones: observaciones ? observaciones.trim() : "",
      nivel_alerta,
      activa: true,
    });

    res.status(201).json(nuevaObservacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/observaciones/:id
exports.update = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de observación no válido" });
    }

    const {
      id_lote,
      id_tecnico,
      fecha,
      tipo_cultivo,
      estado_cultivo,
      observaciones,
      nivel_alerta,
    } = req.body;

    if (fecha && isNaN(Date.parse(fecha))) {
      return res.status(400).json({ error: "La fecha proporcionada no es válida" });
    }

    if (nivel_alerta) {
      const alertasValidas = ["Normal", "Atención", "Crítico"];
      if (!alertasValidas.includes(nivel_alerta)) {
        return res.status(400).json({
          error: 'El nivel_alerta debe ser "Normal", "Atención" o "Crítico"',
        });
      }
    }

    if (id_lote) {
      if (!mongoose.Types.ObjectId.isValid(id_lote)) {
        return res.status(400).json({ error: "id_lote no válido" });
      }
      const lote = await Lote.findById(id_lote);
      if (!lote) return res.status(400).json({ error: "El id_lote no existe" });
    }

    if (id_tecnico) {
      if (!mongoose.Types.ObjectId.isValid(id_tecnico)) {
        return res.status(400).json({ error: "id_tecnico no válido" });
      }
      const tecnico = await Tecnico.findById(id_tecnico);
      if (!tecnico) return res.status(400).json({ error: "El id_tecnico no existe" });
    }

    if (tipo_cultivo) {
      const existeCultivo = await TipoCultivo.findOne({
        nombre: { $regex: new RegExp(`^${tipo_cultivo.trim()}$`, "i") },
      });
      if (!existeCultivo) {
        return res.status(400).json({
          error: `El tipo de cultivo '${tipo_cultivo}' no existe en el catálogo de cultivos`,
        });
      }
    }

    const obsActualizada = await Observacion.findOneAndUpdate(
      { _id: req.params.id, activa: true },
      {
        id_lote,
        id_tecnico,
        fecha,
        tipo_cultivo,
        estado_cultivo,
        observaciones,
        nivel_alerta,
      },
      { new: true, runValidators: true }
    );

    if (!obsActualizada) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }

    res.status(200).json(obsActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @openapi
 * /api/observaciones/{id}:
 *   delete:
 *     tags: [Observaciones]
 *     summary: Dar de baja una observación
 *     description: La marca como inactiva y conserva el registro en el historial.
 *     operationId: deactivateObservacion
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Observación dada de baja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: ID de observación no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Observación no encontrada o inactiva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al eliminar la observación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.delete = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de observación no válido" });
    }

    const obs = await Observacion.findOneAndUpdate(
      { _id: req.params.id, activa: true },
      { activa: false },
      { new: true }
    );

    if (!obs) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }

    res.status(200).json({
      mensaje: "Observación dada de baja correctamente (conservada en historial)",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la observación" });
  }
};