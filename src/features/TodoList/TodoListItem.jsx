// import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import isValidTodoTitle from '../../utils/todoValidation';
import useEditableTitle from '../../hooks/useEditableTitle';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
  const {
  isEditing,
  workingTitle,
  startEditing,
  cancelEdit,
  updateTitle,
  finishEdit
} = useEditableTitle(todo.title);

  // const [isEditing, setIsEditing] = useState(false);
  // const [workingTitle , setWorkingTitle] = useState(todo.title);

  // const handleCancel = () => {
  //   setIsEditing(false);
  //   setWorkingTitle(todo.title);
  // }

  // const handleEdit = (event) => {
  //   event.preventDefault();
  //   setWorkingTitle(event.target.value);
  // }

  // const handleUpdate = (event) => {
  //   if (!isEditing) return;
  //   event.preventDefault();
  //   onUpdateTodo({...todo, title: workingTitle});
  //   setIsEditing(false);
  // }

  return (
    <li>
      <form onSubmit={event => {
        if (!isEditing) return;
        event.preventDefault();
        const finalTitle = finishEdit();
        onUpdateTodo({ ...todo, title: finalTitle });
      }}>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={(event) => updateTitle(event.target.value)}/>
            <button type="button" onClick={cancelEdit}>Cancel</button>
            <button 
              type="button" 
              onClick={(event) => {
                if (!isEditing) return;
                event.preventDefault();
                const finalTitle = finishEdit();
                onUpdateTodo({ ...todo, title: finalTitle });
              }} 
              disabled={!isValidTodoTitle(workingTitle)}
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
              <span onClick={() => startEditing()}>{todo.title}</span>
            </>
        )}
      </form>
    </li>
  )
}

export default TodoListItem;