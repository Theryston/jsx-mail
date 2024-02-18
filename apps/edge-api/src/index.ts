import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { EdgeExample } from "endpoints/EdgeExample";
import { scheduled } from "scheduled";

const ONE_HOUR = 60 * 60 * 1000;

export const router = OpenAPIRouter();

router.get("/edge", EdgeExample);

router.all("*", async (request: Request, env: Env, ctx: ExecutionContext) => {
	const url = new URL(request.url);
	const path = url.pathname;
	const searchParams = url.searchParams.toString();

	const cache = caches.default;
	const cacheKey = new Request(url.toString(), request);

	let response: any = await cache.match(cacheKey);

	if (!response) {
		console.log('no cache')
	} else {
		console.log('cache hit')
	}

	const apiUrl = `${env.BASE_API_URL}${path}${searchParams ? `?${searchParams}` : ''}`;

	console.log(`[PROXY] ${request.method} ${apiUrl}`);

	const newRequest = new Request(request);

	response = await fetch(apiUrl, newRequest)
	response = new Response(response.body, response);
	response.headers.append("Cache-Control", "s-maxage=1000000");

	ctx.waitUntil(cache.put(cacheKey, response.clone()));

	return response;
});

export default {
	fetch: router.handle,
	scheduled
} as ExportedHandler<Env>;
