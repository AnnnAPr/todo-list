import { useState, useRef } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../utils/todoValidation.js";

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const inputRef = useRef(null);

  const handleAddTodo = (event) => {
    event.preventDefault();

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
      />
      <button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-md transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
