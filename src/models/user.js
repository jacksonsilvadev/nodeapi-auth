const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        // ^Atributo para ele ser unique
        required: true,
        lowercase: true,
        // ^Atributo para salvar na base como lowercase
    },
    password: {
        type: String,
        required: true,
        select: false,
        //^ Atributo select faz com que não seja retornado em uma query padrão, só quando utilizado o .select('+{nome do campo}')
    },
    passwordResetToken: {
        type: String,
        select: false,
        //^ Atributo select faz com que não seja retornado em uma query padrão, só quando utilizado o .select('+{nome do campo}')
    },
    passwordResetExpiress: {
        type: Date,
        select: false,
        //^ Atributo select faz com que não seja retornado em uma query padrão, só quando utilizado o .select('+{nome do campo}')
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    // ^ Chamando uma função pre para que antes de salvar ele execute essa função de callback
    const hash = await bcrypt.hash(this.password, 10);
    // ^ Transformando a senha da pessoa em hash para uma melhor segurando
    this.password = hash;
    // ^ Passando o objeto criado para a hash

    return next();
    // ^ Executando o próximo passo
})

const User = mongoose.model('User', UserSchema);
// ^ Declarando a Schema para a model