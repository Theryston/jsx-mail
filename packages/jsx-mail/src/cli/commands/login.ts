import { GluegunToolbox } from 'gluegun';
import load from '../../utils/load';
import core from '@jsx-mail/core';
import requestLogin from '../../request-login';

module.exports = {
	command: 'login',
	alias: ['l'],
	description: 'Login to your JSX Mail account',
	run: async (toolbox: GluegunToolbox) => {
		try {
			let customToken = toolbox.parameters.options.token as string;

			if (customToken) {
				toolbox.print.info(`Using token from arguments: ${customToken}`);
			} else {
				// eslint-disable-next-line turbo/no-undeclared-env-vars
				customToken = process.env.__JSX_MAIL_TOKEN as string;

				if (customToken) {
					toolbox.print.info(`Using token from env variable: ${customToken}`);
				}
			}

			await core.logout();
			await requestLogin(customToken);
		} catch (error) {
			load.fail('Failed to login');
			toolbox.print.error(error);
			process.exit(1);
		}
	},
};
