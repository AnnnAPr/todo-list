import './App.css'
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

function App() {

  const [todoList, setTodoList] = useState([]);

  const addTodo = (todoTitle) => {
    let newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList(previous  => [newTodo, ...previous]);
  }

  const completeTodo = (id) => {
    const updatedList = todoList.map((todo) => todo.id === id ? {...todo, isCompleted: true} : todo);
    setTodoList(updatedList);
  }

  const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) => todo.id === editedTodo.id ? {...todo, title: editedTodo.title} : todo);
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  )
}

export default App
