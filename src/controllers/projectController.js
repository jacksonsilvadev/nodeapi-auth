const mongoose = require('mongoose');
// Algum Model
const Project = mongoose.model('Project')
const Task = mongoose.model('Task')

module.exports = {
    async index(req, res) {
        try {
            const projects = await Project.find({}).populate(['user', 'tasks']);

            return res.send({
                projects
            })

        } catch (err) {
            return res.status(400).send({
                error: 'Error to loading projects'
            })
        }
    },
    async show(req, res) {
        try {
            const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

            return res.send({
                project
            });
        } catch (err) {
            return res.status(400).send({
                error: 'Error to loading a project'
            })
        }
    },
    async store(req, res) {
        try {
            const {
                title,
                description,
                tasks
            } = req.body

            const project = await Project.create({
                title,
                description,
                user: req.userID
            });

            await Promise.all(tasks.map(async task => {

                const newTask = await new Task({
                    ...task,
                    project: project.id,
                    user: req.userID
                })

                await newTask.save();

                await project.tasks.push(newTask);
            }))

            await project.save();

            return res.send(project);


        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Error to create a new project'
            })
        }

    },
    async update(req, res) {
        try {
            const {
                title,
                description,
                tasks
            } = req.body

            const project = await Project.findById(req.params.projectId, {
                title,
                description
            }, {
                new: true
            });

            project.tasks = [];
            await Task.remove({
                project: req.params.projectId
            });


            await Promise.all(tasks.map(async task => {
                const newTask = await new Task({
                    ...task,
                    project: project._id,
                    user: req.userID
                })

                await newTask.save()

                await project.tasks.push(newTask);
            }))

            await project.save();

            await Task.remove({
                project: req.params.projectId
            });


            return res.send(project)

        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Error to update a project'
            })
        }

    },
    async destroy(req, res) {
        try {
            await Task.remove({
                project: req.params.projectId
            });

            await Project.findByIdAndRemove(req.params.projectId);

            return res.send(true);

        } catch (err) {
            return res.status(400).send({
                error: 'Error to delete a project'
            })
        }
    },
}