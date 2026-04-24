import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    id: "new-arrivals",
    label: "New Arrivals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    path: "/",
  },
  {
    id: "custom",
    label: "Custom",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.66 3.3l1.82 2.56a4 4 0 002.83 1.65l3.97.44a2 2 0 001.42-.59l1.6-1.6 1.6 1.6a2 2 0 001.42.59l3.97-.44a4 4 0 002.83-1.65l1.82-2.56a2 2 0 00-1.66-3.3z" />
        <path d="M12 13v8" />
        <path d="M8 21h8" />
      </svg>
    ),
    children: [
      { id: "shirt", label: "Shirt", path: "/shirt" },
      { id: "tuxedo-shirt", label: "Tuxedo Shirt", path: "/tuxedo-shirt" },
      { id: "pant", label: "Pant", path: "/pant" },
      { id: "tuxedo-pant", label: "Tuxedo Pant", path: "/tuxedo-pant" },
      { id: "jacket", label: "Jacket", path: "/jacket" },
      { id: "tuxedo-jacket", label: "Tuxedo Jacket", path: "/tuxedo-jacket" },
      { id: "coat", label: "Coat", path: "/coat" },
      { id: "waistcoat", label: "Waistcoat", path: "/waistcoat" },
    ],
  },
  {
    id: "clothing",
    label: "Clothing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.66 3.3l1.82 2.56a4 4 0 002.83 1.65l3.97.44a2 2 0 001.42-.59l1.6-1.6 1.6 1.6a2 2 0 001.42.59l3.97-.44a4 4 0 002.83-1.65l1.82-2.56a2 2 0 00-1.66-3.3z" />
        <path d="M12 13v8" />
        <path d="M8 21h8" />
      </svg>
    ),
    path: "/shirt",
  },
  {
    id: "shoes",
    label: "Shoes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 11 3.8 11 8c0 2.5-.5 4.5-2 6.5" />
        <path d="M4 16a2 2 0 110 4 2 2 0 010-4z" />
        <path d="M20 16v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 2 13 3.8 13 8c0 2.5.5 4.5 2 6.5" />
        <path d="M20 16a2 2 0 110 4 2 2 0 010-4z" />
      </svg>
    ),
    path: "/",
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="6" />
        <path d="M12 14v8" />
        <path d="M9 21h6" />
      </svg>
    ),
    path: "/",
  },
];

const quickLinks = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
    path: "/",
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    path: "/",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    path: "/",
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m-6-9H0m24 0h-6M4.22 4.22l4.24 4.24m7.07 7.07l4.24 4.24M4.22 19.78l4.24-4.24m7.07-7.07l4.24-4.24" />
      </svg>
    ),
    path: "/",
  },
];

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsDrawerOpen(false);
    setExpandedMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const toggleMenu = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className="global-header">
        <div className="header-container">
          <button
            className="hamburger-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link to="/" className="header-logo">
            <span className="logo-text">The Lev Labs</span>
          </Link>

          <div className="header-actions">
            <button className="header-icon-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button className="header-icon-btn" aria-label="Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="header-icon-btn" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 2v2m6-2v2M4 6h16l1.5 14H2.5L4 6z" />
                <path d="M9 11v6m6-6v6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      )}

      <aside
        ref={drawerRef}
        className={`drawer ${isDrawerOpen ? "drawer-open" : ""}`}
      >
        <div className="drawer-header">
          <div className="drawer-brand">
            <h1 className="drawer-title">THE LEV LABS</h1>
            <p className="drawer-subtitle">Premium Suit Customization</p>
          </div>
          <button
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="drawer-content">
          <div className="drawer-search">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="drawer-search-input"
              />
            </div>
          </div>

          <nav className="drawer-menu">
            {menuItems.map((item) => (
              <div key={item.id} className="drawer-menu-item">
                {item.children ? (
                  <>
                    <button
                      className={`drawer-menu-btn ${expandedMenu === item.id ? "expanded" : ""}`}
                      onClick={() => toggleMenu(item.id)}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-label">{item.label}</span>
                      <svg
                        className="expand-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                    {expandedMenu === item.id && (
                      <div className="submenu">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            className="submenu-item"
                            onClick={() => handleNavigate(child.path)}
                          >
                            <span className="submenu-label">{child.label}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    className="drawer-menu-btn"
                    onClick={() => handleNavigate(item.path)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </nav>

          <div className="drawer-quick-links">
            <p className="quick-links-title">QUICK LINKS</p>
            <div className="quick-links-grid">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  className="quick-link-btn"
                  onClick={() => handleNavigate(link.path)}
                >
                  <span className="quick-link-icon">{link.icon}</span>
                  <span className="quick-link-label">{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="drawer-footer">
            <p className="footer-copyright">© 2026 The Lev Labs</p>
            <p className="footer-tagline">Premium Suit Customization</p>
          </div>
        </div>
      </aside>
    </>
  );
}
