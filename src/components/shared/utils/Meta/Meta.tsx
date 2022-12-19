import React from 'react';
import Head from 'next/head';

const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/*
// TODO:
set og image url
ratio: 1.91:1
min-dim: 1200x630
*/
const OG_IMAGE_URL = '';

interface Props {
  pageDescription: string;
  pageTitle?: string;
  urlPath?: string;
  ogImageUrl?: string;
  locale?: string;
}

/**
 * @param {Props['locale']} props.locale
 * @param {Props['ogImageUrl']} props.ofImageUrl
 * @param {Props['pageDescription']} props.pageDescription
 * @param {Props['pageTitle']} props.pageTitle
 * @param {Props['urlPath']} props.urlPath
 * @returns Function Component
 *
 * @description Pre-configures meta properties for Next.js Head for SEO and social media purposes.
 */
const Meta: React.FC<Props> = ({
  pageDescription,
  pageTitle = '',
  urlPath = '',
  ogImageUrl = OG_IMAGE_URL,
  locale = 'en_GB'
}) => {
  const canonicalUrl = `${BASE_URL}${urlPath}`;
  return (
    <Head>
      <title>{`${pageTitle}${pageTitle ? ' | ' : ''}${SITE_TITLE}`}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content="James Plummer" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta
        name="og:description"
        property="og:description"
        content={pageDescription}
      />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary" />

      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
};

export default Meta;
