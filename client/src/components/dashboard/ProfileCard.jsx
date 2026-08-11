import {
  Calendar,
  Mail,
  Pencil,
  LogOut,
} from "lucide-react";

const ProfileCard = ({
  profile,
  onEdit,
  onLogout,
}) => {
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "—";

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-2xl font-bold text-black shadow-lg shadow-cyan-500/20">
            {profile?.avatar ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL_RESOURCE}${profile.avatar}`}
                alt={profile?.fullName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              profile?.fullName
                ?.charAt(0)
                ?.toUpperCase() || "U"
            )}
          </div>

          {/* Name */}
          <div>
            <h2 className="text-xl font-semibold text-white">
              {profile?.fullName || "User"}
            </h2>

            <p className="mt-1 text-sm text-cyan-400">
              Member
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-800" />

      {/* Profile Details */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
            <Mail
              size={18}
              className="text-cyan-400"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-500">
              Email
            </p>

            <p className="truncate text-sm text-gray-300">
              {profile?.email || "—"}
            </p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
            <Calendar
              size={18}
              className="text-cyan-400"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Member since
            </p>

            <p className="text-sm text-gray-300">
              {memberSince}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
      >
        <LogOut size={17} />
        Logout
      </button>
    </div>
  );
};

export default ProfileCard;