const mongoose = require('mongoose')
const validator = require('validator')

const esquema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: 'é obrigatório!',
        },
        email: {
            type: String,
            unique: true, // não pode ser repetido no banco de dados
            required: 'é obrigatório!',
            lowercase: true,
            index: true,
            validate: {
                validator: (valorDigitado) => { return validator.isEmail(valorDigitado) },
                message: 'inválido!'
            }
        },
        senha: {
            type: String,
            required: 'é obrigatório!',
            select: false, //nesse caso ele não vai aparecer nas opções quando for feito um get
        },
    },
    {
        timestamps: true
    }
);

const EsquemaUsuario = mongoose.models.Usuario || mongoose.model('Usuario', esquema);
module.exports = EsquemaUsuario;