const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const dataDirectory = path.join(__dirname, "..", "data");
const sourceFiles = {
  productores: "productores.json",
  tecnicos: "tecnicos.json",
  tiposCultivo: "tipos_cultivo.json",
  lotes: "lotes.json",
  observaciones: "observaciones.json",
};

const readRecords = (fileName) => {
  const filePath = path.join(dataDirectory, fileName);
  const records = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!Array.isArray(records)) {
    throw new Error(`${fileName} debe contener un array JSON`);
  }

  const seenIds = new Set();
  for (const record of records) {
    if (record.id === undefined || record.id === null) {
      throw new Error(`Falta el campo id en ${fileName}`);
    }

    const key = String(record.id);
    if (seenIds.has(key)) {
      throw new Error(`El id ${key} está duplicado en ${fileName}`);
    }
    seenIds.add(key);
  }

  return records;
};

const loadSourceData = () =>
  Object.fromEntries(
    Object.entries(sourceFiles).map(([key, fileName]) => [
      key,
      readRecords(fileName),
    ])
  );

const assertReferences = (data) => {
  const producerIds = new Set(data.productores.map(({ id }) => String(id)));
  const technicianIds = new Set(data.tecnicos.map(({ id }) => String(id)));
  const lotIds = new Set(data.lotes.map(({ id }) => String(id)));
  const cropNames = new Set(data.tiposCultivo.map(({ nombre }) => nombre));

  for (const lote of data.lotes) {
    if (!producerIds.has(String(lote.id_productor))) {
      throw new Error(
        `El lote ${lote.id} referencia al productor inexistente ${lote.id_productor}`
      );
    }
  }

  for (const observacion of data.observaciones) {
    if (!lotIds.has(String(observacion.id_lote))) {
      throw new Error(
        `La observación ${observacion.id} referencia al lote inexistente ${observacion.id_lote}`
      );
    }
    if (!technicianIds.has(String(observacion.id_tecnico))) {
      throw new Error(
        `La observación ${observacion.id} referencia al técnico inexistente ${observacion.id_tecnico}`
      );
    }
    if (!cropNames.has(observacion.tipo_cultivo)) {
      throw new Error(
        `La observación ${observacion.id} referencia al cultivo inexistente ${observacion.tipo_cultivo}`
      );
    }
  }
};

const seededObjectId = (modelName, legacyId) => {
  const hex = crypto
    .createHash("sha256")
    .update(`agrotec-seed:${modelName}:${legacyId}`)
    .digest("hex")
    .slice(0, 24);
  return new mongoose.Types.ObjectId(hex);
};

const upsertSeededRecord = (Model, id, fields) =>
  Model.findOneAndUpdate(
    { _id: id },
    { $set: fields },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

const seed = async (data) => {
  const Productor = require("../models/Productor");
  const Tecnico = require("../models/Tecnico");
  const TipoCultivo = require("../models/TipoCultivo");
  const Lote = require("../models/Lote");
  const Observacion = require("../models/Observacion");

  const producerIds = new Map();
  for (const { id, ...fields } of data.productores) {
    const objectId = seededObjectId("Productor", id);
    await upsertSeededRecord(Productor, objectId, fields);
    producerIds.set(String(id), objectId);
  }

  const technicianIds = new Map();
  for (const { id, ...fields } of data.tecnicos) {
    const objectId = seededObjectId("Tecnico", id);
    await upsertSeededRecord(Tecnico, objectId, fields);
    technicianIds.set(String(id), objectId);
  }

  for (const { nombre } of data.tiposCultivo) {
    await TipoCultivo.findOneAndUpdate(
      { nombre },
      { $set: { nombre } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
  }

  const lotIds = new Map();
  for (const { id, id_productor, ...fields } of data.lotes) {
    const objectId = seededObjectId("Lote", id);
    await upsertSeededRecord(Lote, objectId, {
      ...fields,
      id_productor: producerIds.get(String(id_productor)),
    });
    lotIds.set(String(id), objectId);
  }

  for (const { id, id_lote, id_tecnico, ...fields } of data.observaciones) {
    await upsertSeededRecord(
      Observacion,
      seededObjectId("Observacion", id),
      {
        ...fields,
        id_lote: lotIds.get(String(id_lote)),
        id_tecnico: technicianIds.get(String(id_tecnico)),
      }
    );
  }
};

const main = async () => {
  const data = loadSourceData();
  assertReferences(data);

  if (process.argv.includes("--check")) {
    console.log("Datos del seed válidos; las referencias entre archivos existen.");
    return;
  }

  const envFile =
    process.env.NODE_ENV === "production" ? "prod.env" : ".env";
  const envPath = path.join(__dirname, "..", envFile);
  const { error } = require("dotenv").config({ path: envPath, quiet: true });

  if (error) {
    throw error;
  }
  if (!process.env.MONGO_URI) {
    throw new Error(`MONGO_URI debe estar definido en ${envFile}`);
  }

  try {
    require("../config/mongo-dns")();
  } catch (error) {
    // Continúa normalmente si mongo-dns no está presente o falla
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "agrotec",
    });
    await seed(data);
    console.log(
      `Seed completado: ${data.productores.length} productores, ${data.tecnicos.length} técnicos, ${data.tiposCultivo.length} tipos de cultivo, ${data.lotes.length} lotes y ${data.observaciones.length} observaciones.`
    );
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((error) => {
  console.error(`No se pudo completar el seed: ${error.message}`);
  process.exitCode = 1;
});
