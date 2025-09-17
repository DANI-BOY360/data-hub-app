import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  History,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import "../../styles/OrderHistoryPage.css";

const OrderHistoryPage = ({ onBack }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNetwork, setFilterNetwork] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock order data - replace with actual API call
  const mockOrders = [
    {
      id: "MTN_1734567890_abc123",
      phoneNumber: "+233 54 123 4567",
      network: "MTN",
      dataSize: "5GB",
      amount: "GH₵ 5.50",
      timestamp: "2025-09-16T14:30:00Z",
      status: "Completed",
    },
    {
      id: "TELECEL_1734567891_def456",
      phoneNumber: "+233 50 987 6543",
      network: "TELECEL",
      dataSize: "10GB",
      amount: "GH₵ 11.80",
      timestamp: "2025-09-16T12:15:00Z",
      status: "Completed",
    },
    {
      id: "AT_BIGTIME_1734567892_ghi789",
      phoneNumber: "+233 26 555 7890",
      network: "AT BigTime",
      dataSize: "25GB",
      amount: "GH₵ 27.80",
      timestamp: "2025-09-15T16:45:00Z",
      status: "Completed",
    },
    {
      id: "MTN_1734567893_jkl012",
      phoneNumber: "+233 55 111 2222",
      network: "MTN",
      dataSize: "2GB",
      amount: "GH₵ 2.50",
      timestamp: "2025-09-15T09:20:00Z",
      status: "Failed",
    },
    {
      id: "TELECEL_1734567894_mno345",
      phoneNumber: "+233 57 333 4444",
      network: "TELECEL",
      dataSize: "15GB",
      amount: "GH₵ 17.50",
      timestamp: "2025-09-14T18:30:00Z",
      status: "Completed",
    },
    {
      id: "MTN_1734567895_pqr678",
      phoneNumber: "+233 24 777 8888",
      network: "MTN",
      dataSize: "1GB",
      amount: "GH₵ 1.00",
      timestamp: "2025-09-14T11:10:00Z",
      status: "Completed",
    },
    {
      id: "AT_BIGTIME_1734567896_stu901",
      phoneNumber: "+233 27 999 0000",
      network: "AT BigTime",
      dataSize: "50GB",
      amount: "GH₵ 53.80",
      timestamp: "2025-09-13T20:45:00Z",
      status: "Completed",
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter and search orders
    let filtered = orders;

    // Filter by network
    if (filterNetwork !== "all") {
      filtered = filtered.filter(
        (order) => order.network.toLowerCase() === filterNetwork.toLowerCase()
      );
    }

    // Search by phone number or order ID
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, filterNetwork]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-GB"),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "status-completed";
      case "failed":
        return "status-failed";
      case "pending":
        return "status-pending";
      default:
        return "status-unknown";
    }
  };

  const getNetworkColor = (network) => {
    switch (network.toLowerCase()) {
      case "mtn":
        return "network-mtn";
      case "telecel":
        return "network-telecel";
      case "at bigtime":
        return "network-at";
      default:
        return "network-default";
    }
  };

  const handleExport = () => {
    // Simulate export functionality
    alert(
      "Export feature coming soon! This will download your order history as CSV/PDF."
    );
  };

  const handleViewDetails = (order) => {
    alert(
      `Order Details:\n\nID: ${order.id}\nPhone: ${order.phoneNumber}\nData: ${
        order.dataSize
      }\nAmount: ${order.amount}\nStatus: ${order.status}\nDate: ${
        formatDate(order.timestamp).date
      } at ${formatDate(order.timestamp).time}`
    );
  };

  return (
    <div className="order-history-page">
      {/* Header */}
      <div className="order-history-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <div className="header-content">
          <div className="page-logo">
            <History size={24} className="history-icon" />
          </div>
          <div className="header-text">
            <h1 className="page-title">Order History</h1>
            <p className="page-subtitle">
              Track all your data bundle purchases
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="controls-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by phone number or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <Filter size={20} className="filter-icon" />
          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Networks</option>
            <option value="mtn">MTN</option>
            <option value="telecel">TELECEL</option>
            <option value="at bigtime">AT BigTime</option>
          </select>
        </div>

        <button onClick={handleExport} className="export-button">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter((order) => order.status === "Completed").length}
          </div>
          <div className="stat-label">Successful</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter((order) => order.status === "Failed").length}
          </div>
          <div className="stat-label">Failed</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-section">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading order history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <History size={48} className="empty-icon" />
            <h3>No Orders Found</h3>
            <p>
              {searchTerm || filterNetwork !== "all"
                ? "No orders match your search criteria."
                : "You haven't placed any orders yet. Start by purchasing a data bundle!"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Phone Number</th>
                  <th>Network</th>
                  <th>Data Size</th>
                  <th>Amount</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const { date, time } = formatDate(order.timestamp);
                  return (
                    <tr key={order.id} className="order-row">
                      <td className="order-id">
                        <code>{order.id}</code>
                      </td>
                      <td className="phone-number">{order.phoneNumber}</td>
                      <td className="network">
                        <span
                          className={`network-badge ${getNetworkColor(
                            order.network
                          )}`}
                        >
                          {order.network}
                        </span>
                      </td>
                      <td className="data-size">
                        <strong>{order.dataSize}</strong>
                      </td>
                      <td className="amount">
                        <strong>{order.amount}</strong>
                      </td>
                      <td className="datetime">
                        <div className="date">{date}</div>
                        <div className="time">{time}</div>
                      </td>
                      <td className="status">
                        <span
                          className={`status-badge ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="view-button"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Info */}
      {!isLoading && filteredOrders.length > 0 && (
        <div className="results-info">
          <p>
            Showing {filteredOrders.length} of {orders.length} orders
            {searchTerm && ` matching "${searchTerm}"`}
            {filterNetwork !== "all" && ` from ${filterNetwork}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
