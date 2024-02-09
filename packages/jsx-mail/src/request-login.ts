import core from "@jsx-mail/core";
import { showError } from "./utils/show-error";
import express from 'express';
import http from 'http';
import load from "./utils/load";
import open from "open";
import { getCurrentIp } from "./utils/get-current-ip";
import path from "path";

export default async function requestLogin(receivedToken?: string) {
	let isLogged = false

	try {
		await core.cloudClient.get('/user/me')
		isLogged = true
	} catch (error) {
		isLogged = false
	}

	if (isLogged) {
		return
	}

	if (!process.stdin.isTTY && !receivedToken) {
		await core.logout();
		const message = `Please specify a token from ${core.WEBSITE_URL}/cloud/app/account typing: \`jsxm login --token YOUR_TOKEN\`. If you set the env variable \`__JSX_MAIL_TOKEN\`, can also use \`jsxm login\` without any arguments.`;
		showError(message);
		return
	}

	if (receivedToken) {
		try {
			core.setToken(receivedToken);
			await core.cloudClient.get('/user/me')
			load.succeed(`Login successful! Token: ${receivedToken}`);
			return
		} catch (error) {
			load.fail('Invalid token');
			return
		}
	}

	try {
		load.start('Starting login...');

		await new Promise<void>((resolve, reject) => {
			const app = express();
			const server = http.createServer(app);

			app.get('/callback', async (req, res) => {
				const token = req.query.token;
				if (!token || typeof token !== 'string') {
					reject(new Error('No token'));
				}

				core.setToken(token as string);

				const projectName = path.basename(process.cwd());

				const { data: session } = await core.cloudClient.post('/session', {
					permissions: ['self:admin'],
					description: `JSX Mail CLI logged project ${projectName} from ${await getCurrentIp()}`,
				}, {
					headers: {
						Authorization: `Bearer ${token}`,
					}
				})
				await core.cloudClient.delete('/session', {
					headers: {
						Authorization: `Bearer ${token}`,
					}
				});

				core.setToken(session.token);

				res.send('Perfect! You can close this tab now.');

				server.close((err) => {
					if (err) {
						reject(err);
					}

					resolve();
				});
			})

			const PORT = 6553;
			server.listen(PORT);

			const url = `${core.WEBSITE_URL}/cloud/sign-in?redirect=http://localhost:${PORT}/callback`;
			open(url, { wait: true }).then(() => {
				load.text = `Please, log in to your account: ${url}`
			}).catch(() => {
				server.close();
				reject(new Error('Failed to open browser'));
			})
		})
		const newToken = core.getToken();
		load.succeed(`Login successful! Token: ${newToken}`);
	} catch (error: any) {
		await core.logout();
		load.stop();
		showError(error);
	}
}