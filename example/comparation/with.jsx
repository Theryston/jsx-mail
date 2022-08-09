// jsx
export function Welcome({ name }) {
  return <h1>{name} Welcome to jsx-mail</h1>;
}

// js
const { render } = require('jsx-mail');
const template = render('Welcome', { name: 'John' });
