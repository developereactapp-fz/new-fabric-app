import { Link } from "react-router-dom";
import { useAdmin } from "../store/adminStore.jsx";

const quickLinks = [
  { path: "/admin/fabric-configurator", label: "Fabric Configurator", desc: "Manage master fabric attributes", color: "#6366f1" },
  { path: "/admin/category-configurator", label: "Category & Components", desc: "Create categories and components", color: "#8b5cf6" },
  { path: "/admin/fabric-onboarding", label: "Fabric Onboarding", desc: "Create and import fabrics", color: "#06b6d4" },
  { path: "/admin/materials-panel", label: "Materials Panel", desc: "View all fabric cards", color: "#10b981" },
  { path: "/admin/category-components", label: "Category Components", desc: "Map components to fabrics", color: "#f59e0b" },
  { path: "/admin/custom-shirt", label: "Custom Shirt Form", desc: "Shirt-specific mappings", color: "#ef4444" },
];

export default function AdminDashboard() {
  const { state } = useAdmin();

  const stats = [
    { label: "Categories", value: state.categories.length },
    { label: "Fabrics", value: state.fabrics.length },
    { label: "Fabric Groups", value: state.fabricGroups.length },
    { label: "Mappings", value: state.fabricMappings.length },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Fabric Configuration System — Overview</p>
        </div>
      </div>

      <div className="admin-grid-4" style={{ marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <span className="admin-stat-value">{s.value}</span>
            <span className="admin-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Quick Access</h3>
            <p className="admin-card-subtitle">Jump to any module</p>
          </div>
        </div>
        <div className="admin-grid-3">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "16px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                transition: "all 0.2s",
                background: "#fff",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.boxShadow = `0 2px 12px ${link.color}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: link.color }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{link.label}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
