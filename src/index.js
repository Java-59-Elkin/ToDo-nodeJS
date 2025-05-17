import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://elkinms85:tlNvx5U6k17MJiBb@cluster0.e17r5r0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Connection error:', err));

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: String,
    status: String
});

const Todo = mongoose.model('Todo', todoSchema);

app.post('/todo', async (req, res) => {
    const {title, description, priority, status} = req.body;
    const todo = new Todo({
        title, description, priority, status
    });
    await todo.save();
    res.type('text/plain; charset=utf-8').send(`ok`);
    }
)

app.get('/todo/:id', async (req, res) => {
    const id = req.params.id;
    const result = await Todo.findById(req.params.id);
    if(!result) {
        return res.status(404).type('text/plain; charset=utf-8').send(`Task with id = ${id} not found`);
    }
    res.json(result);
})

app.put('/todo/:id', async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findById(req.params.id);
    if(!todo) {
        return res.status(404).type('text/plain').send(`Task with id = ${id} not found`);
    }
    const body = req.body;
    todo.title = body.title;
    todo.description = body.description;
    todo.priority = body.priority;
    todo.status = body.status
    await todo.save();
    res.json(todo);
})

app.delete('/todo/:id', async (req, res) => {
    const id = req.params.id;
    const index = await Todo.findByIdAndDelete(id);
    if(index === -1 ) {
        return res.status(404).type('text/plain; charset=utf-8').send(`Task with id = ${id} not found`);
    }
    res.json({ message: 'Task deleted', index });
})

// TODO 4 endpoints with methods: Get (By...) x 2,  Patch (Put one field) x 2

app.get('/todo/title/:title', async (req, res) => {
    const title = req.params.title;
    const result = await Todo.find({title});
    if(result.length === 0) {
        return res.status(404).type('text/plain; charset=utf-8').send(`Task with title ${title} is not found`);
    }
    res.json(result);
})

app.get('/todo', async (req, res) => {
    const description = req.query.description;
    const result = await Todo.find({description});
    if(result.length === 0) {
        return res.status(404).type('text/plain; charset=utf-8').send(`Task with description ${description} is not found`);
    }
    res.json(result);
})

app.patch('/todo/title/:id', async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    if(!todo) {
        return res.status(404).type('text/plain').send(`Task with id = ${id} not found`);
    }
    const body = req.body;
    todo.title = body.title;
    await todo.save();
    res.json(todo);
})

app.patch('/todo/description/:id', async (req, res) => {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    if(!todo) {
        return res.status(404).type('text/plain').send(`Task with id = ${id} not found`);
    }
    const body = req.body;
    todo.description = body.description;
    await todo.save();
    res.json(todo);
})


app.get('/todos', async (req, res) => {
    res.json(await Todo.find());
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});