'use client'

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cramdesk',
    url: 'https://cramdesk.com',
    logo: 'https://cramdesk.com/logo.png',
    description: 'Transforme tes cours PDF en fiches, flashcards et quiz en 2 minutes grâce à l\'IA.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://cramdesk.com/contact',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ProductJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Cramdesk',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '3.99',
      highPrice: '12.99',
      priceCurrency: 'EUR',
      offerCount: 3,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Application IA pour transformer des PDF en fiches de révision, flashcards et quiz.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebPageJsonLd({ 
  title, 
  description, 
  url 
}: { 
  title: string
  description: string
  url: string 
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Cramdesk',
      url: 'https://cramdesk.com',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
