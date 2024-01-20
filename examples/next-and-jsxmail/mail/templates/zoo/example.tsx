import Layout from '../../components/layout';

// This is an example template
// This is for you to see how to use templates context
// Each folder into the templates folder is a new context
// So, you can organize your templates as you want
// Per example, you can create a user folder and put all user related templates
// into it
// To use an template context you just need to follow this:
//   - With the render function: jsxMail.render('zoo:example')
//   - And you can have mor subfolders: jsxMail.render('zoo:animals:example')
// You can also use the onRender function to pass props to your template
export default function Zoo() {
  return (
    <Layout>
      <p>Hi! I'm just an example!</p>
    </Layout>
  );
}
