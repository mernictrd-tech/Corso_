const SiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://skilium.in/#organization",
        "name": "Skilium",
        "url": "https://skilium.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://skilium.in/logo.png"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://skilium.in/#website",
        "url": "https://skilium.in",
        "name": "Skilium",
        "publisher": {
          "@id": "https://skilium.in/#organization"
        },
        "inLanguage": "en-IN"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
};

export default SiteSchema;