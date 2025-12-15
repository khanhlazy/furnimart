import Document, { Html, Head, Main, NextScript } from 'next/document';

class FurnimartDocument extends Document {
  render() {
    return (
      <Html lang="vi">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
            rel="stylesheet"
          />
          <meta name="description" content="FurniMart – trải nghiệm mua sắm nội thất đa vai trò" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default FurnimartDocument;
