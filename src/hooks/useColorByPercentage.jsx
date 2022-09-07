const DEFAULT_RETURN_COLOR = 'grey';

function getColorByPercentage(percentage) {
  let color = 'grey';

  if (percentage >= 0.75) color = 'green';
  else if (percentage >= 0.5) color = 'yellow';
  else if (percentage >= 0.25) color = 'red';
  else color = 'grey';

  return color;
}

export function useColorByTaskPercentage(task, monthlyTotal) {
  if (!task) return DEFAULT_RETURN_COLOR;

  const taskStatusOverMonthlyTotal = task.status / monthlyTotal;

  const color = getColorByPercentage(taskStatusOverMonthlyTotal);

  return color;
}

export function useColorByUserTasksPercentage(user, monthlyTotal) {
  if (!user) return DEFAULT_RETURN_COLOR;

  const taskStatusTotal = user.tasks.reduce(
    (total, nextTask) => total + nextTask.status,
    0
  );

  const taskStatusTotalOverMonthlyTotal = taskStatusTotal / monthlyTotal;

  const color = getColorByPercentage(taskStatusTotalOverMonthlyTotal);

  return color;
}
