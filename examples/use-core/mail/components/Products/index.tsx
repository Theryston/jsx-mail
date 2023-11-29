import * as S from './styles';

export default function Products({
  products,
}: {
  products: {
    price: number;
    image: JSX.ImportedImage | string;
    link: string;
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
          <b
            className="product-name"
            id={`product-name-${product.name}`}
            style={S.ProductName}
          >
            Name: {product.name}
          </b>
          <div>
            Price:{' '}
            {(product.price / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
          <a style={S.ProductLink} href={product.link}>
            Buy Now
          </a>
        </div>
      ))}
    </div>
  );
}
