// pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>Majestik Magik | Cleaning Services</title>
          {/* You can add custom links to external stylesheets or fonts here */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
          <meta name="title" content="Majestik Magik | Cleaning Service" />
          <meta name="description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
          <meta name="author" content="Majestik Magik" />
          <meta property="og:title" content="Majestik Magik | Cleaning Service" />
          <meta property="og:description" content="Get quality cleaning service with us. Let us bring cleanliness and comfort to your space!" />
          <meta property="og:image" content="/img/majestik_magik_cleaning_01.png" />
          <meta property="og:url" content="https://cleaning.majestikmagik.com" />
       
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
