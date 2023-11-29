import Layout from '../../../components/Layout/index';
import Products from '../../../components/Products/index';
import * as S from './styles';

import MacbookImg from '../../../assets/macbook.png';
import PhoneImg from '../../../assets/phone.png';

const FAKE_PRODUCTS_DB: (typeof props)['products'] = [
  {
    name: 'MacBook',
    price: 50000,
    image:
      'https://i.ibb.co/86z29Rv/macbook-air-space-gray-select-201810-1-removebg-preview-1.png',
    userName: 'Theryston',
    link: 'https://www.apple.com/macbook-air/',
  },
];

type ExternalProps = {
  name: string;
  createdAt: Date;
};

export async function onRender(props: ExternalProps) {
  const userProducts = FAKE_PRODUCTS_DB.filter(
    (p) => p.userName === props.name,
  );

  return {
    products: userProducts,
  };
}

export const props = {
  name: String(),
  products: Array({
    price: Number(),
    userName: String(),
    image: String(),
    link: String(),
    name: String(),
  }),
  createdAt: Date(),
};

export default function UserWelcomeTemplate({
  name,
  products,
  createdAt,
}: typeof props) {
  return (
    <Layout title="Welcome">
      <div container sectionPending="10px">
        <div style={S.NameWrapper} section>
          <div style={S.NameText}>Hello, {name.toLocaleUpperCase()}</div>
        </div>
        <div section>
          <Products
            products={[
              ...products,
              {
                name: 'Macbook Pro',
                price: 10000,
                image: MacbookImg,
                link: 'https://www.apple.com/macbook-pro-13/',
              },
              {
                name: 'Phone',
                price: 20000,
                image: PhoneImg,
                link: 'https://www.apple.com/iphone/',
              },
            ]}
          />
          <div>Now: {createdAt}</div>
        </div>
      </div>
    </Layout>
  );
}
