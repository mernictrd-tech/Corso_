import { Helmet } from "react-helmet-async";

const SEO = ({ certificationName = "Professional" }) => {
  const title = `${certificationName} Certification Online | Skilium`;

  const description = `Earn an online ${certificationName} certification with Skilium. Get certified quickly and showcase your verified digital credential with a globally verifiable TID.`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content="https://skilium.in"
      />
    </Helmet>
  );
};

export default SEO;