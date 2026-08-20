import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  IndianRupee,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import AdminLayout from "../components/layout/AdminLayout";
import api from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalStudents: 0,
    totalSuccessPayment: 0,
    todayCollection: 0,
    yesterdayCollection: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/dashboard/widgets");

      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const cards = [
    {
      title: "Total Programs",
      value: stats.totalPrograms,
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      circle: "bg-blue-100",
      line: "bg-blue-500",
    },
    {
      title: "Students",
      value: stats.totalStudents,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      circle: "bg-green-100",
      line: "bg-green-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalSuccessPayment}`,
      icon: IndianRupee,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      circle: "bg-orange-100",
      line: "bg-orange-500",
    },
    {
      title: "Today's Collection",
      value: `₹${stats.todayCollection}`,
      icon: CalendarDays,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      circle: "bg-purple-100",
      line: "bg-purple-500",
    },
    {
      title: "Yesterday's Collection",
      value: `₹${stats.yesterdayCollection}`,
      icon: TrendingUp,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      circle: "bg-cyan-100",
      line: "bg-cyan-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back, Admin 👋
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="relative h-44 overflow-hidden rounded-2xl bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Decorative Circle */}
              <div
                className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-60 ${card.circle}`}
              />

              {/* Icon */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon
                  size={22}
                  className={card.iconColor}
                />
              </div>

              {/* Title */}
              <h3 className="mt-5 text-lg font-medium text-slate-600">
                {card.title}
              </h3>

              {/* Value */}
              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : card.value}
              </h2>

              {/* Bottom Line */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-full ${card.line}`}
              />
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;