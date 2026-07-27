import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  name,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-300">
    {label}
  </label>

  <div className="relative">
    {Icon && (
      <Icon
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    )}

    <input
      name={name}
      type={
        isPassword
          ? showPassword
            ? "text"
            : "password"
          : type
      }
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-[15px] text-white placeholder:text-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 ${
        Icon ? "pl-10 pr-10" : "px-4"
      }`}
    />

    {isPassword && (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {showPassword ? (
          <EyeOff size={17} />
        ) : (
          <Eye size={17} />
        )}
      </button>
    )}
  </div>
</div>
  );
};

export default InputField;