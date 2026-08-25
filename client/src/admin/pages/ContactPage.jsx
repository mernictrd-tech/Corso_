import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Eye, Trash2 } from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import TableComponent from "../components/common/tableComponents/tableComponent";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import ContactViewModal from "../components/contact/ContactViewModal";

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewContact, setViewContact] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/contacts/list");

      setContacts(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);

      setError(
        err.response?.data?.message || "Failed to load contact messages.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Delete Contact
  const handleDelete = async () => {
    if (!deleteContact) return;

    try {
      setDeleteLoading(true);

      const response = await api.delete(
        `/admin/contact/delete/${deleteContact._id}`,
      );

      toast.success(
        response.data?.message || "Contact message deleted successfully.",
      );

      setDeleteContact(null);

      fetchContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);

      toast.error(
        err.response?.data?.message || "Failed to delete contact message.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status Badge
  const statusClass = (status) => {
    switch (status) {
      case "new":
        return "dt-pill-dept-engineering";

      case "read":
        return "dt-pill-dept-sales";

      case "replied":
        return "dt-pill-dept-success";

      default:
        return "dt-pill-dept-sales";
    }
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        priority: 5,
        sortable: true,
        minWidth: 170,
      },

      {
        key: "email",
        label: "Email",
        priority: 4,
        sortable: true,
        minWidth: 220,
      },

      {
        key: "phone",
        label: "Phone",
        priority: 3,
        sortable: true,
        minWidth: 140,

        render: (value) => value || "-",
      },

      {
        key: "subject",
        label: "Subject",
        priority: 4,
        sortable: true,
        minWidth: 220,

        render: (value) => {
          if (!value) return "-";

          return (
            <div className="max-w-[220px] truncate" title={value}>
              {value}
            </div>
          );
        },
      },

      {
        key: "status",
        label: "Status",
        priority: 3,
        sortable: true,
        minWidth: 120,

        render: (value) => (
          <span className={statusClass(value)}>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown"}
          </span>
        ),
      },

      {
        key: "createdAt",
        label: "Submitted",
        priority: 2,
        sortable: true,
        minWidth: 160,

        render: (value) => {
          if (!value) return "-";

          return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        },
      },

      {
        key: "actions",
        label: "Actions",
        priority: 1,
        minWidth: 110,

        render: (_, row) => (
          <div className="flex items-center gap-2">
            {/* View */}
            <button
              onClick={() => setViewContact(row)}
              className="rounded-lg p-2 text-sky-400 transition hover:bg-sky-500/10"
              title="View Message"
            >
              <Eye size={17} />
            </button>

            {/* Delete */}
            <button
              onClick={() => setDeleteContact(row)}
              className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  // Status Filters
  const filters = useMemo(() => {
    const statuses = [
      ...new Set(contacts.map((contact) => contact.status).filter(Boolean)),
    ];

    return [
      {
        key: "status",
        label: "Status",

        options: statuses.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),

          value: status,
        })),
      },
    ];
  }, [contacts]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h1 className="text-[30px] font-bold text-slate-800">
            Contact Messages
          </h1>

          <p className="mt-1 text-slate-500">
            Manage messages submitted through the contact form
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-gray-800 bg-[#10141D] p-10 text-center text-gray-400">
              Loading contact messages...
            </div>
          ) : (
            <TableComponent
              columns={columns}
              data={contacts}
              rowIdKey="_id"
              pageSize={8}
              searchPlaceholder="Search contact messages..."
              defaultSort={{
                key: "createdAt",
                dir: "desc",
              }}
              filters={filters}
              accent="#0EA5E9"
              title="Contact Messages"
              description="View and manage customer enquiries"
            />
          )}
        </div>
      </div>

      {viewContact && (
        <ContactViewModal
          contact={viewContact}
          onClose={() => setViewContact(null)}
          onUpdated={(updatedContact) => {
            setViewContact(updatedContact);

            setContacts((prev) =>
              prev.map((item) =>
                item._id === updatedContact._id ? updatedContact : item,
              ),
            );
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteContact && (
        <DeleteConfirmModal
          title="Delete Contact Message"
          message={`Are you sure you want to delete the message from "${deleteContact.name}"? This action cannot be undone.`}
          loading={deleteLoading}
          onCancel={() => setDeleteContact(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default ContactPage;
