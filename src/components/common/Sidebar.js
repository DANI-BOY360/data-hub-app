import React from "react";
import {
  LayoutDashboard,
  Zap,
  Database,
  Smartphone,
  CreditCard,
  History,
  HelpCircle,
  User,
  TrendingUp,
  X,
} from "lucide-react";
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, onPageChange, onSignOut }) => {
  const services = [
    { icon: Zap, label: "MTN Bundles", page: "mtn" },
    { icon: Database, label: "AT BIG TIME Bundles", page: "at-bigtime" },
    { icon: Smartphone, label: "TELECEL Bundles", page: "telecel" },
  ];

  const menuItems = [
    { icon: CreditCard, label: "Top up wallet", isGreen: true, page: "topup" },
    { icon: History, label: "Order history", page: "history" },
  ];

  const support = [
    { icon: HelpCircle, label: "Help & Support", page: "help" },
    { icon: User, label: "Profile", page: "profile" },
  ];

  const extras = [
    { icon: TrendingUp, label: "Social Media Booster", page: "social-booster" },
  ];

  const handleItemClick = (item) => {
    if (item.page) {
      onPageChange(item.page);
    } else {
      alert(`${item.label} clicked - will implement functionality later`);
    }
  };

  const handleSignOut = async () => {
    try {
      // Close sidebar first
      onClose();

      // Call the sign out function passed from parent
      if (onSignOut) {
        await onSignOut();
      }
    } catch (error) {
      console.error("Sign out error:", error);
      alert("There was an error signing out. Please try again.");
    }
  };

  return (
    <div className={`sidebar-overlay ${isOpen ? "visible" : "invisible"}`}>
      {/* Backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? "open" : "closed"}`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar-panel ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-logo">
                <Database size={20} />
              </div>
              <span className="sidebar-title">Emapok Data Hub</span>
            </div>
            <button onClick={onClose} className="close-button">
              <X size={20} />
            </button>
          </div>

          {/* Dashboard */}
          <div className="dashboard-item">
            <div
              className="dashboard-link"
              onClick={() => onPageChange("dashboard")}
            >
              <LayoutDashboard size={20} className="dashboard-icon" />
              <span className="dashboard-text">Dashboard</span>
            </div>
          </div>

          {/* Services */}
          <div className="sidebar-section">
            <h3 className="section-title">Services</h3>
            <div className="menu-items">
              {services.map((item, index) => (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon
                    size={20}
                    className={`menu-icon ${item.isGreen ? "green" : ""}`}
                  />
                  <span className="menu-text">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="sidebar-section">
            <div className="menu-items">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon
                    size={20}
                    className={`menu-icon ${item.isGreen ? "green" : ""}`}
                  />
                  <span className="menu-text">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="sidebar-section">
            <h3 className="section-title">Support</h3>
            <div className="menu-items">
              {support.map((item, index) => (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon size={20} className="menu-icon" />
                  <span className="menu-text">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="sidebar-section">
            <h3 className="section-title">Extras</h3>
            <div className="menu-items">
              {extras.map((item, index) => (
                <div
                  key={index}
                  className="menu-item"
                  onClick={() => handleItemClick(item)}
                >
                  <item.icon size={20} className="menu-icon" />
                  <span className="menu-text">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="sign-out-section">
            <button onClick={handleSignOut} className="sign-out-button">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="sign-out-text">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
