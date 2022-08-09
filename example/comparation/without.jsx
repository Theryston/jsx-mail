// hbs

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome</title>
  </head>
  <body>
    <table>
      <tr>
        <td>
          <h1>{{ name }} Welcome to jsx-mail</h1>
        </td>
      </tr>
    </table>
  </body>
</html>;

// js
const fs = require('fs');
const handlebars = require('handlebars');

const content = fs.readFileSync('./template.hbs', 'utf-8');
const template = handlebars.compile(content);
