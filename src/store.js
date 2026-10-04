export function createSelector(selectorFn) {
  return state => selectorFn(state);
}