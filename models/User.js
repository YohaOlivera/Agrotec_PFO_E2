const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "El nombre de usuario es obligatorio"],
            unique: true,
            trim: true,
            minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            select: false,
        },
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
        },
        apellido: {
            type: String,
            required: [true, "El apellido es obligatorio"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "El correo electrónico es obligatorio"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un correo válido"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);