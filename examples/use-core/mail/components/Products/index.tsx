import * as S from './styles';

export default function Products({
  products,
}: {
  products: {
    price: number;
    image: JSX.ImportedImage | string;
    name: string;
  }[];
}) {
  return (
    <div style={S.ProductsWrapper}>
      {products.map((product) => (
        <div style={S.ProductWrapper}>
          <img
            style={S.ProductImage}
            src={product.image}
            alt={`Photo of ${product.name}`}
          />
          <div>Name: {product.name}</div>
          <div>
            Price:{' '}
            {(product.price / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
