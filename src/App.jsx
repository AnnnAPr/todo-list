import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';

function App() {

  const [todoList, setTodoList] = useState([]);

  const addTodo = (todoTitle) => {
    let newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList(previous  => [newTodo, ...previous]);
  }

  const completeTodo = (id) => {
    todoList.map((todo) => todo.id === id ? {...todo, isCompleted: true} : todo);
    // setTodoList(previous => previous.map(todo => todo.id === id ? {...todo, isCompleted: !todo.isCompleted} : todo));
    setTodoList(todoList);
  }

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  )
}

export default App
