import React from 'react';
import { IconPhone, IconLocation, IconDepartment } from '../common/tableComponents/tableIcons.jsx';

const AVATAR_COLORS = ['#7C5CFC', '#22C1A6', '#E879C1', '#3B82F6', '#F6B94F', '#FB7185'];

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export const getAvatarColor = (name = '') => {
  return AVATAR_COLORS[name.length % AVATAR_COLORS.length];
};

export const getDeptPillClass = (dept) => {
  const map = {
    Marketing: 'dt-pill-dept-marketing',
    Engineering: 'dt-pill-dept-engineering',
    Sales: 'dt-pill-dept-sales',
  };
  return map[dept] || 'dt-pill-dept-marketing';
};

export const DEFAULT_ROWS = [
  { id: 1, name: 'Alexander Lee', email: 'alexander.lee@company.com', phone: '+1 (555) 345-0123', role: 'Editor', department: 'Engineering', status: 'Inactive', location: 'San Diego, CA', joined: '2024-07-25', lastActive: '2026-06-15', projects: 6, projectsTarget: 10, storage: '2.4 GB' },
  { id: 2, name: 'Amelia Foster', email: 'amelia.foster@company.com', phone: '+1 (555) 678-3456', role: 'Editor', department: 'Marketing', status: 'Active', location: 'Atlanta, GA', joined: '2024-09-15', lastActive: '2026-08-04', projects: 10, projectsTarget: 10, storage: '3.9 GB' },
  { id: 3, name: 'Ava Robinson', email: 'ava.robinson@company.com', phone: '+1 (555) 890-5678', role: 'Editor', department: 'Marketing', status: 'Active', location: 'Los Angeles, CA', joined: '2024-05-02', lastActive: '2026-08-02', projects: 7, projectsTarget: 10, storage: '2.1 GB' },
  { id: 4, name: 'Charlotte Davis', email: 'charlotte.davis@company.com', phone: '+1 (555) 456-1234', role: 'Admin', department: 'Operations', status: 'Active', location: 'Phoenix, AZ', joined: '2024-08-11', lastActive: '2026-08-04', projects: 11, projectsTarget: 10, storage: '5.0 GB' },
  { id: 5, name: 'Emma Wilson', email: 'emma.wilson@company.com', phone: '+1 (555) 678-3456', role: 'Admin', department: 'Operations', status: 'Active', location: 'Chicago, IL', joined: '2024-04-05', lastActive: '2026-08-04', projects: 9, projectsTarget: 10, storage: '3.5 GB' },
  { id: 6, name: 'Ethan Kim', email: 'ethan.kim@company.com', phone: '+1 (555) 901-6789', role: 'Viewer', department: 'Support', status: 'Active', location: 'Portland, OR', joined: '2024-05-14', lastActive: '2026-08-01', projects: 4, projectsTarget: 10, storage: '1.3 GB' },
];

export const DEFAULT_COLUMNS = [
  {
    key: 'name',
    label: 'User',
    priority: 1,
    sortable: true,
    minWidth: 200,
    render: (v, row) => (
      <div className="dt-user">
        <div className="dt-avatar" style={{ background: getAvatarColor(v) }}>
          {getInitials(v)}
        </div>
        <div>
          <div className="dt-user-name">{v}</div>
          <div className="dt-user-email">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'phone',
    label: 'Phone',
    priority: 7,
    sortable: false,
    minWidth: 175,
    icon: 'phone',
    render: (v) => (
      <span className="dt-inline-icon">
        <IconPhone />
        {v}
      </span>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    priority: 2,
    sortable: true,
    minWidth: 90,
    render: (v) => <span className="dt-pill dt-pill-role">{v}</span>,
  },
  {
    key: 'department',
    label: 'Department',
    priority: 4,
    sortable: true,
    minWidth: 120,
    icon: 'department',
    render: (v) => <span className={`dt-pill ${getDeptPillClass(v)}`}>{v}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    priority: 3,
    sortable: true,
    minWidth: 100,
    render: (v) => (
      <span className={`dt-status ${String(v).toLowerCase()}`}>
        <span className="dt-status-dot"></span>
        {v}
      </span>
    ),
  },
  {
    key: 'projects',
    label: 'Projects',
    priority: 5,
    sortable: true,
    minWidth: 130,
    icon: 'folder',
    render: (v, row) => {
      const current = row.projects || 0;
      const target = row.projectsTarget || 20;
      return (
        <div>
          <span style={{ fontWeight: 500 }}>{current}</span>
          <div className="dt-progress">
            <div className="dt-progress-track">
              <div
                className="dt-progress-fill"
                style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: 'storage',
    label: 'Storage',
    priority: 6,
    sortable: true,
    minWidth: 100,
    icon: 'storage',
    render: (v, row) => row.storage || row.storageUsed || '—',
  },
  {
    key: 'location',
    label: 'Location',
    priority: 8,
    sortable: true,
    minWidth: 140,
    icon: 'location',
    render: (v) => (
      <span className="dt-inline-icon">
        <IconLocation />
        {v}
      </span>
    ),
  },
  {
    key: 'joined',
    label: 'Joined',
    priority: 9,
    sortable: true,
    minWidth: 100,
    render: (v, row) => v || row.joinDate,
  },
  {
    key: 'lastActive',
    label: 'Last active',
    priority: 10,
    sortable: true,
    minWidth: 100,
    icon: 'clock',
  },
];
