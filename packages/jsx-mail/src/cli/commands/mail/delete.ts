import { GluegunToolbox } from 'gluegun';
import axios from 'axios';
import load from '../../../utils/load';

module.exports = {
  command: 'delete',
  alias: ['d'],
  description: 'Delete an email',
  run: async (toolbox: GluegunToolbox) => {
    toolbox.print.info(
      `Please type \`jsxm mail auth\` before to generate a token. Then copy the token and insert it in the field bellow`,
    );
    const { token } = await toolbox.prompt.ask([
      {
        type: 'text',
        name: 'token',
        message: 'Type your email token',
      },
    ]);

    if (!token) {
      toolbox.print.error('The token is required!');
      return;
    }

    load.start(`Deleting email...`);

    try {
      await axios.delete(`https://jsxmail.org/api/mail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      load.succeed(`The email was deleted!`);
      return;
    } catch (error: any) {
      load.fail(error.response?.data?.message || 'Error while deleting');
    }
  },
};
