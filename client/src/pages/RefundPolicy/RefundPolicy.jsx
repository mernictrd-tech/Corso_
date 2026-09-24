import Layout from "../../components/layout/Layout";

const RefundPolicy = () => {
  return (
    <Layout>
      <section className="min-h-screen bg-[#050816] px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Refund Policy
          </h1>

          <p className="mb-10 text-gray-400">
            <strong>Last Updated:</strong> September 2026
          </p>

          <div className="space-y-10 text-gray-300 leading-8">
            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                1. Policy Overview
              </h2>
              <p>
                Skilium aims to provide a smooth and reliable experience for
                all paid courses, assessments, certifications, and digital services.
                This Refund Policy outlines the circumstances under which a refund may
                be considered and the process for submitting a refund request.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                2. When a Refund May Be Considered
              </h2>
              <p>A refund may be approved after review in situations such as:</p>

              <ul className="list-disc pl-6">
                <li>The same transaction was charged more than once.</li>
                <li>The payment was successfully deducted, but the purchased service was not activated or delivered.</li>
                <li>A technical problem with the Skilium platform prevented the user from receiving the purchased service.</li>
                <li>The amount charged was different from the applicable amount displayed at the time of purchase.</li>
                <li>Skilium is unable to provide the purchased course, assessment, or certification service despite reasonable support efforts.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                3. Cases Where Refunds Are Not Applicable
              </h2>
              <p>Refunds will generally not be provided in the following circumstances:</p>

              <ul className="list-disc pl-6">
                <li>The course, assessment, or certificate has already been successfully accessed, completed, or delivered.</li>
                <li>The user is dissatisfied with an assessment score or certification result.</li>
                <li>The user changes their mind after using or accessing the purchased service.</li>
                <li>Incorrect personal or certificate information was submitted by the user and the certificate has already been generated.</li>
                <li>The account or service was suspended due to misuse, fraudulent activity, violation of assessment rules, or breach of Skilium's Terms & Conditions.</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                4. Refund Request Period
              </h2>
              <p>
                Refund requests should be submitted within 7 days from the date of the transaction.
                Requests submitted after this period may be reviewed at Skilium's discretion, subject to
                applicable laws and payment provider requirements.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                5. How to Submit a Refund Request
              </h2>
              <p>
                To request a refund, contact us at info@skilium.com and provide your name, 
                registered email address or phone number, course or certification details, transaction date, 
                transaction ID, and a brief explanation of the issue.For your security, please do not share 
                passwords, OTPs, complete card numbers, CVV, or other confidential payment information.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                6. Refund Processing
              </h2>
              <p>
                Once a refund is approved, Skilium will initiate it through 
                the original payment method wherever possible. The time required 
                for the amount to appear in your account may vary depending on the bank, 
                payment gateway, card issuer, UPI provider, or other financial institution. 
                In general, refunds may take 5–10 business days or longer depending on the provider.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                7. Payment & Transaction Issues
              </h2>
              <p>
                In cases where a payment is shown as pending, failed, reversed, 
                disputed, or otherwise unresolved by the payment provider, Skilium may 
                wait for the final transaction status before processing a refund or activating 
                the purchased service. Our support team may request transaction details to assist 
                with verification and resolution.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                8. Updates to this Policy
              </h2>
              <p>
                Skilium may revise this Refund Policy periodically to reflect changes in our services, 
                payment processes, or applicable requirements. Any updated version will be published on 
                this page along with the relevant update date.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-2xl font-semibold text-white">
                9. Contact Us
              </h2>
              <p>
                If you have any questions regarding this Privacy Policy, please
                contact us at <strong>info@skilium.in</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicy;