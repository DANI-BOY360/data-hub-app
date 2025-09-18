import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  DollarSign,
  Menu,
  Wallet,
} from "lucide-react";
import "../../styles/Dashboard.css";

const Dashboard = ({ onMenuClick, userData, walletBalance, onPageChange }) => {
  const user = userData || { name: "Kobe" };
  const balance = walletBalance || 0.0;
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({
    totalSales: 0.0,
    totalOrders: 0,
  });

  // Function to get current greeting based on time
  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // Set greeting when component mounts and update every minute
  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
    };

    // Set initial greeting
    updateGreeting();

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleLoadWallet = () => {
    onPageChange("topup");
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button onClick={onMenuClick} className="menu-button">
            <Menu size={24} />
          </button>
          <div>
            <span className="breadcrumb">Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Dashboard</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Date Selector */}
        <div className="date-selector">
          <div className="date-selector-button">
            <span className="date-selector-text">Today</span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-content">
            <h2 className="balance-greeting">
              {greeting}, {user.name}!
            </h2>
            <p className="balance-subtitle">Your current balance is</p>
            <div className="balance-amount">GH₵ {balance.toFixed(2)}</div>
            <button onClick={handleLoadWallet} className="load-wallet-button">
              Load Wallet
            </button>
          </div>
          <div className="balance-icon-container">
            <div className="balance-icon-circle">
              <Wallet size={40} color="rgba(255, 255, 255, 0.6)" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">TOTAL SALES</span>
              <div className="stat-icon stat-icon-red">
                <ShoppingBag size={16} />
              </div>
            </div>
            <div className="stat-value">GH₵ {stats.totalSales.toFixed(2)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">TOTAL ORDERS</span>
              <div className="stat-icon stat-icon-red">
                <ShoppingCart size={16} />
              </div>
            </div>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
        </div>

        {/* Bottom Stats */}
      </main>
    </div>
  );
};

export default Dashboard;
