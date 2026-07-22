import VerifyForm from "./VerifyForm";
import Container from "../../layout/Container";

const VerifyCertificate = () => {
  return (
    <section id="verify-certificate" className="bg-[#070B1A] py-28">

      <Container>

        <div className="rounded-[34px] border border-white/10 bg-[#171B2D] px-14 py-14">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">

            {/* Left */}

            <div>

              <h2 className="text-5xl font-bold text-white">
                Verify a certificate
              </h2>

              <p className="mt-5 text-[20px] leading-8 text-gray-300">
                Recruiter or student? Enter certificate ID to verify
                authenticity.
              </p>

              <p className="mt-4 text-[15px] text-gray-500">
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