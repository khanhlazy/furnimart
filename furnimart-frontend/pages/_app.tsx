import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function FurnimartApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
