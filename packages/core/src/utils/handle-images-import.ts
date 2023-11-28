/* eslint-disable no-undef */
function handleImage(module: any, absolutePath: string) {
  module.exports = {
    __jsx_mail_image: true,
    path: absolutePath,
  };
}

export default function handleImagesImport() {
  require.extensions['.png'] = handleImage;
  require.extensions['.jpg'] = handleImage;
  require.extensions['.jpeg'] = handleImage;
  require.extensions['.gif'] = handleImage;
}
