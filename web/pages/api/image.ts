/* eslint-disable turbo/no-undeclared-env-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import error from "../../utils/error";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import requestIp from 'request-ip';
import { connectToDatabase } from "../../config/mongodb";

const router = createRouter<NextApiRequest, NextApiResponse>();

type Body = {
  hash: string;
  mimetype: string;
  size: number;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMETYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
const MAX_IMAGES_PER_IP = 100;

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as Body;

  const bodyError = validateParams(body);

  if (bodyError) {
    return res.status(400).json({ message: bodyError });
  }

  const ip = requestIp.getClientIp(req);

  if (!ip) {
    return res.status(400).json({ message: 'ip is invalid' });
  }

  const { db } = await connectToDatabase();

  const imagesCount = await getIpImagesCount(db, ip);

  if (imagesCount >= MAX_IMAGES_PER_IP) {
    return res.status(400).json({ message: `you can only upload ${MAX_IMAGES_PER_IP} images` });
  }

  const url = getImageDirectUrl(
    body.hash,
    body.mimetype,
  );

  const sameIpImage = await db.collection('images').findOne({
    hash: body.hash,
    ip
  });

  if (!sameIpImage) {
    await db.collection('images').insertOne({
      ip,
      url,
      hash: body.hash,
      mimetype: body.mimetype,
      size: body.size,
      created_at: new Date(),
    });
  }

  const result: {
    url: string;
    upload_url?: string;
  } = {
    url,
  }

  const imageExists = await existsImage(url);

  if (!imageExists) {
    const uploadUrl = await generatePresignedUrl(body.hash, body.mimetype, body.size);
    result['upload_url'] = uploadUrl;
  }

  res.json(result);
}

async function existsImage(url: string) {
  const response = await fetch(url, {
    method: 'HEAD',
  });

  return response.status === 200;
}

function getImageDirectUrl(hash: string, mimetype: string) {
  const endpoint = process.env.BACKBLAZE_ENDPOINT!;
  const endpointDomain = endpoint.split('//')[1];
  const bucketName = process.env.BACKBLAZE_BUCKET_NAME!;
  const url = `https://${bucketName}.${endpointDomain}/${hash}.${mimetype.split('/')[1]}`;
  return url;
}

async function getIpImagesCount(
  db: any,
  ip: string,
) {
  return await db.collection('images').countDocuments({ ip });
}

async function generatePresignedUrl(hash: string, mimetype: string, size: number) {
  const s3Client = new S3Client({
    region: process.env.BACKBLAZE_REGION,
    endpoint: process.env.BACKBLAZE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.BACKBLAZE_ID_KEY!,
      secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY!,
    },
  });

  const command = new PutObjectCommand({
    Bucket: process.env.BACKBLAZE_BUCKET_NAME!,
    Key: `${hash}.${mimetype.split('/')[1]}`,
    ContentType: mimetype,
    ContentLength: size,
    ChecksumSHA256: hash,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 600,
  });
}

function validateParams(body: Body): string | undefined {
  if (!body.size || typeof body.size !== 'number') {
    return 'size is invalid';
  }

  if (body.size > MAX_SIZE) {
    return `the file is too large (max ${MAX_SIZE} bytes)`;
  }

  if (!body.hash || typeof body.hash !== 'string') {
    return 'hash is invalid';
  }

  if (!isHashAnSHA256(body.hash)) {
    return 'hash is not an SHA-256';
  }

  if (!body.mimetype || typeof body.mimetype !== 'string') {
    return 'mimetype is invalid';
  }

  if (!ALLOWED_MIMETYPES.includes(body.mimetype)) {
    return `mimetype is not allowed (allowed: ${ALLOWED_MIMETYPES.join(', ')})`;
  }
}

function isHashAnSHA256(hash: string) {
  return /^[a-f0-9]{64}$/i.test(hash);
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const hash = req.query.hash as string;

  if (!hash) {
    return res.status(400).json({ message: 'hash is required' });
  }

  const { db } = await connectToDatabase();

  const ip = requestIp.getClientIp(req);

  const sameIpImage = await db.collection('images').findOne({ hash, ip });

  if (!sameIpImage) {
    return res.status(404).json({ message: 'image not found' });
  }

  const differentIpImages = await db.collection('images').find({ hash, ip: { $ne: ip } }).toArray();

  if (!differentIpImages.length) {
    await deleteImage(hash, sameIpImage.mimetype);
  }

  await db.collection('images').deleteOne({ hash, ip });

  res.json({ message: 'image deleted' });
}

async function deleteImage(hash: string, mimetype: string) {
  const s3Client = new S3Client({
    region: process.env.BACKBLAZE_REGION,
    endpoint: process.env.BACKBLAZE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.BACKBLAZE_ID_KEY!,
      secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY!,
    },
  });

  const command = new DeleteObjectCommand({
    Bucket: process.env.BACKBLAZE_BUCKET_NAME!,
    Key: `${hash}.${mimetype.split('/')[1]}`,
  })

  await s3Client.send(command);
}

router.delete(deleteHandler);
router.post(postHandler);

export default router.handler(error);