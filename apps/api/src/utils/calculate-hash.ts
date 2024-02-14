import nodeCrypto from 'crypto';

export default function calculateHash(content: nodeCrypto.BinaryLike) {
  return nodeCrypto.createHash('sha256').update(content).digest('hex');
}
