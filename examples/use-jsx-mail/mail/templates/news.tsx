import FeaturedImg from '../assets/featured.png';

export default function News() {
  return (
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
  );
}
