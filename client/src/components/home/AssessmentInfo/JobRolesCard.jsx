import RoleCard from "./RoleCard";
import { audience, jobRoles } from "./data";

const JobRolesCard = () => {
  return (
    <div className="rounded-[34px] border border-white/10 bg-[#111527] p-5 sm:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h3 className="text-xl font-bold text-white">
            Eligible Job Roles
          </h3>

          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Roles this certificate supports
          </p>
        </div>

      </div>

      {/* Job Roles */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

        {jobRoles.map((item) => (
          <RoleCard key={item.title} {...item} />
        ))}

      </div>

      {/* Bonus */}
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">

        <h4 className="text-lg font-semibold text-white">
          Bonus: perfect for
        </h4>

        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">

          {audience.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#2a3042] px-3 py-2 text-xs text-gray-200 sm:text-sm"
            >
              {item}
            </span>
          ))}

        </div>

      </div>

    </div>
  );
};

export default JobRolesCard;