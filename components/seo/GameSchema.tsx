import { SITE } from "@/lib/content";

interface FAQ { question: string; answer: string; }
interface Props {
  slug: string;
  title: string;
  description: string;
  faqs: FAQ[];
}

export default function GameSchema({ slug, title, description, faqs }: Props) {
  const url = `${SITE.url}/${slug}`;
  const orgId = `${SITE.url}/#organization`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: title, item: url },
    ],
  };
  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#game`,
    name: title,
    description,
    url,
    inLanguage: "en",
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser",
    genre: "Puzzle",
    gamePlatform: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@id": orgId },
  };
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </>
  );
}
