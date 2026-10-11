const mongoose = require("mongoose");

const loteSchema = new mongoose.Schema(
  {
    nombre_numero: {
      type: String,
      required: [true, "El nombre o número de lote es obligatorio"],
      trim: true,
    },
    id_productor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productor",
      required: [true, "El id_productor es obligatorio"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lote", loteSchema);