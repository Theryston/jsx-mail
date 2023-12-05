import Featured from '../components/featured';
import Info from '../components/info';
import Layout from '../components/layout';
import * as S from './welcome.styles';

// URL to fetch the package.json from the latest version of JSX Mail
const GITHUB_PACKAGE_JSON_URL =
  'https://raw.githubusercontent.com/Theryston/jsx-mail/main/packages/jsx-mail/package.json';

// This function is called when the template is rendered
// This happens when you open it in the preview or when you call jsxMail.render()
// It can receive props from the render function. The syntax is:
// jsxMail.render('welcome', { myProp: 'myValue' })
// export async function onRender({ myProps }) {}
export async function onRender() {
  const packageResponse = await fetch(GITHUB_PACKAGE_JSON_URL);
  const packageJson = await packageResponse.json();

  return {
    version: packageJson.version,
  };
}

// This is the props type definition.
// Every single props that you want to use in your template must be defined here
// Here should be defined the props that is passed by:
//   - The render function - jsxMail.render('welcome', { myProp: 'myValue' })
//   - The onRender function returned object - { version: '1.0.0' }
// You just need to export the props type definition for:
//   - Templates that receive props from the render function or onRender function
export const props = {
  version: String(),
};

// This is the template itself
// You can use the props defined into `props` variable (line 31)
// You can also import components from other files
// You can also import assets like images
// Each .tsx/.ts/.jsx/.js file into the templates folder is a new template
// Once the file name does not ends with:
//   - .styles
//   - .style
//   - .styles.ts
//   - .style.ts
//   - .styles.js
//   - .style.js
//   - .styles.tsx
//   - .style.tsx
//   - .style.jsx
//   - .styles.jsx
// It will be considered as a template
// Just be happy and creative!
export default function Welcome({ version }: typeof props) {
  return (
    <Layout>
      <div style={S.Container} container>
        <Featured />
        <Info version={version} />
      </div>
    </Layout>
  );
}
