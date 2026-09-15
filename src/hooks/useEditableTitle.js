import { useState } from "react";
import { isValidTodoTitle, TODO_TITLE_MAX_LENGTH } from "../utils/todoValidation";
export function useEditableTitle(initialTitle) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(initialTitle);

  const startEditing = () => {
    setWorkingTitle(initialTitle);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setWorkingTitle(initialTitle);
    setIsEditing(false);
  };

  const updateTitle = (newTitle) => {
    if (newTitle.length <= TODO_TITLE_MAX_LENGTH) {
      setWorkingTitle(newTitle);
    }
  };

  const finishEdit = () => {
    setIsEditing(false);
    return workingTitle;
  };

  return {
    isEditing,
    workingTitle,
    startEditing,
    cancelEdit,
    updateTitle,
    finishEdit,
    isValid: isValidTodoTitle(workingTitle),
  };
}
