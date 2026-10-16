const User = require("../models/User");

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required: [username, password, nombre, apellido, email]
 *       properties:
 *         username:
 *           type: string
 *           example: admin
 *         password:
 *           type: string
 *           example: 123456
 *         nombre:
 *           type: string
 *           example: Administrador
 *         apellido:
 *           type: string
 *           example: Pérez
 *         email:
 *           type: string
 *           example: admin@agrotec.com
 *     LoginInput:
 *       type: object
 *       required: [username, password]
 *       properties:
 *         username:
 *           type: string
 *           example: admin
 *         password:
 *           type: string
 *           example: 123456
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente
 *       '400':
 *         description: Datos inválidos o usuario/email ya existente
 */
exports.register = async (req, res) => {
  try {
    const { username, password, nombre, apellido, email } = req.body;

    // Validación básica de campos requeridos
    if (!username || !password || !nombre || !apellido || !email) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios: username, password, nombre, apellido, email",
      });
    }

    // Verificar duplicados de username o email
    const existeUsuario = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existeUsuario) {
      const campo =
        existeUsuario.username === username ? "username" : "email";
      return res.status(400).json({
        error: `El ${campo} ya está registrado`,
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await User.create({
      username,
      password, 
      nombre,
      apellido,
      email,
    });

    // Respuesta exitosa
    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: {
        id: nuevoUsuario._id,
        username: nuevoUsuario.username,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
     if (error.code === 11000) {
      return res.status(400).json({ error: "Usuario o email ya registrado" });
    }

    // Cualquier otro error
    res.status(400).json({ error: error.message });
  }
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       '200':
 *         description: Login exitoso
 *       '400':
 *         description: Faltan datos
 *       '401':
 *         description: Credenciales incorrectas
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Debe ingresar usuario y contraseña",
      });
    }

    const user = await User.findOne({ username }).select("+password");

    // Verificación
    if (!user || user.password !== password) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos",
      });
    }

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en el servidor al intentar iniciar sesión",
    });
  }
};