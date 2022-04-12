const JSXMAIL_BASEs_PATH = '../../dist';
const path = require('path');

const JSXMail = require(`${JSXMAIL_BASEs_PATH}/core`);

(async () => {
  const app = new JSXMail.App(path.resolve(__dirname, 'mail'));
  await app.build();
})();
