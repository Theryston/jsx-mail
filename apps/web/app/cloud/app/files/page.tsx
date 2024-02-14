import axios from '@/app/utils/axios';
import { Content } from './content';
import { PER_PAGE } from './constants';

export default async function PageFiles() {
  const {
    data: { files, totalPages },
  } = await axios.get('/file', {
    params: {
      page: 1,
      take: PER_PAGE,
    },
  });

  return <Content files={files} totalPages={totalPages} />;
}
