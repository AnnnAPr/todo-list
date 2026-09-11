import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../features/Todos/TodoForm.jsx";
import SortBy from "../shared/SortBy.jsx";
import FilterInput from "../shared/FilterInput.jsx";
import useDebounce from "../utils/useDebounce.js";
import { useReducer, useEffect, useCallback } from "react";
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter.jsx";

function TodosPage() {
  const { token, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const statusFilter = searchParams.get("status") || "all";

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

  const debouncedFilterTerm = useDebounce(filterTerm, 500);

  useEffect(() => {
    const fetchTodos = async () => {
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
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const tasks = Array.isArray(data) ? data : data.tasks || [];
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: tasks,
          });
        } else if (response.status === 401) {
          await logout();
          throw new Error("unauthorized");
        } else {
          throw new Error("Failed to fetch todos");
        }
      } catch (error) {
        if (
          debouncedFilterTerm ||
          sortBy !== "createdAt" ||
          sortDirection !== "asc"
        ) {
          dispatch({
            type: TODO_ACTIONS.FETCH_FILTER_ERROR,
            payload: { message: error.message },
          });
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: { message: error.message },
          });
        }
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion, logout]);

  const addTodo = async (todoTitle) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    let newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: newTodo,
    });

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      const data = await response.json();
      const createdTask = data?.task || data;
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { task: createdTask, todoId: newTodo.id },
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { message: error.message, todoId: newTodo.id },
      });
    }
  };

  const completeTodo = async (id) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    const originalTodo = todoList.find((todo) => todo.id === id);
    const nextStatus = !originalTodo?.isCompleted;
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: id,
    });
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({ isCompleted: nextStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }
      const data = await response.json();
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: data.task,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { message: error.message, originalTodo },
      });
    }
  };

  const updateTodo = async (editedTodo) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: editedTodo });
    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const data = await response.json();
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: data.task,
      });
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { message: error.message, originalTodo },
      });
    }
  };

  const handleFilterChange = (newFilter) =>
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newFilter });

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.INVALIDATE_CACHE });
  }, []);

  const deleteTodo = async (id) => {
    dispatch({ type: TODO_ACTIONS.CLEAR_ERROR });
    dispatch({ type: TODO_ACTIONS.DELETE_TODO_START, payload: id });

    const originalTodo = todoList.find((todo) => todo.id === id);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS, payload: id });
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.DELETE_TODO_ERROR, payload: { message: error.message, originalTodo } });
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 text-left">
          My Todos
        </h1>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 ${
            isTodoListLoading ? "visible" : "invisible"
          }`}
        >
          Loading...
        </span>
      </div>
      {error && (
        <>
          <p>{error}</p>
          <button onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}>
            Clear Error
          </button>
        </>
      )}
      {filterError && (
        <div>
          <p>{filterError}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      )}
      <SortBy
        sortBy={sortBy}
        onSortByChange={(value) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: value, sortDirection },
          })
        }
        sortDirection={sortDirection}
        onSortDirectionChange={(value) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortDirection: value, sortBy },
          })
        }
      />
      <StatusFilter />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;
