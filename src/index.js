const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;
  const user = users.find((user) => user.username === username);
  if(!user){
    return response.status(400).json({error: "User doens't exists!"});
  }
  request.user = user;
  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  if(!users.find((user) => user.username === username)){
    const newUser = {
      id: uuidv4,
      name,
      username,
      todos: []
    };
    users.push(newUser);
    return response.status(201).send(newUser);
  };
  return response.status(400).json({error: "User already exists!"});
  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;