import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';
import { useReducer, useEffect, useCallback } from 'react';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer.js';

function TodosPage({ token }) {

  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
} = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {

   const fetchTodos = async() => {

      dispatch({ type: TODO_ACTIONS.FETCH_START });
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
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: data.tasks || [],
          });
        } else if (response.status === 401) {
          throw new Error('unauthorized');
        } else {
          throw new Error('Failed to fetch todos');
        }
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          
          dispatch({ 
            type: TODO_ACTIONS.FETCH_FILTER_ERROR, 
            payload: { message: `Error filtering/sorting todos: ${error.message}`}});
        } else {
          dispatch({ type: TODO_ACTIONS.FETCH_ERROR, payload: { message: error.message }});
        }
      }
    }

      if (token) {
        fetchTodos();
      }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

   const addTodo = async(todoTitle) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    let newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo
    })

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
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { task: data.task, todoId: newTodo.id }
      })
      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { message: error.message, todoId: newTodo.id },
      })
    }
  }

   const completeTodo = async (id) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    const originalTodo = todoList.find(todo => todo.id === id);
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: id
    })
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
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { message: error.message, originalTodo },
      })
    }
  }

   const updateTodo = async(editedTodo) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
    dispatch({type: TODO_ACTIONS.UPDATE_TODO_START, payload: editedTodo})
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
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { message: error.message, originalTodo },
      })
    }
  }

  const handleFilterChange = (newFilter) => dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newFilter});

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.INVALIDATE_CACHE });
  }, []);

  return (
    <div>
      <h1>My Todos</h1>
      {error && 
        <>
          <p>
            {error}
          </p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
            Clear Error
          </button> 
        </>
      }
      {filterError && 
        <div>
          <p>
            {filterError}
          </p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}>
            Clear Filter Error
          </button> 
          <button 
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}>
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
        onSortByChange={(value) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortBy: value, sortDirection } })} 
        sortDirection={sortDirection} 
        onSortDirectionChange={(value) => dispatch({ type: TODO_ACTIONS.SET_SORT, payload: { sortDirection: value, sortBy } })}
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