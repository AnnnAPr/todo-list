import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import isValidTodoTitle from '../utils/todoValidation';

function TodoForm({ onAddTodo }) {

  const [workingTodoTitle , setWorkingTodoTitle] = useState("");

  const handleAddTodo = (event) => {
    event.preventDefault();
   
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");
      
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel 
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)} value={workingTodoTitle}
      />
      {/* <label htmlFor="todoTitle">Todo</label>
      <input 
        type="text"
        id="todoTitle"
        name="todoTitle"
        placeholder={'Todo text'}
        value = {workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      /> */}
      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)} >Add Todo</button>
    </form>
  );
}

export default TodoForm;