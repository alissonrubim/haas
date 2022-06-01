export async function wait(config: {
  seconds?: number,
  minutes?: number,
  hours?: number
}) {
  const time = ((config.seconds ?? 0) * 1000) + ((config.minutes ?? 0) * 1000 * 60) + ((config.hours ?? 0) * 1000 * 60 * 60)
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}