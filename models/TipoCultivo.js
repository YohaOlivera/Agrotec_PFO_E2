const mongoose = require("mongoose");

const tipoCultivoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del cultivo es obligatorio"],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TipoCultivo", tipoCultivoSchema);