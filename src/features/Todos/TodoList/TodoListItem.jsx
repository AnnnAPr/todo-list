import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import {
  isValidTodoTitle,
  getTodoTitleError,
  TODO_TITLE_MAX_LENGTH,
} from "../../../utils/todoValidation.js";
import { useEditableTitle } from "../../../hooks/useEditableTitle.js";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
  } = useEditableTitle(todo.title);

  const error = getTodoTitleError(workingTitle);

  const handleUpdate = (event) => {
    if (!isEditing) return;
    event.preventDefault();
    const finalTitle = finishEdit();
    onUpdateTodo({ ...todo, title: finalTitle });
  };

  return (
    <li className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-3 my-2 shadow-sm">
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={(event) => updateTitle(event.target.value)}
              maxLength={TODO_TITLE_MAX_LENGTH}
              error={error}
            />
            {/* Button Container with Gap */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isValidTodoTitle(workingTitle)}
                onClick={handleUpdate}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950/50 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Update
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </label>
            <button
              type="button"
              onClick={startEditing}
              className={`flex-1 text-sm text-left cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded ${
                todo.isCompleted
                  ? "line-through text-slate-400"
                  : "text-purple-100 hover:text-purple-300"
              }`}
            >
              {todo.title}
            </button>

            <button
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
              aria-label="Delete todo"
              className="p-1 text-slate-200 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer ml-auto focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
