/* eslint-disable @typescript-eslint/no-var-requires */
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const renderTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, 'mail', 'hbs', `${templateName}.hbs`);
  const template = fs.readFileSync(templatePath, 'utf-8');
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
}

const data = {
  name: 'John Doe',
}

const html = renderTemplate('Welcome', data);

console.log(`Perfect! Your email template is ready to be sent:`)
console.log(html);
