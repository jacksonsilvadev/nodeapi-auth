const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        //^ Tipo para receber _ID(Objeto)
        require: true,
        ref: 'Project'
        //^ Relacionamento para a model Project
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        //^ Tipo para receber _ID(Objeto)
        require: true,
        ref: 'User'
        //^ Relacionamento para a model User
    },
    completed: {
        type: Boolean,
        require: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', TaskSchema);