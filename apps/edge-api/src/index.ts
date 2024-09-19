import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { scheduled } from "scheduled";

export const router = OpenAPIRouter();

router.all("*", (request: Request, env: Env) => {
	const url = new URL(request.url);
	const path = url.pathname;
	const searchParams = url.searchParams.toString();

	const apiUrl = `${env.BASE_API_URL}${path}${searchParams ? `?${searchParams}` : ''}`;

	console.log(`[PROXY] ${request.method} ${apiUrl}`);

	return fetch(apiUrl, request)
});

export default {
	fetch: router.handle,
	scheduled
} as ExportedHandler;
