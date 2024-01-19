import { GluegunToolbox } from 'gluegun';
import axios from 'axios';
import load from '../../../utils/load';

module.exports = {
  command: 'create',
  alias: ['c'],
  description: 'Create an JSX mail email',
  run: async (toolbox: GluegunToolbox) => {
    const { username, name, email } = await toolbox.prompt.ask([
      {
        type: 'text',
        name: 'username',
        message: 'Type a username for your email',
      },
      {
        type: 'text',
        name: 'name',
        message: 'Type a name for your email',
      },
      {
        type: 'text',
        name: 'email',
        message: 'Type a email for two-factor authentication',
      },
    ]);

    if (!username || !name || !email) {
      toolbox.print.error('All fields are required!');
      return;
    }

    load.start(`Creating your email...`);

    try {
      const { data } = await axios.post(`https://jsxmail.org/api/mail`, {
        username,
        name,
        email,
      });

      if (data.code === 'EXISTS') {
        load.fail(`Already exists an email with the username: ${username}`);
        toolbox.print.info(
          `You can type \`jsxm mail auth\` to get a token for it`,
        );
        return;
      }

      load.succeed(`The email for ${name} was created: ${data.mail}`);
      toolbox.print.info(
        `You can type \`jsxm mail auth\` to get a token for it`,
      );
      return;
    } catch (error: any) {
      load.fail(
        error.response?.data?.message || 'Error while creating your email',
      );
    }
  },
};
