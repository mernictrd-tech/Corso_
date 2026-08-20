// // import { ArrowRight, Sparkles } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import api from "../../services/api";

// // const SuggestedAssessments = () => {
// //   const [programs, setPrograms] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchPrograms();
// //   }, []);

// //   const fetchPrograms = async () => {
// //     try {
// //       const res = await api.get("auth/programs/suggestion");

// //       setPrograms(res.data.data);
// //     } catch (err) {
// //       console.log(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   return (
// //     <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
// //       <div className="flex items-center gap-3">
// //         <div className="rounded-xl bg-violet-500/20 p-3">
// //           <Sparkles className="h-6 w-6 text-violet-400" />
// //         </div>

// //         <h2 className="text-xl font-semibold text-white">
// //           Suggested Assessments
// //         </h2>
// //       </div>

// //       <div className="mt-6 space-y-4 max-h-[220px] overflow-y-auto pr-2">
// //         {programs.map((item) => (
// //           <div
// //             key={item._id}
// //             className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
// //           >
// //             <div className="flex items-center gap-4">
// //               <img
// //                 src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${item.thumbnail}`}
// //                 alt={item.name}
// //                 className="h-16 w-16 rounded-xl object-cover border border-white/10"
// //               />

// //               <div>
// //                 <h3 className="font-semibold text-white">{item.name}</h3>

// //                 <p className="mt-1 text-sm text-gray-400">Start Assessment</p>
// //               </div>
// //             </div>

// //             <ArrowRight
// //               className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
// //               size={22}
// //             />
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SuggestedAssessments;


// import { ArrowRight, Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";
// import api from "../../services/api";

// const SuggestedAssessments = () => {
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   const fetchPrograms = async () => {
//     try {
//       const res = await api.get("auth/programs/suggestion");
//       setPrograms(res.data.data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="shrink-0 rounded-xl bg-violet-500/20 p-2.5 sm:p-3">
//           <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
//         </div>
//         <h2 className="text-base sm:text-xl font-semibold text-white">
//           Suggested Assessments
//         </h2>
//       </div>

//       {/* List */}
//       <div className="mt-4 sm:mt-6 space-y-3 max-h-[240px] overflow-y-auto pr-1">
//         {programs.map((item) => (
//           <div
//             key={item._id}
//             className="group flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
//           >
//             {/* Thumbnail + text */}
//             <div className="flex items-center gap-3 min-w-0">
//               <img
//                 src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${item.thumbnail}`}
//                 alt={item.name}
//                 className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl object-cover border border-white/10"
//               />
//               <div className="min-w-0">
//                 <h3 className="text-sm sm:text-base font-semibold text-white truncate">
//                   {item.name}
//                 </h3>
//                 <p className="mt-0.5 text-xs sm:text-sm text-gray-400">
//                   Start Assessment
//                 </p>
//               </div>
//             </div>

//             {/* Arrow */}
//             <ArrowRight
//               className="shrink-0 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
//               size={20}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SuggestedAssessments;


import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const SuggestedAssessments = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("auth/programs/suggestion");

      setPrograms(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch suggested assessments:", err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl pr-[14px]">  
    {/* Header */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 rounded-xl bg-violet-500/20 p-2.5 sm:p-3">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
        </div>

        <h2 className="text-base sm:text-xl font-semibold text-white">
          Suggested Assessments
        </h2>
      </div>

      {/* List */}
      <div className="mt-4 sm:mt-6 space-y-3 max-h-[240px] overflow-y-auto pr-1">
        {/* Loading */}
        {loading && (
          <div className="py-6 text-center text-sm text-gray-400">
            Loading assessments...
          </div>
        )}

        {/* Empty State */}
        {!loading && programs.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-400">
            No suggested assessments available.
          </div>
        )}

        {/* Programs */}
        {!loading &&
          programs.map((item) => (
            <Link
              key={item._id}
              to={`/course/${item.slug}`}
              className="group flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/10 mr-[10px]"
            >
              {/* Thumbnail + Text */}
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${item.thumbnail}`}
                  alt={item.name}
                  className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover sm:h-14 sm:w-14"
                />

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                    {item.name}
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
                    Start Assessment
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight
                className="shrink-0 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
                size={20}
              />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SuggestedAssessments;