const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/noderest', {
    useNewUrlParser: true
});
//^ Conectando com a base de dados
module.exports = mongoose;