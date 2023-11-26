import Layout from '../../../components/Layout/index';
import Products from '../../../components/Products/index';
import * as S from './styles';

export const props = {
  name: String(),
  products: Array({
    price: Number(),
    name: String(),
  }),
  createdAt: Date(),
};

// export const props = {
// 	name: 'Theryston',
// 	products: [
// 		{
// 			price: 100,
// 			name: 'Phone',
// 		},
// 		{
// 			price: 1000,
// 			name: 'macbook',
// 		},
// 	],
// 	createdAt: Date(),
// };

export default function UserWelcomeTemplate({
  name,
  products,
  createdAt,
}: typeof props) {
  return (
    <Layout>
      <div container>
        <div style={S.NameWrapper} section>
          <div style={S.NameText}>Hello, {name.toLocaleUpperCase()}</div>
        </div>
        <div section>
          <Products products={products} />
        </div>
        <div section>Buy at: {createdAt}</div>
      </div>
    </Layout>
  );
}
