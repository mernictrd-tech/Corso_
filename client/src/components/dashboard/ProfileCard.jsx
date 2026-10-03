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
    <div className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900 p-4 shadow-xl sm:p-5 lg:p-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + Name */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-lg font-bold text-black shadow-lg shadow-cyan-500/20 sm:h-14 sm:w-14 sm:text-xl lg:h-16 lg:w-16 lg:text-2xl">
            {profile?.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${profile.avatar}`}
                onError={(e) => {
                  e.currentTarget.src = "/assets/no-img.jpg";
                }}
                alt={profile?.fullName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              profile?.fullName?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          {/* Name */}
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white sm:text-lg lg:text-xl">
              {profile?.fullName || "User"}
            </h2>
            <p className="mt-0.5 text-xs text-cyan-400 sm:mt-1 sm:text-sm">
              Student
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit profile"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 sm:px-3 sm:py-2 sm:text-sm"
        >
          <Pencil size={13} />
          <span className="hidden xs:inline sm:inline">Edit</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-800 sm:my-5 lg:my-6" />

      {/* Profile Details */}
      <div className="space-y-3">
        {/* Email */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-2.5 sm:p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 sm:h-9 sm:w-9">
            <Mail size={16} className="text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Email</p>
            <p className="truncate text-xs text-gray-300 sm:text-sm">
              {profile?.email || "—"}
            </p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950/50 p-2.5 sm:p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 sm:h-9 sm:w-9">
            <Calendar size={16} className="text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Student since</p>
            <p className="truncate text-xs text-gray-300 sm:text-sm">
              {studentSince}
            </p>
          </div>
        </div>
      </div>

      {/* Logout (pushed to bottom when card is taller than content) */}
      <button
        type="button"
        onClick={onLogout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 sm:mt-5 sm:py-3 sm:text-sm lg:mt-auto lg:pt-3"
      >
        <LogOut size={15} />
        Logout
      </button>
    </div>
  );
};

export default ProfileCard;