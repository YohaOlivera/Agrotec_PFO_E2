const mongoose = require("mongoose");
const Tecnico = require("../models/Tecnico");

/**
 * @openapi
 * components:
 *   schemas:
 *     Tecnico:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         nombre:
 *           type: string
 *           example: María
 *         apellido:
 *           type: string
 *           example: Gómez
 *         telefono:
 *           type: string
 *           example: '1188990011'
 *         email:
 *           type: string
 *           format: email
 *           example: maria@agrotec.com
 *         especialidad:
 *           type: string
 *           example: Control de plagas
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     TecnicoInput:
 *       type: object
 *       required: [nombre, apellido]
 *       properties:
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         telefono:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         especialidad:
 *           type: string
 */

/**
 * @openapi
 * /api/tecnicos:
 *   get:
 *     tags: [Técnicos]
 *     summary: Listar técnicos
 *     operationId: listTecnicos
 *     responses:
 *       '200':
 *         description: Técnicos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tecnico'
 *       '500':
 *         description: Error al obtener técnicos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getAll = async (req, res) => {
  try {
    const tecnicos = await Tecnico.find();
    res.status(200).json(tecnicos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener técnicos" });
  }
};

/**
 * @openapi
 * /api/tecnicos/{id}:
 *   get:
 *     tags: [Técnicos]
 *     summary: Obtener técnico por ID
 *     operationId: getTecnicoById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Técnico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tecnico'
 *       '400':
 *         description: ID de técnico no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Técnico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener el técnico
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/tecnicos:
 *   post:
 *     tags: [Técnicos]
 *     summary: Crear técnico
 *     operationId: createTecnico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TecnicoInput'
 *     responses:
 *       '201':
 *         description: Técnico creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tecnico'
 *       '400':
 *         description: Datos requeridos ausentes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/tecnicos/{id}:
 *   put:
 *     tags: [Técnicos]
 *     summary: Actualizar técnico
 *     operationId: updateTecnico
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
 *             $ref: '#/components/schemas/TecnicoInput'
 *     responses:
 *       '200':
 *         description: Técnico actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tecnico'
 *       '400':
 *         description: ID o datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Técnico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/tecnicos/{id}:
 *   delete:
 *     tags: [Técnicos]
 *     summary: Eliminar técnico
 *     operationId: deleteTecnico
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Técnico eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: ID de técnico no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Técnico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al eliminar el técnico
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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