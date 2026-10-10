const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar el motor de vistas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const productoresRoutes = require("./routes/productoresRoutes");
const lotesRoutes = require("./routes/lotesRoutes");
const observacionesRoutes = require("./routes/observacionesRoutes");
const tecnicosRoutes = require("./routes/tecnicosRoutes");
const tiposCultivoRoutes = require("./routes/tiposCultivoRoutes");

// Rutas principales
app.use("/api/productores", productoresRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/observaciones", observacionesRoutes);
app.use("/api/tecnicos", tecnicosRoutes);
app.use("/api/tipos-cultivo", tiposCultivoRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.render("index", {
    title: "AgroTec",
    message: "Bienvenido al Sistema de Monitoreo Agrícola AgroTec",
  });
});

// Rutas de Vistas (Front-end básico renderizado con Pug)
const Lote = require("./models/Lote");
const Observacion = require("./models/Observacion");

app.get("/vista/lotes", (req, res) => {
  const lotes = Lote.getAll();
  res.render("lotes", { title: "Listado de Lotes", lotes });
});

app.get("/vista/lotes/:id", (req, res) => {
  const lote = Lote.getById(req.params.id);
  if (!lote) return res.status(404).send("Lote no encontrado");
  const observaciones = Observacion.getByLote(req.params.id);
  res.render("lote_detalle", {
    title: `Detalle del Lote ${lote.nombre_numero}`,
    lote,
    observaciones,
  });
});

// Middleware de manejo de error 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor de AgroTec corriendo en http://localhost:${PORT}`);
});
