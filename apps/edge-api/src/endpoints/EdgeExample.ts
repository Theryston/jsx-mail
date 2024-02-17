import { OpenAPIRoute } from "@cloudflare/itty-router-openapi";

export class EdgeExample extends OpenAPIRoute {
	async handle(request: any): Promise<Response> {
		return new Response(JSON.stringify({ message: "Hello, World!" }), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}