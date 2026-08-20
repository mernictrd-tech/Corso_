import { Calendar, Mail, Pencil, LogOut } from "lucide-react";

const ProfileCard = ({ profile, onEdit, onLogout }) => {
  const studentSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-6 shadow-xl">

      {/* Profile Header */}
      <div className="flex items-start justify-between gap-3">

        {/* Avatar + Name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-xl sm:text-2xl font-bold text-black shadow-lg shadow-cyan-500/20">
            {profile?.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${profile.avatar}`}
                alt={profile?.fullName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              profile?.fullName?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          {/* Name */}
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-semibold text-white truncate">
              {profile?.fullName || "User"}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-cyan-400">Student</p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 flex items-center gap-1.5 rounded-lg border border-gray-700 px-2.5 py-2 sm:px-3 text-xs sm:text-sm font-medium text-gray-300 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <Pencil size={13} />
          Edit
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 sm:my-6 h-px bg-gray-800" />

      {/* Profile Details */}
      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
            <Mail size={16} className="text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Email</p>
            <p className="truncate text-xs sm:text-sm text-gray-300">
              {profile?.email || "—"}
            </p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
            <Calendar size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Student since</p>
            <p className="text-xs sm:text-sm text-gray-300">{studentSince}</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 sm:mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-300 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
      >
        <LogOut size={15} />
        Logout
      </button>
    </div>
  );
};

export default ProfileCard;