import { GluegunToolbox } from 'gluegun';
import axios from 'axios';
import load from '../../../utils/load';

module.exports = {
  command: 'auth',
  alias: ['a'],
  description: 'Get a token for your email',
  run: async (toolbox: GluegunToolbox) => {
    const { username } = await toolbox.prompt.ask([
      {
        type: 'text',
        name: 'username',
        message: 'Type the username of your email',
      },
    ]);

    if (!username) {
      toolbox.print.error('The username is required!');
      return;
    }

    load.start(`Generating a token...`);

    try {
      const { data } = await axios.post(`https://jsxmail.org/api/mail/auth`, {
        username,
      });

      load.succeed(
        `A token was generated for ${username} and sent to: ${data.sentTo}`,
      );
      toolbox.print.info(
        `You can copy the token and set the env \`JSX_MAIL_TOKEN=<your-token>\` to use it for sending emails`,
      );
      return;
    } catch (error: any) {
      let message =
        error.response?.data?.message || 'Error while generating your token';

      if (error.response?.data?.code === 'NOT_EXISTS') {
        message = "There's no email with this username!";
      }

      load.fail(message);
    }
  },
};
