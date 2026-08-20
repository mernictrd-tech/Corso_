// import { Award, Download, Eye } from "lucide-react";

// const CertificateCard = ({ certificate }) => {
//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

//       <div className="flex items-center gap-3">

//         <div className="rounded-xl bg-cyan-500/20 p-3">
//           <Award className="h-6 w-6 text-cyan-400" />
//         </div>

//         <h2 className="text-xl font-semibold text-white">
//           My Certificate
//         </h2>

//       </div>

//       <div className="mt-6 space-y-3">

//         <div>
//           <p className="text-gray-400 text-sm">
//             Assessment
//           </p>

//           <h3 className="text-lg font-semibold text-white">
//             {certificate.title}
//           </h3>
//         </div>

//         <div className="flex justify-between">

//           <div>

//             <p className="text-gray-400 text-sm">
//               Score
//             </p>

//             <p className="font-semibold text-white">
//               {certificate.score}
//             </p>

//           </div>

//           <div>

//             <p className="text-gray-400 text-sm">
//               Issued On
//             </p>

//             <p className="font-semibold text-white">
//               {certificate.issuedOn}
//             </p>

//           </div>

//         </div>

//       </div>

//       <div className="mt-6 flex gap-3">

//         <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-400 py-2 text-cyan-400 transition hover:bg-cyan-400 hover:text-black">

//           <Eye size={18} />

//           View

//         </button>

//         <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2 font-semibold text-black transition hover:scale-105">

//           <Download size={18} />

//           Download

//         </button>

//       </div>

//     </div>
//   );
// };

// export default CertificateCard;

import { Award, Download, Eye } from "lucide-react";

const CertificateCard = ({ certificate, onViewCertificate }) => {
  const handleOpenCertificate = () => {
    onViewCertificate?.(certificate);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-cyan-500/20 p-3">
          <Award className="h-6 w-6 text-cyan-400" />
        </div>

        <h2 className="text-xl font-semibold text-white">
          My Certificate
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <p className="text-gray-400 text-sm">
            Assessment
          </p>

          <h3 className="text-lg font-semibold text-white">
            {certificate?.title || certificate?.program?.name || "React.js"}
          </h3>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-gray-400 text-sm">
              Score
            </p>

            <p className="font-semibold text-white">
              {certificate?.score}%
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-sm">
              Issued On
            </p>

            <p className="font-semibold text-white">
              {certificate?.issuedOn || "29 Jul 2026"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleOpenCertificate}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-400 py-2 text-cyan-400 transition hover:bg-cyan-400 hover:text-black cursor-pointer"
        >
          <Eye size={18} />
          View
        </button>

        <button
          onClick={handleOpenCertificate}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-2 font-semibold text-black transition hover:scale-105 cursor-pointer"
        >
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
