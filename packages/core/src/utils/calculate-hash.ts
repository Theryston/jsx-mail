import nodeCrypto from 'crypto';

export default function calculateHash(content: nodeCrypto.BinaryLike) {
  return nodeCrypto.createHash('md5').update(content).digest('hex');
}
