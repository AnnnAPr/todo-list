import { useState, useRef } from "react";
import {
  isValidTodoTitle,
  getTodoTitleError,
  TODO_TITLE_MAX_LENGTH,
} from "../../utils/todoValidation.js";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const inputRef = useRef(null);
  const error = getTodoTitleError(workingTodoTitle);

  const handleAddTodo = (event) => {
    event.preventDefault();
    if (error) return;
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
  };

  return (
    <form onSubmit={handleAddTodo} className="flex flex-col gap-3 my-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label
            htmlFor="todoTitle"
            className="text-sm font-medium text-purple-200"
          >
            New Todo
          </label>
          <input
            type="text"
            id="todoTitle"
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            ref={inputRef}
            maxLength={TODO_TITLE_MAX_LENGTH}
            className="w-full bg-purple-950/60 border border-purple-700/60 text-purple-100 placeholder-purple-400/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
        <button
          type="submit"
          disabled={!isValidTodoTitle(workingTodoTitle)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950/50 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Add Todo
        </button>
      </div>
      {error && <p className="text-xs text-red-400 ml-0">{error}</p>}
    </form>
  );
}

export default TodoForm;
