import {
  Calendar,
  Mail,
  User,
} from "lucide-react";

const ProfileCard = ({ profile }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-black">

          {profile.name.charAt(0)}

        </div>

        <div>

          <h2 className="font-semibold text-white">
            {profile.name}
          </h2>

          <p className="text-gray-400">
            Member
          </p>

        </div>

      </div>

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