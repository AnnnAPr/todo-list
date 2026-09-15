import { useState, useRef } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle, getTodoTitleError, TODO_TITLE_MAX_LENGTH } from "../../utils/todoValidation.js";

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
    <form onSubmit={handleAddTodo} className="flex items-end gap-3 my-4">
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="New Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        ref={inputRef}
        maxLength={TODO_TITLE_MAX_LENGTH}
        error={error}
      />
      <button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950/50 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
