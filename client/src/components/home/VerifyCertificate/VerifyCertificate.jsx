import VerifyForm from "./VerifyForm";
import Container from "../../layout/Container";

const VerifyCertificate = () => {
  return (
    <section
      id="verify-certificate"
      className="bg-[#070B1A] py-16 sm:py-20 lg:py-28"
    >
      <Container>

        <div className="rounded-[28px] border border-white/10 bg-[#171B2D] px-5 py-8 sm:rounded-[34px] sm:px-8 sm:py-10 lg:px-14 lg:py-14">

          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12">

            {/* Left */}
            <div>

              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Verify a certificate
              </h2>

              <p className="mt-4 text-base leading-6 text-gray-300 sm:mt-5 sm:text-[18px] sm:leading-8">
                Employers and learners can instantly verify any Skilium
                certificate using its unique certificate ID.
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-[15px]">
                Verification results should show:
                <span className="text-gray-400">
                  {" "}
                  course, name, date, score status, and unique ID.
                </span>
              </p>

            </div>

            {/* Right */}
            <VerifyForm />

          </div>

        </div>

      </Container>
    </section>
  );
};

export default VerifyCertificate;