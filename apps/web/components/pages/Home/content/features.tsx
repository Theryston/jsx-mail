export type Feature = {
  name: string;
  description: string;
};

export type Features = Array<Feature>;

export const FEATURES: Features = [
  {
    name: 'Image Optimization and Hosting',
    description: `With JSX Mail, you do not have to worry about image hosting or optimization. It will automatically optimize and upload the image to JSX Mail Cloud. You can also configure your own S3 very simply. In the end, JSX Mail allows you to use an image in your email template in the same way as you do on the front-end with React.`,
  },
  {
    name: 'onRender Function',
    description:
      'Export an asynchronous function with the name onRender and it will run whenever your email template is rendered. This is ideal for performing database queries or other dynamic operations.',
  },
  {
    name: 'Preview',
    description:
      'With JSX Mail you can see all the changes made to your email template in real time! Just type `jsxm preview` in your terminal and it will make a preview of all your email templates available at: http://localhost:3256',
  },
  {
    name: 'High Compatibility',
    description:
      'Every JSX tag and CSS property in JSX Mail is meticulously crafted to ensure full compatibility with the most popular email clients. This eliminates concerns about display issues across different platforms.',
  },
  {
    name: 'No React Dependency',
    description:
      'JSX Mail has its own JSX runtime and does not rely on frameworks like React. This ensures greater security as each element is created and tested specifically for compatibility with email clients.',
  },
  {
    name: 'Components',
    description:
      'Just like React and other front-end frameworks, JSX Mail allows the use of separate components for each part of your email template, providing better organization and code reusability.',
  },
];
