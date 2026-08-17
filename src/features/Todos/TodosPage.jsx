import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { useState, useEffect, useCallback } from 'react';

function TodosPage({ token }) {

  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {

   const fetchTodos = async() => {
      setError('');
      setIsTodoListLoading(true);
      const paramsObject = {
        sortBy,
        sortDirection,
        limit: 100,
      };
      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }
      const params = new URLSearchParams(paramsObject);
      try {
        const response = await fetch(`/api/tasks?${params}`, 
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
          setFilterError('');
        } else if (response.status === 401) {
          throw new Error('unauthorized');
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

      if (token) {
        fetchTodos();
      }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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
      invalidateCache();
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
      invalidateCache();
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
      invalidateCache();
    } catch (error) {
      setTodoList(prev => prev.map(todo => todo.id === editedTodo.id ? originalTodo : todo));
      setError(error.message);
    }
  }

  const handleFilterChange = (newFilter) => setFilterTerm(newFilter);

  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

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
      {filterError && 
        <div>
          <p>
            {filterError}
          </p>
          <button onClick={() => setFilterError('')}>
            Clear Filter Error
          </button> 
          <button 
            onClick={() => {
              setFilterTerm('')
              setSortBy('createdAt')
              setSortDirection('desc')
              setFilterError('')
            }}
          >
            Reset Filters
          </button>
        </div>
      }
      {isTodoListLoading && 
        <p>
          Loading...
        </p>
      }
      <SortBy 
        sortBy={sortBy} 
        onSortByChange={setSortBy} 
        sortDirection={sortDirection} 
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;