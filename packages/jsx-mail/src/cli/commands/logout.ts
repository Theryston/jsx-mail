import { GluegunToolbox } from 'gluegun';
import load from '../../utils/load';
import core from '@jsx-mail/core';

module.exports = {
	command: 'logout',
	alias: ['lu'],
	description: 'logout from your JSX Mail account',
	run: async (toolbox: GluegunToolbox) => {
		try {
			load.start('Logging out...');
			await core.logout();
			load.succeed('Logout successful!');
		} catch (error) {
			load.fail('Failed to login');
			toolbox.print.error(error);
			process.exit(1);
		}
	},
};
