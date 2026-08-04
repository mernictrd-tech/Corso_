import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import CertificateItem from "./CertificateItem";

const CertificatesSection = ({ certificates }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCertificates = useMemo(() => {
    return certificates.filter((certificate) => {
      const value = searchTerm.toLowerCase();

      return (
        certificate.title.toLowerCase().includes(value) ||
        certificate.certificateId.toLowerCase().includes(value)
      );
    });
  }, [certificates, searchTerm]);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#141A2A] p-8">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-[20px] font-bold text-white">
            My Certificates
          </h2>

          <p className="mt-2 text-gray-400">
            You have earned{" "}
            <span className="font-semibold text-cyan-400">
              {filteredCertificates.length}
            </span>{" "}
            certificate
            {filteredCertificates.length !== 1 && "s"}.
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#1A2032] py-3 pl-11 pr-4 text-white outline-none transition focus:border-cyan-500 sm:w-72"
            />

          </div>

          {/* Filter Button */}

          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#1A2032] px-5 py-3 text-gray-300 transition hover:border-cyan-500 hover:text-cyan-400">

            <Filter size={18} />

            Filter

          </button>

        </div>

      </div>

      {/* Divider */}

      <div className="my-8 border-t border-white/10" />

      {/* Certificate List */}

      <div className="space-y-5">

        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((certificate) => (
            <CertificateItem
              key={certificate.id}
              certificate={certificate}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">

            <h3 className="text-xl font-semibold text-white">
              No Certificates Found
            </h3>

            <p className="mt-2 text-gray-400">
              Try searching with another course name.
            </p>

          </div>
        )}

      </div>

    </section>
  );
};

export default CertificatesSection;