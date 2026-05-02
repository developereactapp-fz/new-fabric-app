/**
 * PageHeader — Standardized admin page header with title, subtitle, and optional right-side actions.
 *
 * Usage:
 *   <PageHeader title="Fabric Detail" subtitle="View details and mappings">
 *     <button className="admin-btn primary">Action</button>
 *   </PageHeader>
 */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="admin-page-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="admin-page-header-actions">{children}</div>}
    </div>
  );
}
