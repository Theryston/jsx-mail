import LogoImage from '../assets/logo.png';

export const props = {
  name: String(),
};

export default function UserCreated({ name }: typeof props) {
  return (
    <div container>
      <div section alignX="center" alignY="center">
        <img
          style={{
            width: '100px',
          }}
          src={LogoImage}
          alt="JSX Mail"
        />
      </div>
      <div section>
        <p>Hi {name},</p>
      </div>
      <div section>
        <p>Your account has been created.</p>
      </div>
    </div>
  );
}
