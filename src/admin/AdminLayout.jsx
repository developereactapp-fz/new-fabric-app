import { Outlet } from "react-router-dom";
import { AdminProvider } from "./store/adminStore.jsx";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import "./AdminLayout.css";

/**
 * AdminLayout — Main shell for all admin pages.
 * Provides sidebar navigation, top header, and content area.
 */
export default function AdminLayout() {
  return (
    <AdminProvider>
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <AdminHeader />
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}
