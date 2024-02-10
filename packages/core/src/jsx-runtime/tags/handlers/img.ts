import { getProps } from '..';
import { ImageInfo, JSXMailVirtualDOM } from '../../..';
import calculateHash from '../../../utils/calculate-hash';
import CoreError from '../../../utils/error';
import { readRawFile } from '../../../utils/file-system';
import {
  insertGlobalVariableItem,
  readGlobalVariable,
} from '../../../utils/global';
import getStorage from '../../../utils/storage';
import getStyle from '../../get-style';

export const ImgProps = [
  'align',
  'border',
  'height',
  'width',
  'src',
  'style',
  'alt',
];

export default function ImgHandler(
  props: JSX.IntrinsicElements['img'],
): JSXMailVirtualDOM {
  const { src, alt } = props;
  const style = getStyle(props);

  if (!src && typeof src !== 'string') {
    throw new CoreError('src_is_required');
  }

  if (!alt && typeof alt !== 'string') {
    throw new CoreError('alt_is_required');
  }

  const newProps: any = { ...props };

  delete newProps.src;

  let newSrc = src;

  if ((newSrc as any).__jsx_mail_image) {
    const imageInfo = handleImage((newSrc as any).path);
    insertGlobalVariableItem('images_using', {
      id: imageInfo.hash,
    });
    newSrc = imageInfo.url;
  }

  return {
    node: 'img',
    props: {
      ...getProps(newProps, style),
      src: newSrc,
    },
    children: [],
    __jsx_mail_vdom: true,
  };
}

function handleImage(src: string): ImageInfo {
  const state = readGlobalVariable('state')[0]?.id;
  const onlyTag = readGlobalVariable('onlyTag').find((oT) => oT.id === 'img');
  const storage = getStorage();
  const fileContent = readRawFile(src);
  const fileHash = calculateHash(fileContent);

  let imageInfo: ImageInfo = {} as ImageInfo;
  if (state === 'prepare' && onlyTag) {
    const imagesString = storage.getItem('images');
    const images: ImageInfo[] = JSON.parse(imagesString || '[]');

    const storageImageInfo = images.find((image) => image.hash === fileHash);

    if (storageImageInfo) {
      return storageImageInfo;
    }

    imageInfo = {
      url: '',
      status: 'pending_upload',
      hash: fileHash,
      path: src,
      originalPath: src,
    };

    images.push(imageInfo);
    storage.setItem('images', JSON.stringify(images));
  } else {
    const imagesString = storage.getItem('images');
    const images: ImageInfo[] = JSON.parse(imagesString || '[]');
    const storageImageInfo = images.find((image) => image.hash === fileHash);
    if (!storageImageInfo) {
      throw new CoreError('image_not_found', { src });
    }

    imageInfo = storageImageInfo;
  }

  return imageInfo;
}
