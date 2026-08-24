import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  User,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";

const ContactViewModal = ({ contact, onClose, onUpdated }) => {
  const [status, setStatus] = useState(contact?.status || "new");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (contact) {
      setStatus(contact.status || "new");
    }
  }, [contact]);

  if (!contact) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);

      const response = await api.patch(
        `/admin/contacts/${contact._id}/status`,
        {
          status: newStatus,
        }
      );

      setStatus(newStatus);

      toast.success(
        response.data?.message ||
          "Contact status updated successfully."
      );

      if (onUpdated) {
        onUpdated({
          ...contact,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error(
        "Failed to update contact status:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update contact status."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Contact Message
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View customer enquiry details
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {/* Basic Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<User size={17} />}
              label="Name"
              value={contact.name}
            />

            <InfoItem
              icon={<Mail size={17} />}
              label="Email"
              value={contact.email}
            />

            <InfoItem
              icon={<Phone size={17} />}
              label="Phone"
              value={contact.phone || "-"}
            />

            <InfoItem
              icon={<CalendarDays size={17} />}
              label="Submitted"
              value={formatDate(contact.createdAt)}
            />
          </div>

          {/* Subject */}
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare
                size={17}
                className="text-sky-500"
              />

              Subject
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
              {contact.subject || "-"}
            </div>
          </div>

          {/* Message */}
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquare
                size={17}
                className="text-sky-500"
              />

              Message
            </div>

            <div className="min-h-[140px] whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              {contact.message || "-"}
            </div>
          </div>

          {/* Status */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              value={status}
              disabled={updating}
              onChange={(e) =>
                handleStatusChange(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            {updating && (
              <p className="mt-2 text-xs text-slate-400">
                Updating status...
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span className="text-sky-500">{icon}</span>
        {label}
      </div>

      <p className="break-all text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
};

export default ContactViewModal;