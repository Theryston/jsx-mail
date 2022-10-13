import * as React from 'react';
import request from 'sync-request';
import fs from 'fs';
import formData from 'form-data';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path?: string;
  imgbbApiKey?: string;
}

export const Image = (props: ImageProps) => {
  if (!props) {
    console.log('\x1b[31m', 'Error: Enter src like a props', '\x1b[0m');
    return <p>Error! See The Logs</p>;
  }

  const { src, path, imgbbApiKey, ...rest } = props;

  if (!src && !path) {
    console.log('\x1b[31m', 'Error: Image src is required', '\x1b[0m');
    return <p>Error! See The Logs</p>;
  }

  if (src && !src?.startsWith('http')) {
    console.log(
      '\x1b[31m',
      'Error: Image src should be a url. Example: http://example.com/image.png',
      '\x1b[0m',
    );
    console.log(
      '\x1b[33m',
      'If you need to use a local image, use the absolute path in props "path"',
      '\x1b[0m',
    );
    return <p>Error! See The Logs</p>;
  }

  if (src) {
    return <img src={src} {...rest} />;
  }

  if (!imgbbApiKey) {
    console.log(
      '\x1b[31m',
      'Error: You need to enter the imgbbApiKey in props if you want to use a local image',
      '\x1b[0m',
    );
    return <p>Error! See The Logs</p>;
  }

  if (path) {
    const file = fs.readFileSync(path);
    const base64 = Buffer.from(file).toString('base64');
    const form = new formData();
    form.append('image', base64);

    const response = request(
      'POST',
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        headers: form.getHeaders(),
        body: form.getBuffer(),
      },
    );

    const { data } = JSON.parse(response.getBody('utf8'));

    const url = data.url;

    return <img src={url} {...rest} />;
  }

  return <p>Error! See The Logs</p>;
};
