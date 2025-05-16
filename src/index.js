import express from "express";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const bd = [];
let counter = 0;

app.post('/todo', (req, res) => {
    const {title, description} = req.body;
    const todo = {
        id: counter++,
        title,
        description
    }
    bd.push(todo);
    res.type('text/plain; charset=utf-8').send(`ok`);
    }
)

app.get('/todo/:id', (req, res) => {
    const id = req.params.id;
    const result = bd.find(t => t.id === +id);
    if(!result) {
        return res.status(404).type('text/plain; charset=utf-8').send(`Task with this id = ${id} not found`);
    }
    res.json(result);
})

app.put('/todo/:id', (req, res) => {
    const id = req.params.id;
    const todo = bd.find(t => t.id === +id);
    if(!todo) {
        return res.status(404).type('text/plain').send(`Task with this id = ${id} not found`).end();
    }
    const body = req.body;
    todo.title = body.title;
    todo.description = body.description;
    res.json(todo);
})

app.delete('/todo/:id', (req, res) => {
    const id = req.params.id;
    const index = bd.findIndex(t => t.id === +id);
    if(index === -1 ) {
        return res.status(404).type('text/plain; charset=utf-8').send(`Task with this id = ${id} not found`).end();
    }
    bd.splice(index,1);
    res.json(index);
})

// TODO 4 endpoints with methods: Get (By...) x 2,  Patch (Put one field) x 2



app.get('/todos', (req, res) => {
    res.json(bd);
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});