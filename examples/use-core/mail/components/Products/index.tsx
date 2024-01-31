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
    <div style={S.ProductsWrapper} container>
      {products.map((product) => (
        <div style={S.ProductWrapper} section>
          <img
            style={S.ProductImage}
            src={product.image}
            alt={`Photo of ${product.name}`}
          />
          <br
            className="break-line"
            style={S.BreakLine}
            id={`break-line-${product.name}`}
          />
          <b
            className="product-name"
            id={`product-name-${product.name}`}
            style={S.ProductName}
          >
            Name: {product.name}
          </b>
          <br />
          <strong
            className="product-price"
            id={`product-price-${product.name}`}
            style={S.ProductPrice}
          >
            Price:{' '}
            {(product.price / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </strong>
          <br />
          <a style={S.ProductLink} href={product.link}>
            Buy Now
          </a>
          <hr size="1px" width="50%" align="right" />
        </div>
      ))}
    </div>
  );
}
