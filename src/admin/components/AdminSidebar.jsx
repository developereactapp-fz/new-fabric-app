import { NavLink } from "react-router-dom";
import { useState } from "react";

const navGroups = [
  {
    label: "Foundation",
    items: [
      {
        path: "/admin/fabric-configurator",
        label: "Fabric Configurator",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        path: "/admin/category-configurator",
        label: "Category & Components",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },

    ],
  },
  {
    label: "Fabric Management",
    items: [
      {
        path: "/admin/fabric-onboarding",
        label: "Fabric Onboarding",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        ),
      },
      {
        path: "/admin/materials-panel",
        label: "Materials Panel",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 3v18" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Mapping",
    items: [
      {
        path: "/admin/category-components",
        label: "Category-wise Components",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
        ),
      },
      {
        path: "/admin/custom-shirt",
        label: "Custom Shirt Form",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.66 3.3l1.82 2.56a4 4 0 002.83 1.65l3.97.44a2 2 0 001.42-.59l1.6-1.6 1.6 1.6a2 2 0 001.42.59l3.97-.44a4 4 0 002.83-1.65l1.82-2.56a2 2 0 00-1.66-3.3z" />
            <path d="M12 13v8" />
            <path d="M8 21h8" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Detail & Control",
    items: [
      {
        path: "/admin/fabric-detail",
        label: "Fabric Detail",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        ),
      },
      {
        path: "/admin/component-active",
        label: "Component Active",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18.36 6.64a9 9 0 11-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        ),
      },
      {
        path: "/admin/components-panel",
        label: "Components Panel",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Advanced",
    items: [
      {
        path: "/admin/group-builder",
        label: "Group Builder",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        path: "/admin/contrast-mapper",
        label: "Contrast Mapper",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 000 20" fill="currentColor" opacity="0.15" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="admin-sidebar-brand">
        {!collapsed && (
          <>
            <h2 className="admin-sidebar-logo">THE LEV LABS</h2>
            <p className="admin-sidebar-tagline">Fabric Admin</p>
          </>
        )}
        <button
          className="admin-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? (
              <path d="M9 18l6-6-6-6" />
            ) : (
              <path d="M15 18l-6-6 6-6" />
            )}
          </svg>
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label} className="admin-nav-group">
            {!collapsed && <span className="admin-nav-group-label">{group.label}</span>}
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? "active" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {!collapsed && <span className="admin-nav-label">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        {!collapsed && (
          <>
            <p className="admin-sidebar-copyright">© 2026 The Lev Labs</p>
            <p className="admin-sidebar-version">v1.0.0</p>
          </>
        )}
      </div>
    </aside>
  );
}
