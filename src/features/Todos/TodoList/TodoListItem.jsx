import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';
import { useEditableTitle } from '../../../hooks/useEditableTitle.js';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
  const {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit
  } = useEditableTitle(todo.title);

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
            />
            {/* Button Container with Gap */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isValidTodoTitle(workingTitle)}
                onClick={handleUpdate}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950/50 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
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
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </label>
            <span
              onClick={startEditing}
              className={`flex-1 text-sm cursor-pointer transition ${
                todo.isCompleted
                  ? "line-through text-slate-400"
                  : "text-purple-100 hover:text-purple-300"
              }`}
            >
              {todo.title}
            </span>
          </div>
        )}
      </form>
    </li>
  );

}

export default TodoListItem;