import Layout from '../../../components/Layout/index';
import Products from '../../../components/Products/index';
import * as S from './styles';

const FAKE_PRODUCTS_DB: (typeof props)['products'] = [
  {
    name: 'Phone',
    price: 1000,
    userName: 'Theryston',
  },
  {
    name: 'MacBook',
    price: 300,
    userName: 'John',
  },
  {
    name: 'MacBook',
    price: 500,
    userName: 'Theryston',
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
          <Products products={products} />
          <div>Buy at: {createdAt}</div>
        </div>
      </div>
    </Layout>
  );
}
