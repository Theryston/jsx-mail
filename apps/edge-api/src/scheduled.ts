const WORKERS_TO_RUN = [
	'add-free-balance',
	'charge',
	'storage-size'
]

export async function scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
	console.log('[WORKER] started at: ', new Date());
	const promises = [];

	for (const route of WORKERS_TO_RUN) {
		promises.push(fetch(`${env.BASE_API_URL}/worker/${route}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${env.JSXMAIL_API_TOKEN}`
			}
		}));
	}

	await Promise.all(promises);
	console.log('[WORKER] ended at: ', new Date());
}
