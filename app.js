const path = require("path");

require("dotenv").config({
  path: path.join(
    __dirname,
    process.env.NODE_ENV === "production" ? "prod.env" : ".env"
  ),
});

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Documentación OpenAPI
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Agrotec API",
      version: "1.0.0",
      description:
        "API REST para administrar productores, técnicos, cultivos, lotes y observaciones agrícolas.",
    },
    servers: [{ url: "/", description: "Servidor actual" }],
  },
  apis: [path.join(__dirname, "controllers", "*.js").replace(/\\/g, "/")],
});

app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configuración del motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API REST
const productoresRoutes = require("./routes/productoresRoutes");
const lotesRoutes = require("./routes/lotesRoutes");
const observacionesRoutes = require("./routes/observacionesRoutes");
const tecnicosRoutes = require("./routes/tecnicosRoutes");
const tiposCultivoRoutes = require("./routes/tiposCultivoRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/productores", productoresRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/observaciones", observacionesRoutes);
app.use("/api/tecnicos", tecnicosRoutes);
app.use("/api/tipos-cultivo", tiposCultivoRoutes);
app.use("/api/auth", authRoutes);

// Vistas Pug adaptadas a Mongoose (async/await)
const Lote = require("./models/Lote");
const Observacion = require("./models/Observacion");

app.get("/", (req, res) => {
  res.render("index", {
    title: "AgroTec",
    message: "Bienvenido al Sistema de Monitoreo Agrícola AgroTec",
  });
});

app.get("/vista/lotes", async (req, res) => {
  try {
    const lotes = await Lote.find().populate("id_productor");
    res.render("lotes", { title: "Listado de Lotes", lotes });
  } catch (error) {
    res.status(500).send("Error al cargar la vista de lotes");
  }
});

app.get("/vista/lotes/:id", async (req, res) => {
  try {
    const lote = await Lote.findById(req.params.id).populate("id_productor");
    if (!lote) {
      return res.status(404).send("Lote no encontrado");
    }

    const observaciones = await Observacion.find({
      id_lote: req.params.id,
      activa: true,
    }).populate("id_tecnico");

    res.render("lote_detalle", {
      title: `Detalle del Lote ${lote.nombre_numero}`,
      lote,
      observaciones,
    });
  } catch (error) {
    res.status(500).send("Error al cargar el detalle del lote");
  }
});

// Manejo de error 404 (Ruta no encontrada)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo global de errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar solo después de confirmar la conexión a la base.
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor de AgroTec corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`No se pudo iniciar AgroTec: ${error.message}`);
    process.exitCode = 1;
  }
};

startServer();