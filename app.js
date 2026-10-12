const path = require("path");

require("dotenv").config({
  path: path.join(
    __dirname,
    process.env.NODE_ENV === "production" ? "prod.env" : ".env"
  ),
});
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Conexión a MongoDB
connectDB();

// 2. Configuración del motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 3. Middlewares para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Rutas de la API REST
const productoresRoutes = require("./routes/productoresRoutes");
const lotesRoutes = require("./routes/lotesRoutes");
const observacionesRoutes = require("./routes/observacionesRoutes");
const tecnicosRoutes = require("./routes/tecnicosRoutes");
const tiposCultivoRoutes = require("./routes/tiposCultivoRoutes");

app.use("/api/productores", productoresRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/observaciones", observacionesRoutes);
app.use("/api/tecnicos", tecnicosRoutes);
app.use("/api/tipos-cultivo", tiposCultivoRoutes);

// 5. Vistas Pug adaptadas a Mongoose (async/await)
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

// 6. Manejo de error 404 (Ruta no encontrada)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 7. Manejo global de errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 8. Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor de AgroTec corriendo en http://localhost:${PORT}`);
});