import B2 from 'backblaze-b2';

const uploadHandler = async (req: any, res: any) => {
  const file: any = await new Promise((resolve) => {
    const chunks: any[] = [];

    req.on('readable', () => {
      let chunk;

      while (null !== (chunk = req.read())) {
        chunks.push(chunk);
      }
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });

  const b2 = new B2({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    applicationKeyId: process.env.BACKBLAZE_ID_KEY as string,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    applicationKey: process.env.BACKBLAZE_APPLICATION_KEY as string,
  });

  const { data: authData } = await b2.authorize();
  const { data: uploadData } = await b2.getUploadUrl({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    bucketId: process.env.BACKBLAZE_BUCKET_ID as string,
  });

  const reqFileName = req.headers['x-filename'];

  const { data } = await b2.uploadFile({
    uploadUrl: uploadData.uploadUrl,
    uploadAuthToken: uploadData.authorizationToken,
    data: file,
    fileName: reqFileName,
  });

  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const bucketName = process.env.BACKBLAZE_BUCKET_NAME;
  const downloadURL = authData.downloadUrl;

  res.status(200).json({
    url: `${downloadURL}/file/${bucketName}/${data.fileName}`,
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default uploadHandler;