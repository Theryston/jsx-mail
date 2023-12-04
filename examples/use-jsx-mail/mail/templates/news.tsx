import FeaturedImg from '../assets/featured.png';

export default function News() {
  return (
    <html>
      <head>
        <font href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
      </head>
      <body
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '16px',
          fontWeight: 'normal',
          padding: '0',
          margin: '0',
          color: '#000000',
          backgroundColor: '#ffffff',
        }}
      >
        <div>
          <img
            style={{ width: '100%', height: 'auto' }}
            src={FeaturedImg}
            alt="Featured"
          />
          <p
            style={{
              padding: '0',
              margin: '0',
            }}
          >
            News
          </p>
        </div>
      </body>
    </html>
  );
}
