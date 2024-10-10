import Typography from '../../../components/typography/index';
import Layout from '../../../components/layout/index';
import moment from 'moment';

export const props = {
  code: String('123456'),
  expiresAt: new Date().toISOString(),
};

export default function SecurityCodeTemplate({
  code,
  expiresAt,
}: typeof props) {
  return (
    <Layout>
      <Typography size="large" weight="bold">
        Security Code
      </Typography>
      <Typography>
        Someone requested a security code to access your account. If this wasn't
        you, please ignore this email and contact our support by JSX Mail Cloud.
      </Typography>
      <Typography>
        Here is your security code: <strong>{code}</strong>
      </Typography>
      <Typography color="gray">
        This code will expire at{' '}
        {moment(expiresAt).format('MMMM Do YYYY, h:mm:ss a')}. Please do not
        share this code with anyone.
      </Typography>
    </Layout>
  );
}
