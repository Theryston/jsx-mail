import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { EdgeExample } from "endpoints/EdgeExample";
import { scheduled } from "scheduled";

const ONE_HOUR = 60 * 60 * 1000;

export const router = OpenAPIRouter();

router.get("/edge", EdgeExample);

router.all("*", async (request: Request, env: Env) => {
	const url = new URL(request.url);
	const path = url.pathname;
	const searchParams = url.searchParams.toString();

	const apiUrl = `${env.BASE_API_URL}${path}${searchParams ? `?${searchParams}` : ''}`;

	console.log(`[PROXY] ${request.method} ${apiUrl}`);

	const newRequest = new Request(request, {
		cf: {
			cacheTtlByStatus: {
				'200-299': ONE_HOUR,
			},
			cacheEverything: true,
		}
	});

	let response: any = await fetch(apiUrl, newRequest)
	response = new Response(response.body, response)

	response.headers.set("Cache-Control", `max-age=${ONE_HOUR}`);

	return response
});

export default {
	fetch: router.handle,
	scheduled
} as ExportedHandler<Env>;
