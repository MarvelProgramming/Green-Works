const DEFAULT_RETURN_COLOR = 'grey';

function getColorByPercentage(percentage) {
  let color = 'grey';

  if (percentage >= 7.5) color = 'green';
  else if (percentage >= 5) color = 'yellow';
  else if (percentage >= 2.5) color = 'red';
  else color = 'grey';

  return color;
}

export function useColorByTaskPercentage(task) {
  if (!task) return DEFAULT_RETURN_COLOR;

  const color = getColorByPercentage(task.status);

  return color;
}

export function useColorByUserTasksPercentage(user) {
  if (!user) return DEFAULT_RETURN_COLOR;

  const averageTaskPercentage =
    user.tasks.reduce(
      (percentage, nextTask) => percentage + Math.min(nextTask.status, 10),
      0
    ) / user.tasks.length;

  const color = getColorByPercentage(averageTaskPercentage);

  return color;
}
