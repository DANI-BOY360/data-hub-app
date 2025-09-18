import React, { useState } from "react";
import Dashboard from "./components/dashboard/Dashboard";
import Sidebar from "./components/common/Sidebar";
import MTNPage from "./components/MTN/MTNPage";
import TelecelPage from "./components/Telecel/TELECELPage";
import ATBigTimePage from "./components/AT/ATBIGTIMEPage";
import TopUp from "./components/TopUP/TopUP";
import OrderHistoryPage from "./components/Order/OrderHistoryPage";
import AuthPage from "./components/auth/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// Main App Component (wrapped by AuthProvider)
function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userWallet, setUserWallet] = useState(50.0); // You might want to fetch this from your backend

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCurrentPage("dashboard");
      setSidebarOpen(false);
      setUserWallet(0);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, show auth page
  if (!user) {
    return <AuthPage />;
  }

  // If authenticated, show requested page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "mtn":
        return (
          <MTNPage
            onBack={() => setCurrentPage("dashboard")}
            userWallet={userWallet}
            onBalanceUpdate={setUserWallet}
          />
        );

      // case "social-booster":
      //   return (
      //     <SocialMediaBoosterPage onBack={() => setCurrentPage("dashboard")} />
      //   );
      case "at-bigtime":
        return (
          <ATBigTimePage
            onBack={() => setCurrentPage("dashboard")}
            userWallet={userWallet}
            onBalanceUpdate={setUserWallet}
          />
        );
      case "topup":
        return (
          <TopUp
            onBack={() => setCurrentPage("dashboard")}
            userWallet={userWallet}
            onBalanceUpdate={setUserWallet}
          />
        );
      case "history":
        return <OrderHistoryPage onBack={() => setCurrentPage("dashboard")} />;
      case "telecel":
        return (
          <TelecelPage
            onBack={() => setCurrentPage("dashboard")}
            userWallet={userWallet}
            onBalanceUpdate={setUserWallet}
          />
        );
      case "dashboard":
      default:
        return (
          <Dashboard
            onMenuClick={() => setSidebarOpen(true)}
            userData={user}
            walletBalance={userWallet}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPageChange={handlePageChange}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

// Main App with AuthProvider wrapper
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
