import React, { useState } from "react";
import { Wallet, ArrowLeft } from "lucide-react";
import "../../styles/TopUp.css";

const TopUp = ({ onBack, userWallet, onBalanceUpdate }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async () => {
    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    const topUpAmount = parseFloat(amount);
    if (topUpAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Update wallet balance
      onBalanceUpdate(userWallet + topUpAmount);
      alert(`Successfully topped up GH₵${amount}`);
      setAmount("");
    }, 2000);
  };

  return (
    <div className="topup-container">
      {/* Back Button */}
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      {/* Header Card */}
      <div className="header-card">
        <div className="header-icon">
          <Wallet size={32} />
        </div>
        <h1>LOAD WALLET</h1>
        <p>
          Add funds to your wallet instantly and securely. Your balance will be
          updated immediately after payment confirmation.
        </p>
      </div>

      {/* Topup Card */}
      <div className="topup-card">
        <div className="card-header">
          <Wallet size={20} />
          <span>E-Wallet Top Up</span>
        </div>

        <div className="current-balance">
          <span className="balance-label">Current Balance</span>
          <span className="balance-amount">GH₵ {userWallet.toFixed(2)}</span>
        </div>

        <div className="form-group">
          <label>
            ENTER AMOUNT <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <span className="currency">GH₵</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              min="1"
              step="0.01"
            />
          </div>
        </div>

        <button
          className="load-button"
          onClick={handleTopUp}
          disabled={isLoading || !amount}
        >
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <Wallet size={20} />
              Load Wallet
            </>
          )}
        </button>

        <div className="features">
          <div className="feature">
            <span className="check">✓</span>
            <span>Instant Processing</span>
          </div>
          <div className="feature">
            <span className="check">✓</span>
            <span>Secure Payment</span>
          </div>
          <div className="feature">
            <span className="check">✓</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
