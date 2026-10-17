const collectionNames = [
  "productors",
  "lotes",
  "observacions",
  "tecnicos",
  "tipocultivos",
];

module.exports.up = async (db) => {
  const existingCollections = new Set(
    (await db.listCollections({}, { nameOnly: true }).toArray()).map(
      ({ name }) => name
    )
  );

  for (const collectionName of collectionNames) {
    if (!existingCollections.has(collectionName)) {
      await db.createCollection(collectionName);
    }
  }

  await db.collection("tipocultivos").createIndex(
    { nombre: 1 },
    { unique: true, name: "nombre_1" }
  );
};

module.exports.down = async () => {
};
