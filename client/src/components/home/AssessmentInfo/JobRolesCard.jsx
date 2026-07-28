import RoleCard from "./RoleCard";
import { audience, jobRoles } from "./data";

const JobRolesCard = () => {
  return (
    <div className="rounded-[34px] border border-white/10 bg-[#111527] p-8">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-1xl font-bold text-white">
            Eligible Job Roles
          </h3>

          <p className="mt-2 text-gray-400">
            Roles this certificate supports
          </p>

        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300">
          Dynamic
        </span>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-5">

        {jobRoles.map((item) => (
          <RoleCard key={item.title} {...item} />
        ))}

      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">

        <h4 className="text-1xl font-semibold text-white">
          Bonus: perfect for
        </h4>

        <div className="mt-4 flex flex-wrap gap-3">

          {audience.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[#2a3042] px-2 py-2 text-sm text-gray-200"
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