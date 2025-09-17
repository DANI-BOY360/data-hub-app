import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Zap,
  Check,
  AlertCircle,
  Shield,
  Wallet,
} from "lucide-react";
import "../../styles/MTNPage.css";

const MTNPage = ({ onBack, userWallet = 0 }) => {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [walletBalance, setWalletBalance] = useState(userWallet);

  const mtnBundles = [
    { id: 1, data: "1GB", price: 4.8, priceText: "GH₵ 4.80" },
    { id: 2, data: "2GB", price: 9.8, priceText: "GH₵ 9.80" },
    { id: 3, data: "3GB", price: 14.5, priceText: "GH₵ 14.50" },
    { id: 4, data: "4GB", price: 19.5, priceText: "GH₵ 19.50" },
    { id: 5, data: "5GB", price: 23.5, priceText: "GH₵ 23.50" },
    { id: 8, data: "10GB", price: 43.5, priceText: "GH₵ 43.50" },
    { id: 10, data: "20GB", price: 85.0, priceText: "GH₵ 85.00" },
    { id: 14, data: "50GB", price: 190.5, priceText: "GH₵ 190.50" },
  ];

  // Validate MTN Ghana number
  const validateMTNNumber = (number) => {
    // MTN Ghana prefixes: 024, 054, 055, 059
    const mtnPrefixes = ["024", "054", "055", "059"];
    const fullNumber = "0" + number;
    return (
      mtnPrefixes.some((prefix) => fullNumber.startsWith(prefix)) &&
      number.length === 9
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.length !== 9) {
      newErrors.phoneNumber = "Phone number must be 9 digits";
    } else if (!validateMTNNumber(phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid MTN number (024, 054, 055, 059)";
    }

    // Bundle selection validation
    if (!selectedBundle) {
      newErrors.bundle = "Please select a data bundle";
    }

    // Wallet balance validation
    if (selectedBundle && walletBalance < selectedBundle.price) {
      newErrors.wallet = `Insufficient balance. You need GH₵ ${(
        selectedBundle.price - walletBalance
      ).toFixed(2)} more`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle);
    // Clear bundle-related errors when selection changes
    if (errors.bundle) {
      setErrors((prev) => ({ ...prev, bundle: null }));
    }
    if (errors.wallet) {
      setErrors((prev) => ({ ...prev, wallet: null }));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhoneNumber(value);

    // Clear phone number errors when user starts typing
    if (errors.phoneNumber && value.length > 0) {
      setErrors((prev) => ({ ...prev, phoneNumber: null }));
    }
  };

  const handleInitiatePurchase = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    setShowConfirmation(false);

    try {
      // Generate transaction ID
      const txId = `MTN_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setTransactionId(txId);

      // Simulate API call to process payment and send bundle
      const response = await simulateAPICall({
        transactionId: txId,
        phoneNumber: "0" + phoneNumber,
        bundle: selectedBundle,
        amount: selectedBundle.price,
        walletBalance: walletBalance,
      });

      if (response.success) {
        // Deduct from wallet
        setWalletBalance((prev) => prev - selectedBundle.price);

        // Show success message
        alert(
          `✅ Success!\nTransaction ID: ${txId}\n${
            selectedBundle.data
          } bundle sent to 0${phoneNumber}\nRemaining balance: GH₵ ${(
            walletBalance - selectedBundle.price
          ).toFixed(2)}`
        );

        // Reset form
        setSelectedBundle(null);
        setPhoneNumber("");
        setErrors({});
        setTransactionId(null);
      } else {
        throw new Error(response.error || "Transaction failed");
      }
    } catch (error) {
      alert(
        `❌ Transaction Failed\nError: ${error.message}\nTransaction ID: ${
          transactionId || "N/A"
        }\nPlease contact support if amount was deducted.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API call
  const simulateAPICall = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() < 0.95) {
          resolve({
            success: true,
            transactionId: data.transactionId,
            message: "Bundle delivered successfully",
          });
        } else {
          reject(new Error("Network error - please try again"));
        }
      }, 2000 + Math.random() * 1000); // 2-3 seconds delay
    });
  };

  return (
    <div className="mtn-page">
      {/* Header with Wallet Balance */}
      <div className="mtn-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <div className="header-content">
          <div className="mtn-logo">
            <Zap size={24} className="mtn-icon" />
          </div>
          <div className="header-text">
            <h1 className="page-title">MTN Data Bundles</h1>
            <p className="page-subtitle">Choose your perfect data bundle</p>
          </div>
        </div>
        <div className="wallet-display">
          <Wallet size={18} />
          <span className="wallet-balance">GH₵ {walletBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="phone-input-section">
        <label htmlFor="phone" className="input-label">
          MTN Phone Number *
        </label>
        <div className="phone-input-container">
          <span className="country-code">+233</span>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="541234567"
            className={`phone-input ${errors.phoneNumber ? "error" : ""}`}
            disabled={isLoading}
          />
        </div>
        {errors.phoneNumber && (
          <p className="error-message">{errors.phoneNumber}</p>
        )}
        <p className="input-helper">
          Enter recipient's MTN number (024, 054, 055, 059)
        </p>
      </div>

      {/* Bundles Grid */}
      <div className="bundles-section">
        <h2 className="section-title">Available Bundles</h2>
        {errors.bundle && <p className="error-message">{errors.bundle}</p>}
        {errors.wallet && (
          <p className="error-message wallet-error">{errors.wallet}</p>
        )}
        <div className="bundles-grid">
          {mtnBundles.map((bundle) => {
            const canAfford = walletBalance >= bundle.price;
            return (
              <div
                key={bundle.id}
                className={`bundle-card ${
                  selectedBundle?.id === bundle.id ? "selected" : ""
                } ${!canAfford ? "disabled" : ""}`}
                onClick={() => canAfford && handleBundleSelect(bundle)}
              >
                {!canAfford && (
                  <div className="insufficient-badge">Insufficient Balance</div>
                )}

                <div className="bundle-content">
                  <div className="bundle-data">
                    <span className="data-amount">{bundle.data}</span>
                  </div>

                  <div className="bundle-details">
                    <div className="price">
                      <span className="price-amount">{bundle.priceText}</span>
                    </div>
                  </div>
                </div>

                {selectedBundle?.id === bundle.id && (
                  <div className="selected-indicator">
                    <Check size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Summary */}
      {selectedBundle && (
        <div className="purchase-summary">
          <div className="summary-content">
            <div className="summary-details">
              <h3>Purchase Summary</h3>
              <div className="summary-row">
                <span>Bundle:</span>
                <span>{selectedBundle.data}</span>
              </div>
              <div className="summary-row">
                <span>Phone Number:</span>
                <span>+233 {phoneNumber}</span>
              </div>
              <div className="summary-row">
                <span>Amount:</span>
                <span>{selectedBundle.priceText}</span>
              </div>
              <div className="summary-row">
                <span>Current Balance:</span>
                <span>GH₵ {walletBalance.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Balance After:</span>
                <span>
                  GH₵ {(walletBalance - selectedBundle.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Button */}
      <div className="purchase-section">
        <button
          onClick={handleInitiatePurchase}
          disabled={
            !selectedBundle ||
            !phoneNumber ||
            isLoading ||
            (selectedBundle && walletBalance < selectedBundle.price)
          }
          className={`purchase-button ${
            !selectedBundle ||
            !phoneNumber ||
            (selectedBundle && walletBalance < selectedBundle.price)
              ? "disabled"
              : ""
          }`}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Shield size={20} />
              <span>Secure Purchase</span>
            </>
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <Shield size={24} />
              <h3>Confirm Purchase</h3>
            </div>
            <div className="modal-content">
              <p>Please confirm your purchase details:</p>
              <div className="confirmation-details">
                <div className="detail-row">
                  <span>Bundle:</span>
                  <strong>{selectedBundle.data}</strong>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <strong>+233 {phoneNumber}</strong>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <strong>{selectedBundle.priceText}</strong>
                </div>
                <div className="detail-row highlight">
                  <span>New Balance:</span>
                  <strong>
                    GH₵ {(walletBalance - selectedBundle.price).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmation(false)}
                className="cancel-button"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="confirm-button"
                disabled={isLoading}
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="info-section">
        <div className="info-card">
          <Shield size={20} className="info-icon" />
          <div className="info-content">
            <h4>Secure Transaction</h4>
            <ul>
              <li>Contact support with transaction ID for any issues</li>
              <li>Refunds processed only for failed deliveries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MTNPage;
