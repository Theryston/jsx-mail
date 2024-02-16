export interface Env {
	BASE_API_URL: string;
	JSXMAIL_API_TOKEN: string;
}

export default {
	scheduled: handler
};

const WORKERS_TO_RUN = [
	'add-free-balance',
	'charge',
	'storage-size'
]

async function handler(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<Response> {
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

	return new Response('Done', { status: 200 });
}