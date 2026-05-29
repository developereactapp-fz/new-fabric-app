/**
 * FormGroup — Label + input wrapper with optional helper text and required indicator.
 *
 * Usage:
 *   <FormGroup label="Group Name" required helperText="Enter a unique name">
 *     <input className="admin-input" value={name} onChange={...} />
 *   </FormGroup>
 */
export default function FormGroup({ label, required = false, helperText, children, className = "" }) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="admin-label">
          {label}
          {required && " *"}
        </label>
      )}
      {helperText && <p className="admin-helper">{helperText}</p>}
      {children}
    </div>
  );
}
