const mongoose = require("mongoose");

const observacionSchema = new mongoose.Schema(
  {
    id_lote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lote",
      required: [true, "El lote es obligatorio"],
    },
    id_tecnico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tecnico",
      required: [true, "El técnico es obligatorio"],
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    tipo_cultivo: {
      type: String,
      required: [true, "El tipo de cultivo es obligatorio"],
      trim: true,
    },
    estado_cultivo: {
      type: String,
      trim: true,
      default: "",
    },
    observaciones: {
      type: String,
      trim: true,
      default: "",
    },
    nivel_alerta: {
      type: String,
      required: [true, "El nivel de alerta es obligatorio"],
      enum: {
        values: ["Normal", "Atención", "Crítico"],
        message: 'El nivel de alerta debe ser "Normal", "Atención" o "Crítico"',
      },
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Observacion", observacionSchema);