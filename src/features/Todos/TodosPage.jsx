import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState, useEffect } from 'react';

function TodosPage({ token }) {

  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {

   const fetchTodos = async() => {
      setError('');
      setIsTodoListLoading(true);
      try {
        const response = await fetch('/api/tasks', 
        { 
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          credentials: 'include' 
        });
        if (response.ok) {
          const data = await response.json();
          setTodoList(data.tasks || []);
        } else if (response.status === 401) {
          throw 'unauthorized';
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (error) {
        setError(typeof error === 'string' ? error : error.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

      if (token) {
        fetchTodos();
      }
  }, [token]);

   const addTodo = async(todoTitle) => {
    setError('');
    let newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    setTodoList(previous  => [newTodo, ...previous]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false })
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      const data = await response.json();
      setTodoList(previous  => previous.map(todo => todo.id === newTodo.id ? (data.task || todo) : todo));
    } catch (error) {
      setTodoList(previous  => previous.filter(todo => todo.id !== newTodo.id ));
      setError(error.message);
    }
  }

   const completeTodo = async (id) => {
     setError('');
     const originalTodo = todoList.find(todo => todo.id === id);
    setTodoList(prev => prev.map(todo => todo.id === id ? { ...todo, isCompleted: true } : todo));
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true })
      });
      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }
    } catch (error) {
      setTodoList(prev => prev.map(todo => todo.id === id ? originalTodo : todo));
      setError(error.message);
    }
  }

   const updateTodo = async(editedTodo) => {
     setError('');
     const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
    setTodoList(prev => prev.map(todo => todo.id === editedTodo.id ? { ...todo, title: editedTodo.title } : todo));
    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({ title: editedTodo.title, isCompleted: editedTodo.isCompleted })
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
    } catch (error) {
      setTodoList(prev => prev.map(todo => todo.id === editedTodo.id ? originalTodo : todo));
      setError(error.message);
    }
  }

  return (
    <div>
      <h1>My Todos</h1>
      {error && 
        <>
          <p>
            {error}
          </p>
          <button onClick={() => setError('')}>
            Clear Error
          </button> 
        </>
      }
      {isTodoListLoading && 
        <p>
          Loading...
        </p>
      }
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  );
}

export default TodosPage;