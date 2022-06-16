const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
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
      id: uuidv4(),
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
  const todosUser = users.find((user) => user.username === username);
  return response.send(todosUser.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const newTodo = {
    id: uuidv4(),
	  title,
	  done: false, 
	  deadline: new Date(deadline), 
	  created_at: new Date()
  };
  user.todos.push(newTodo);
  return response.status(201).send(newTodo);
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;
  const todoItemEdit = user.todos.find((todoItem) => todoItem.id === id);
  if(todoItemEdit){
    todoItemEdit.title = title;
    todoItemEdit.deadline = deadline;
    return response.send(todoItemEdit);
  };
  return response.status(404).json({error: "Todo item not found!"});
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todoItemDone = user.todos.find((todoItem) => todoItem.id === id);
  if(todoItemDone){
    todoItemDone.done = true;
    return response.send(todoItemDone);
  };
  return response.status(404).json({error: "Todo item not found!"});
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todoItemDelete = user.todos.find((todoItem) => todoItem.id === id);
  if(todoItemDelete){
    user.todos.splice(user.todos.indexOf(todoItemDelete), 1);
    return response.status(204).send();
  }
  return response.status(404).json({error: "Todo item no found!"});
});

module.exports = app;