import { allPosts } from "content-collections";

import { DATA } from "@/data/resume";

export const SITE = {
  name: DATA.name,
  fullName: DATA.fullName,
  url: DATA.url,
  description: DATA.description,
  locale: "en_US",
  title: "NIL Money Guide for College Athletes",
  keywords: [
    "NIL",
    "Name Image Likeness",
    "college athlete finances",
    "NIL money management",
    "NIL financial literacy",
    "student athlete money",
    "NIL taxes",
    "college sports income",
    "NIL deals",
    "athlete financial planning",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE.url).toString();
}

export function getResourceSlug(path: string) {
  return path.replace(/\.mdx$/, "");
}

export function getSortedPosts() {
  return [...allPosts].sort((a, b) => {
    if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

export function createMetadata({
  title,
  description = SITE.description,
  path = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  const ogImage = image ?? "/opengraph-image";

  return {
    title,
    description,
    keywords: [...SITE.keywords],
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImage],
    },
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        inLanguage: "en-US",
        publisher: {
          "@id": `${SITE.url}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: SITE.fullName,
        alternateName: SITE.name,
        url: SITE.url,
        image: absoluteUrl(DATA.avatarUrl),
        description: DATA.summary.replace(/\*\*/g, ""),
        jobTitle: "NIL Financial Literacy Creator",
        knowsAbout: DATA.tags,
        sameAs: [],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE.url}/#webpage`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        isPartOf: {
          "@id": `${SITE.url}/#website`,
        },
        about: {
          "@id": `${SITE.url}/#person`,
        },
        inLanguage: "en-US",
      },
    ],
  };
}

export function createArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}) {
  const url = absoluteUrl(`/resources/${slug}`);
  const articleImage =
    image !== undefined ? absoluteUrl(image) : `${url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        datePublished: publishedAt,
        dateModified: updatedAt ?? publishedAt,
        image: articleImage,
        url,
        inLanguage: "en-US",
        author: {
          "@type": "Person",
          name: SITE.fullName,
          url: SITE.url,
        },
        publisher: {
          "@type": "Person",
          name: SITE.fullName,
          url: SITE.url,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Resources",
            item: absoluteUrl("/resources"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
    ],
  };
}
