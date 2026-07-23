import Layout from "../../components/layout/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="min-h-screen bg-[#050816] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Privacy Policy
          </h1>

          <p className="mb-10 text-gray-400">
            <strong>Last Updated:</strong> July 2026
          </p>

          <div className="space-y-10 text-gray-300 leading-8">
            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                1. Information We Collect
              </h2>
              <p>
                Corso collects information you provide while creating an account,
                enrolling in courses, completing assessments, purchasing
                certifications, or contacting our support team. This may include
                your name, email address, phone number, educational background,
                professional information, payment details, and account
                credentials.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                2. How We Use Your Information
              </h2>
              <p>
                We use your information to provide learning services, conduct
                assessments, issue certificates, improve our platform, process
                payments, respond to support requests, send important updates,
                and maintain the security of your account.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                3. Cookies & Analytics
              </h2>
              <p>
                Our website uses cookies and analytics tools to improve user
                experience, understand website usage, remember preferences, and
                enhance platform performance.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security
                measures to safeguard your personal information from unauthorized
                access, disclosure, alteration, or destruction.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                5. Certificate Verification
              </h2>
              <p>
                Corso certificates may be verified through a unique certificate
                ID. Only information necessary for verification will be publicly
                displayed.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                6. Changes to this Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. Continued use of
                the platform after changes indicates your acceptance of the
                revised policy.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                7. Contact Us
              </h2>
              <p>
                If you have any questions regarding this Privacy Policy, please
                contact us at <strong>info@corso.com</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;