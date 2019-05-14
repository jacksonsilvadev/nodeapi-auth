const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        //^ Tipo para receber _ID(Objeto)
        require: true,
        ref: 'User'
        //^ Relacionamento para a model User
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        //^ Tipo para receber _ID(Objeto)
        require: true,
        ref: 'Task'
        //^ Relacionamento para a model Task
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', ProjectSchema);