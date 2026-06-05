export function solveKnapsack(capacity, tasks) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    const duration = task.Duration;
    const impact = task.Impact;

    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];

      if (duration <= w) {
        dp[i][w] = Math.max(
          dp[i][w],
          dp[i - 1][w - duration] + impact
        );
      }
    }
  }

  const selectedTasks = [];
  let w = capacity;

  for (let i = n; i > 0 && w > 0; i--) {
    const task = tasks[i - 1];

    if (dp[i][w] !== dp[i - 1][w]) {
      selectedTasks.push(task);
      w -= task.Duration;
    }
  }

  selectedTasks.reverse();

  const totalImpact = dp[n][capacity];
  const totalDuration = capacity - w;

  return {
    selectedTasks,
    totalImpact,
    totalDuration,
    remainingCapacity: w
  };
}
