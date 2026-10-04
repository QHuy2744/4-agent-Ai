export function calculateProjectProgress(project, tasks) {
  const pTasks = tasks.filter(t => t.projectId === project.id);
  if (pTasks.length === 0) return 0;
  const completed = pTasks.filter(t => t.status === 'done').length;
  return Math.round((completed / pTasks.length) * 100);
}