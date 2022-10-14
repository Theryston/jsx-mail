# Jsx Hello

This is the most complete example of using jsx mail. Unlike the other usage examples this one doesn't show how to specifically use a single jsx mail feature, it describes a full usage example with styled-components, template submission, rendering, various components...

## Running

To start jsx-hello you first need to clone the project on your machine, to do this just run the following command below:

```bash
git clone -n https://github.com/Theryston/jsx-mail.git jsx-hello && cd jsx-hello && git checkout HEAD examples/jsx-hello && mv examples/jsx-hello/* . && rm -rf examples && rm -rf .git
```

After that git will clone only the jsx hello files from the github jsx mail repository and go into its folder. So now we just need to install the dependencies and in this case we are pnpm as a package generator:

```bash
pnpm install
```

After that duplicate the `.env.example` file and rename the generated duplicate to `.env`, open the new `.env` file and edit the environment variables for your data.

You can run this project in a browser using the jsx mail cli, to do this just run the following command:

```bash
pnpm jsxm serve
```

If you want to send the email template to someone just run the `index.js` file:

```bash
node index.js
```
