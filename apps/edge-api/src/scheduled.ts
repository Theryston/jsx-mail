const WORKERS_TO_RUN = [
  'update-charge-month',
  'charge',
  'storage-size',
  'dead-messages',
];

export async function scheduled(
  event: ScheduledEvent,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  console.log('[WORKER] started at: ', new Date());
  const promises = [];

  for (const route of WORKERS_TO_RUN) {
    console.log(`[WORKER] fetching ${route} from ${env.BASE_API_URL}`);

    promises.push(
      fetch(`${env.BASE_API_URL}/worker/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.JSXMAIL_API_TOKEN}`,
        },
      }),
    );

    console.log(`[WORKER] fetching ${route} from ${env.DEV_BASE_API_URL}`);

    promises.push(
      fetch(`${env.DEV_BASE_API_URL}/worker/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.DEV_JSXMAIL_API_TOKEN}`,
        },
      }),
    );
  }

  await Promise.all(promises);
  console.log('[WORKER] ended at: ', new Date());
}
