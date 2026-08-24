export const TODO_ACTIONS = {
  // Fetch operations
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  FETCH_FILTER_ERROR: 'FETCH_FILTER_ERROR',
  
  // Add todo operations
  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  // Complete todo operations
  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  // Update todo operations
  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  // UI operations
  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',
  RESET_FILTERS: 'RESET_FILTERS',

  // Cache operation
  INVALIDATE_CACHE: 'INVALIDATE_CACHE',
};

export const initialTodoState = {
  todoList: [],
  error: '',
  filterError: '',
  isTodoListLoading: false,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  console.log('action.type: ', action.type);
  console.log('actionpayload: ', action.payload);
  console.log('state: ', state);
  switch (action.type) {
    // Fetch operations
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        todoList: action.payload,
        isTodoListLoading: false,
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: `Error fetching todos: ${action.payload.message}`,
        filterError: '',
      };
    case TODO_ACTIONS.FETCH_FILTER_ERROR:
      return {
        ...state,
        isTodoListLoading: false,
        error: '',
        filterError: `Error filtering/sorting todos: ${action.payload.message}`,
      };

    // Add todo operations
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        todoList: [action.payload, ...state.todoList],
        error: '',
      };
    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        // todoList: [action.payload, ...state.todoList],
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.todoId ? (action.payload.task || todo) : todo),
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        // todoList: state.todoList.filter(todo => todo.id !== action.payload.todoId),
        todoList: state.todoList.filter(todo => todo.id !== action.payload.todoId),
        error: action.payload.message,
      };

    // Complete todo operations
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload ? { ...todo, isCompleted: true } : todo),
        error: '',
      };
    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id ? action.payload : todo),
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.originalTodo.id ? action.payload.originalTodo : todo),
        error: action.payload.message,
      };

    // Update todo operations
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo),
        error: '',
      };
    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map(todo => 
          todo.id === action.payload.id ? action.payload : todo),
        error: '',
        filterError: '',
      };
    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        todoList: state.todoList.map(todo =>
          todo.id === action.payload.originalTodo.id ? action.payload.originalTodo : todo),
        error: action.payload.message,
      };

    // UI operations
    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };
    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload,
      };
    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };
    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: '',
      };
    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'createdAt',
        sortDirection: 'desc',
        filterError: '',
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