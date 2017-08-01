const {db, } = require('./pgp');
const express = require('express');
const app = express();
const bodyParser = require ("body-parser");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use (bodyParser.urlencoded ({
	extended: true
}));

app.use (bodyParser.json());

app.get('/api/todo-mvc/all', (req, res) => {
    db.any('SELECT * FROM todolist ORDER BY id DESC')
    .then((data) => {
        res.json(data)
    })
    .catch(error => {
        console.log(error)
    });
});


app.post('/api/todo-mvc/addTodo', (req, res) => {
    let title1 = req.body.title;
    let completed1 = req.body.completed;
    db.task(t => {
        return t.any("INSERT INTO todolist(title, completed) VALUES($1, $2)", [title1, completed1])
            .then(() => {
                return t.any('SELECT * FROM todolist ORDER BY id DESC');
            })
    })
    .then((data) => {
        res.json(data)
    })
    .catch(error => {
        console.log(error)
    });
});

app.post('/api/todo-mvc/removeTodo', (req, res) => {
    console.log(req.body)
    let id1 = req.body.id;

    db.task(t => {
        return t.any("DELETE FROM todolist WHERE id = $1", id1)
            .then(() => {
                return t.any('SELECT * FROM todolist ORDER BY id DESC');
            })
    })
    .then((data) => {
        res.json(data)
    })
    .catch(error => {
        console.log(error)
    });
});

app.post('/api/todo-mvc/editTodo', (req, res) => {
    //req.body.todo = JSON.parse(req.body.todo)
    let id1 = req.body.todo.id;
    let title1 = req.body.todo.title;
    let completed1 = req.body.todo.completed;
    db.task(t => {
        return t.any("UPDATE todolist SET title = $1, completed = $2 WHERE id = $3", [title1, completed1, id1])
            .then(() => {
                return t.any('SELECT * FROM todolist ORDER BY id DESC');
            })
    })
    .then((data) => {
        res.json(data)
    })
    .catch(error => {
        console.log(error)
    });
});

app.post('/api/todo-mvc/completeTodo', (req, res) => {
    let id1 = req.body.todo.id;
    let completed1 = !req.body.todo.completed;
    db.task(t => {
        return t.any("UPDATE todolist SET completed = $1 WHERE id = $2", [completed1, id1])
            .then(() => {
                return t.any('SELECT * FROM todolist ORDER BY id DESC');
            })
    })
    .then((data) => {
        res.json(data)
    })
    .catch(error => {
        console.log(error)
    });
});

app.post('/api/todo-mvc/removeCompleted', (req, res) => {
    let todos = req.body.completedTodos;
    let ids = todos.map(item => {
        return item.id;
    });

    // console.log(ids)
    let ids1 = ids.join(',');
    db.task(t => {
        return t.any(`DELETE FROM todolist WHERE id IN (${ids1}) AND completed = 'true'`)
            .then(() => {
                return t.any('SELECT * FROM todolist ORDER BY id DESC');
            })
    })
    .then((data) => {
        res.json(data)
    })
    .catch(error => {
        console.log(error)
    });
});

const port = 3000;
app.listen(port, () => {
    console.log('Ready for GET requests on http://localhost:' + port);
});


Tung: