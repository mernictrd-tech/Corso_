import {
  Calendar,
  Mail,
  Pencil,
} from "lucide-react";

const ProfileCard = ({ profile }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      {/* Header */}

      <div className="flex items-start gap-3">

        {/* Avatar */}

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-black">
          {profile.name.charAt(0)}
        </div>

        {/* Name & Edit */}

        <div className="flex flex-1 items-start justify-between">

          <div>

            <h2 className="text-xl font-semibold text-white">
              {profile.name}
            </h2>

            <p className="text-gray-400">
              Member
            </p>

          </div>

          <button
            onClick={() => console.log("Edit Profile")}
            className="flex items-center gap-2 rounded-lg border border-cyan-500 px-3 py-2 text-sm font-medium text-cyan-400 transition-all duration-300 hover:bg-cyan-500 hover:text-black"
          >
            <Pencil size={16} />
            Edit
          </button>

        </div>

      </div>

      {/* Details */}

      <div className="mt-6 space-y-4">

        <div className="flex items-center gap-3">

          <Mail
            size={18}
            className="text-cyan-400"
          />

          <span className="text-gray-300">
            {profile.email}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Calendar
            size={18}
            className="text-cyan-400"
          />

          <span className="text-gray-300">
            Joined {profile.joined}
          </span>

        </div>

      </div>

    </div>
  );
};

export default ProfileCard;