import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation';
import { useEditableTitle } from '../../hooks/useEditableTitle';

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
    <li>
      <form onSubmit={(event) => handleUpdate(event.target.value)}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={(event) => updateTitle(event.target.value)}
            />
            <button type="button" onClick={cancelEdit}>Cancel</button>
            <button
              type="button"
              disabled={!isValidTodoTitle(workingTitle)}
              onClick={(event) => handleUpdate(event.target.value)}
            >
              Update
            </button>
          </>
        ) : (
            <>
              <label>
                <input
                  type="checkbox"
                  id={`checkbox${todo.id}`}
                  checked={todo.isCompleted}
                  onChange={() => onCompleteTodo(todo.id)}
                />
              </label>
              <span onClick={startEditing}>{todo.title}</span>
            </>
        )}
      </form>
    </li>
  )
}

export default TodoListItem;