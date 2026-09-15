export const TODO_TITLE_MAX_LENGTH = 200;

export function isValidTodoTitle(title) {
  const trimmed = title.trim();
  return trimmed !== "" && trimmed.length <= TODO_TITLE_MAX_LENGTH;
}

export function getTodoTitleError(title) {
  const trimmed = title.trim();
  if (trimmed === "") return "Title is required";
  if (trimmed.length > TODO_TITLE_MAX_LENGTH) return `Title must be ${TODO_TITLE_MAX_LENGTH} characters or less`;
  return null;
}