export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
  FETCH_FILTER_ERROR: "FETCH_FILTER_ERROR",

  // Add todo operations
  ADD_TODO_START: "ADD_TODO_START",
  ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
  ADD_TODO_ERROR: "ADD_TODO_ERROR",

  // Complete todo operations
  COMPLETE_TODO_START: "COMPLETE_TODO_START",
  COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
  COMPLETE_TODO_ERROR: "COMPLETE_TODO_ERROR",

  // Update todo operations
  UPDATE_TODO_START: "UPDATE_TODO_START",
  UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
  UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",

  // UI operations
  SET_SORT: "SET_SORT",
  SET_FILTER: "SET_FILTER",
  CLEAR_ERROR: "CLEAR_ERROR",
  CLEAR_FILTER_ERROR: "CLEAR_FILTER_ERROR",
  RESET_FILTERS: "RESET_FILTERS",

  // Cache operation
  INVALIDATE_CACHE: "INVALIDATE_CACHE",
};

export const initialTodoState = {
  todoList: [],
  error: "",
  filterError: "",
  isTodoListLoading: true,
  sortBy: "createdAt",
  sortDirection: "asc",
  filterTerm: "",
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    // Fetch operations
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: "",
        filterError: "",
      };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: Array.isArray(action.payload)
          ? action.payload
          : action.payload?.tasks || [],
        isTodoListLoading: false,
        error: "",
        filterError: "",
      };
    case TODO_ACTIONS.FETCH_ERROR: {
      const { message, isFilterError } = action.payload;
      return {
        ...state,
        isTodoListLoading: false,
        error: isFilterError ? "" : message,
        filterError: isFilterError ? message : "",
      };
    }
    case TODO_ACTIONS.FETCH_FILTER_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: "",
        filterError: `Error filtering/sorting todos: ${action.payload.message}`,
      };

    // Add todo operations
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload, ...state.todoList],
        error: "",
      };
    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      { const taskFromBackend = action.payload?.task || action.payload;
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.todoId
            ? (taskFromBackend || todo)
            : todo,
        ),
        error: "",
        filterError: "",
      }; }
    case TODO_ACTIONS.ADD_TODO_ERROR:
      { const { todoId, message } = action.payload;
      return {
        ...state,
        todoList: state.todoList.filter(
          (todo) => todo.id !== todoId,
        ),
        error: message,
      }; }

    // Complete todo operations
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload ? { ...todo, isCompleted: true } : todo,
        ),
        error: "",
      };
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      { const completedTask = action.payload?.task || action.payload;
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          completedTask && todo.id === completedTask.id ? completedTask : todo,
        ),
        error: "",
        filterError: "",
      }; }
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      { const completedOriginalTask = action.payload?.originalTodo;
      return {
        ...state,
        todoList: completedOriginalTask
          ? state.todoList.map((todo) =>
              todo.id === completedOriginalTask.id
                ? completedOriginalTask
                : todo,
            )
          : state.todoList,
        error: action.payload.message,
      }; }

    // Update todo operations
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, title: action.payload.title }
            : todo,
        ),
        error: "",
      };
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      { const updatedTask = action.payload?.task || action.payload;
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          updatedTask && todo.id === updatedTask.id ? updatedTask : todo,
        ),
        error: "",
        filterError: "",
      }; }
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      { const originalTodo = action.payload?.originalTodo;
      return {
        ...state,
        todoList: originalTodo
          ? state.todoList.map((todo) =>
              todo.id === originalTodo.id ? originalTodo : todo,
            )
          : state.todoList,
        error: action.payload.message,
      }; }

    // UI operations
    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
        error: "",
        filterError: "",
      };
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload,
        error: "",
        filterError: "",
      };
    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: "",
      };
    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: "",
      };
    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: "",
        sortBy: "createdAt",
        sortDirection: "asc",
        error: "",
        filterError: "",
      };

    // Cache operations
    case TODO_ACTIONS.INVALIDATE_CACHE:
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
