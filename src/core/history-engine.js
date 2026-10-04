export function undo(state) {
  if (state.history.undoStack.length === 0) return state;
  const item = state.history.undoStack.pop();
  state.history.redoStack.push(item);
  return item.prevState;
}