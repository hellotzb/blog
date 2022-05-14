import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import axios from 'axios';
import Layout from '../components/Layout';

import '../styles/globals.css';

const options = {
  fetcher: (url: string) => axios.post(url).then((res) => res.data),
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={options}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}

export default MyApp;
