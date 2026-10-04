export function searchEntities(state, query) {
  const q = query.toLowerCase();
  const tasks = state.tasks.filter(t => t.title.toLowerCase().includes(q));
  const projects = state.projects.filter(p => p.name.toLowerCase().includes(q));
  return { tasks, projects };
}