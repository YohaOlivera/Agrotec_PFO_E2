const mongoose = require("mongoose");
const Productor = require("../models/Productor");

/**
 * @openapi
 * components:
 *   schemas:
 *     ObjectId:
 *       type: string
 *       pattern: '^[0-9a-fA-F]{24}$'
 *       example: 507f1f77bcf86cd799439011
 *     Error:
 *       type: object
 *       required: [error]
 *       properties:
 *         error:
 *           type: string
 *     Message:
 *       type: object
 *       required: [mensaje]
 *       properties:
 *         mensaje:
 *           type: string
 *     Productor:
 *       type: object
 *       properties:
 *         _id:
 *           $ref: '#/components/schemas/ObjectId'
 *         nombre:
 *           type: string
 *           example: Juan
 *         apellido:
 *           type: string
 *           example: Pérez
 *         telefono:
 *           type: string
 *           example: '1122334455'
 *         email:
 *           type: string
 *           format: email
 *           example: juan@agrotec.com
 *         establecimiento:
 *           type: string
 *           example: Estancia El Ombú
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *     ProductorInput:
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
 *         establecimiento:
 *           type: string
 */

/**
 * @openapi
 * /api/productores:
 *   get:
 *     tags: [Productores]
 *     summary: Listar productores
 *     operationId: listProductores
 *     responses:
 *       '200':
 *         description: Productores encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Productor'
 *       '500':
 *         description: Error al obtener productores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exports.getAll = async (req, res) => {
  try {
    const productores = await Productor.find();
    res.status(200).json(productores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productores" });
  }
};

/**
 * @openapi
 * /api/productores/{id}:
 *   get:
 *     tags: [Productores]
 *     summary: Obtener productor por ID
 *     operationId: getProductorById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Productor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Productor'
 *       '400':
 *         description: ID de productor no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Productor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al obtener el productor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/productores:
 *   post:
 *     tags: [Productores]
 *     summary: Crear productor
 *     operationId: createProductor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductorInput'
 *     responses:
 *       '201':
 *         description: Productor creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Productor'
 *       '400':
 *         description: Datos requeridos ausentes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/productores/{id}:
 *   put:
 *     tags: [Productores]
 *     summary: Actualizar productor
 *     operationId: updateProductor
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
 *             $ref: '#/components/schemas/ProductorInput'
 *     responses:
 *       '200':
 *         description: Productor actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Productor'
 *       '400':
 *         description: ID o datos no válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Productor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @openapi
 * /api/productores/{id}:
 *   delete:
 *     tags: [Productores]
 *     summary: Eliminar productor
 *     operationId: deleteProductor
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       '200':
 *         description: Productor eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '400':
 *         description: ID de productor no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Productor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '500':
 *         description: Error al eliminar el productor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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