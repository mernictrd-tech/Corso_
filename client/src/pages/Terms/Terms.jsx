import Layout from "../../components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <section className="min-h-screen bg-[#050816] px-6 py-32">
       <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Terms & Conditions
          </h1>

          <p className="mb-10 text-gray-400">
            <strong>Last Updated:</strong> September 2026
          </p>

          <div className="space-y-10 text-gray-300 leading-8">
            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Skilium platform, you agree to comply 
                with these Terms & Conditions. If you do not agree with any part of these terms, 
                please do not use our platform or services.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                2. Account Registration
              </h2>
              <p>
                Users are responsible for providing accurate and complete information while 
                creating an account. You are responsible for maintaining the confidentiality of 
                your account credentials and for all activities carried out through your account.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                3. Courses & Assessments
              </h2>
              <p>
                Skilium provides technical and non-technical courses, assessments, and 
                learning resources. Users are expected to complete assessments independently 
                and provide accurate information during registration and assessment processes.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                4. Certifications
              </h2>
              <p>
                Certificates are issued based on the successful completion of applicable 
                assessments and certification requirements. Skilium reserves the right to withhold, 
                suspend, or revoke a certificate in cases of fraudulent activity, misuse, or violation 
                of assessment guidelines.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                5. Payments & Refunds
              </h2>
              <p>
                Certain courses, assessments, and certification services may require payment. 
                Users agree to provide accurate payment information and complete applicable payments 
                before accessing paid services. Refunds, where applicable, will be governed by Skilium's 
                refund and cancellation policy.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                6. User Conduct
              </h2>
              <p>
                Users must not misuse the platform, attempt to gain unauthorized access, 
                copy or distribute assessment content, impersonate another person, or engage in 
                activities that may negatively affect the platform or other users.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                7. Intellectual Property
              </h2>
              <p>
                All content available on Skilium, including course materials, assessments, 
                questions, designs, logos, text, graphics, and other resources, is the property 
                of Skilium or its respective content providers and may not be copied, reproduced, 
                or distributed without prior permission.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                8. Certificate Verification
              </h2>
              <p>
                Skilium certificates may include a unique certificate ID or verification mechanism. 
                Skilium may provide limited certificate-related information for verification purposes 
                while maintaining appropriate privacy protections.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                9. Platform Availability
              </h2>
              <p>
                Skilium strives to maintain reliable and secure platform services but does not 
                guarantee uninterrupted or error-free access at all times. Maintenance, technical 
                issues, or circumstances beyond our control may temporarily affect platform availability.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                10. Limitation of Liability
              </h2>
              <p>
                Skilium provides learning, assessment, and certification services to support 
                skill development and professional growth. However, certification does not guarantee 
                employment, promotion, admission, or any specific career outcome.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                11. Changes to these Terms
              </h2>
              <p>
                Skilium may update these Terms & Conditions from time to time to reflect 
                changes in our services, policies, or applicable requirements. Continued 
                use of the platform after changes are published constitutes acceptance of the updated terms.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                12. Contact Us
              </h2>
              <p>
                If you have any questions regarding this Privacy Policy, please
                contact us at <strong>info@skilium.com</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;