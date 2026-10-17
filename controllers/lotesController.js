const mongoose = require("mongoose");
const Lote = require("../models/Lote");
const Productor = require("../models/Productor");
const Observacion = require("../models/Observacion");

/**
 * @openapi
 * components:
 *   schemas:
 *     Lote:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         nombre_numero:
 *           type: string
 *           example: Lote 45 Sur
 *         id_productor:
 *           $ref: '#/components/schemas/ObjectId'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     LotePopulado:
 *       allOf:
 *         - $ref: '#/components/schemas/Lote'
 *         - type: object
 *           properties:
 *             id_productor:
 *               $ref: '#/components/schemas/Productor'
 *     LoteInput:
 *       type: object
 *       required: [nombre_numero, id_productor]
 *       properties:
 *         nombre_numero:
 *           type: string
 *           example: Lote 45 Sur
 *         id_productor:
 *           $ref: '#/components/schemas/ObjectId'
 */

/**
 * @openapi
 * /api/lotes:
 *   get:
 *     tags: [Lotes]
 *     summary: Listar lotes
 *     description: Incluye el productor asociado. Admite filtrar por alertas activas.
 *     operationId: listLotes
 *     parameters:
 *       - name: alerta
 *         in: query
 *         required: false
 *         description: Nivel de alerta de una observación activa.
 *         schema:
 *           type: string
 *           enum: [Normal, Atención, Crítico]
 *     responses:
 *       '200':
 *         description: Lotes encontrados con su productor poblado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LotePopulado'
 *       '400':
 *         description: Nivel de alerta inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener lotes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/lotes/{id}:
 *   get:
 *     tags: [Lotes]
 *     summary: Obtener lote por ID
 *     operationId: getLoteById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Lote encontrado con su productor poblado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LotePopulado'
 *       '400':
 *         description: ID de lote no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Lote no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener el lote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/lotes:
 *   post:
 *     tags: [Lotes]
 *     summary: Crear lote
 *     operationId: createLote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoteInput'
 *     responses:
 *       '201':
 *         description: Lote creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lote'
 *       '400':
 *         description: Datos requeridos ausentes o referencia de productor inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.create = async (req, res) => {
  try {
    const { nombre_numero, id_productor } = req.body;

    if (!nombre_numero || !id_productor) {
      return res.status(400).json({
        error: "El nombre del lote y el Id productor son obligatorios",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id_productor)) {
      return res.status(400).json({ error: "ID de productor no válido" });
    }

    const productor = await Productor.findById(id_productor);
    if (!productor) {
      return res.status(400).json({ error: "El Id productor no existe" });
    }

    const nuevoLote = await Lote.create({ nombre_numero, id_productor });
    res.status(201).json(nuevoLote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @openapi
 * /api/lotes/{id}:
 *   put:
 *     tags: [Lotes]
 *     summary: Actualizar lote
 *     operationId: updateLote
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoteInput'
 *     responses:
 *       '200':
 *         description: Lote actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lote'
 *       '400':
 *         description: ID, productor o datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Lote no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
        return res.status(400).json({ error: "El Id productor no existe" });
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

/**
 * @openapi
 * /api/lotes/{id}:
 *   delete:
 *     tags: [Lotes]
 *     summary: Eliminar lote
 *     operationId: deleteLote
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Lote eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: ID de lote no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Lote no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al eliminar el lote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/lotes/{id}/observaciones:
 *   get:
 *     tags: [Lotes]
 *     summary: Consultar historial activo de observaciones del lote
 *     operationId: getHistorialLote
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Observaciones activas del lote con el técnico poblado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ObservacionConTecnico'
 *       '400':
 *         description: ID de lote no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Lote no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener el historial del lote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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