const crypto = require("crypto");
const mongoose = require("mongoose");

const productores = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "1122334455",
    email: "juan.perez@agrotec.com",
    establecimiento: "Estancia El Ombú",
  },
];

const tecnicos = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "1144556677",
    email: "juan.tecnico@agrotec.com",
    especialidad: "Agronomía general",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "Gómez",
    telefono: "1188990011",
    email: "maria.gomez@agrotec.com",
    especialidad: "Control de plagas",
  },
];

const tiposCultivo = [{ nombre: "Soja" }, { nombre: "Maíz" }, { nombre: "Trigo" }];

const lotes = [{ id: 1, nombre_numero: "Lote 45 Sur", id_productor: 1 }];

const observaciones = [
  {
    id: 1,
    id_lote: 1,
    id_tecnico: 1,
    fecha: "2026-09-10",
    tipo_cultivo: "Soja",
    estado_cultivo: "En crecimiento",
    observaciones: "Se detectó leve sequía en el sector norte.",
    nivel_alerta: "Atención",
    activa: true,
  },
];

const seededObjectId = (modelName, legacyId) => {
  const hex = crypto
    .createHash("sha256")
    .update(`agrotec-seed:${modelName}:${legacyId}`)
    .digest("hex")
    .slice(0, 24);
  return new mongoose.Types.ObjectId(hex);
};

const upsertById = (
  collection,
  modelName,
  records,
  transform = ({ id, ...fields }) => fields
) =>
  collection.bulkWrite(
    records.map(({ id, ...fields }) => ({
      updateOne: {
        filter: { _id: seededObjectId(modelName, id) },
        update: {
          $setOnInsert: {
            ...transform({ id, ...fields }),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }))
  );

const upsertCultivos = (collection) =>
  collection.bulkWrite(
    tiposCultivo.map(({ nombre }) => ({
      updateOne: {
        filter: { nombre },
        update: {
          $setOnInsert: {
            _id: seededObjectId("TipoCultivo", nombre),
            nombre,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }))
  );

module.exports.up = async (db) => {
  const productorIds = new Map(
    productores.map(({ id }) => [String(id), seededObjectId("Productor", id)])
  );
  const tecnicoIds = new Map(
    tecnicos.map(({ id }) => [String(id), seededObjectId("Tecnico", id)])
  );
  const loteIds = new Map(
    lotes.map(({ id }) => [String(id), seededObjectId("Lote", id)])
  );

  await upsertById(db.collection("productors"), "Productor", productores);
  await upsertById(db.collection("tecnicos"), "Tecnico", tecnicos);
  await upsertCultivos(db.collection("tipocultivos"));
  await upsertById(
    db.collection("lotes"),
    "Lote",
    lotes,
    ({ id, id_productor, ...fields }) => ({
      ...fields,
      id_productor: productorIds.get(String(id_productor)),
    })
  );
  await upsertById(
    db.collection("observacions"),
    "Observacion",
    observaciones,
    ({ id, id_lote, id_tecnico, ...fields }) => ({
      ...fields,
      fecha: new Date(fields.fecha),
      id_lote: loteIds.get(String(id_lote)),
      id_tecnico: tecnicoIds.get(String(id_tecnico)),
    })
  );
};

module.exports.down = async (db) => {
  const seededIds = {
    productors: productores.map(({ id }) => seededObjectId("Productor", id)),
    tecnicos: tecnicos.map(({ id }) => seededObjectId("Tecnico", id)),
    tipocultivos: tiposCultivo.map(({ nombre }) =>
      seededObjectId("TipoCultivo", nombre)
    ),
    lotes: lotes.map(({ id }) => seededObjectId("Lote", id)),
    observacions: observaciones.map(({ id }) =>
      seededObjectId("Observacion", id)
    ),
  };

  for (const [collectionName, ids] of Object.entries(seededIds)) {
    await db.collection(collectionName).deleteMany({ _id: { $in: ids } });
  }
};
