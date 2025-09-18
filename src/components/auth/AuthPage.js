// components/auth/AuthPage.js
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Database,
  Shield,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";
import "../../styles/AuthPage.css";

const AuthPage = () => {
  const { signUp, signIn, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  // Fetch user profile data when user is authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select(
              `
              id,
              username,
              full_name,
              email,
              avatar_url,
              created_at,
              updated_at
            `
            )
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }

          setUserProfile(data);
        } catch (error) {
          console.error("Error in fetchUserProfile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const createUserProfile = async (userId, userData) => {
    try {
      const profileData = {
        id: userId,
        username: userData.name.toLowerCase().replace(/\s+/g, ""), // Create username from name
        full_name: userData.name,
        email: userData.email,
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert([profileData], {
          onConflict: "id",
          returning: "minimal",
        });

      if (error) {
        throw error;
      }

      console.log("User profile created/updated successfully:", data);
      return { data, error: null };
    } catch (error) {
      console.error("Error creating user profile:", error);
      return { data: null, error };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Registration-specific validation
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Full name is required";
      }

      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (formData.phone.length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Sign in existing user
        const { data, error } = await signIn(formData.email, formData.password);

        if (error) {
          throw error;
        }

        // User will be automatically redirected by the AuthContext
        setSuccessMessage("Successfully signed in! Welcome back.");

        // Fetch user profile after successful sign in
        if (data?.user?.id) {
          const profileResult = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (profileResult.data) {
            setUserProfile(profileResult.data);
          }
        }
      } else {
        // Register new user
        const userData = {
          name: formData.name,
          email: formData.email,
          // phone: formData.phone, // Removed since it's not in your schema
        };

        // Create user account
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          userData
        );

        if (error) {
          throw error;
        }

        // If user creation successful, create profile in database
        if (data?.user?.id) {
          const profileResult = await createUserProfile(data.user.id, userData);

          if (profileResult.error) {
            console.error("Profile creation error:", profileResult.error);
            // Still show success for account creation even if profile fails
            setSuccessMessage(
              "Account created successfully! Profile setup had issues, but you can update it later."
            );
          } else {
            setSuccessMessage(
              "Registration successful! Please check your email to confirm your account."
            );
          }
        }

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);

      // Handle specific Supabase errors
      let errorMessage = error.message;

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("User already registered")) {
        errorMessage =
          "An account with this email already exists. Please sign in instead.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage =
          "Please check your email and click the confirmation link before signing in.";
      } else if (error.message.includes("Email rate limit exceeded")) {
        errorMessage =
          "Too many attempts. Please wait a moment before trying again.";
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  // Function to update user profile
  const updateProfile = async (updatedData) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: updatedData.username,
          full_name: updatedData.full_name,
          email: updatedData.email,
          avatar_url: updatedData.avatar_url,
          // updated_at is handled by trigger
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      setSuccessMessage("Profile updated successfully!");
      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
      return { data: null, error };
    }
  };

  // If user is logged in and we have their profile, show a welcome message
  if (user && userProfile) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="welcome-section">
            <div className="welcome-header">
              <CheckCircle size={48} className="success-icon" />
              <h1>
                Welcome back, {userProfile.full_name || userProfile.username}!
              </h1>
              <p>You're successfully signed in to Emapok Data Hub</p>
            </div>

            <div className="profile-info">
              <h3>Your Profile Information</h3>
              <div className="profile-details">
                <div className="profile-item">
                  <User size={20} />
                  <span>
                    <strong>Username:</strong> {userProfile.username}
                  </span>
                </div>
                <div className="profile-item">
                  <User size={20} />
                  <span>
                    <strong>Full Name:</strong> {userProfile.full_name}
                  </span>
                </div>
                <div className="profile-item">
                  <Mail size={20} />
                  <span>
                    <strong>Email:</strong> {userProfile.email}
                  </span>
                </div>
                <div className="profile-item">
                  <Database size={20} />
                  <span>
                    <strong>Member since:</strong>{" "}
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="primary-button">
                <Database size={20} />
                Browse Data Bundles
              </button>
              <button className="secondary-button">
                <User size={20} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="brand-logo">
            <Database size={32} />
          </div>
          <h1 className="brand-title">Emapok Data Hub</h1>
          <p className="brand-subtitle">Your trusted data bundle partner</p>
        </div>

        {/* Auth Form */}
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button
              className={`tab-button ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`tab-button ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Create Account
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <CheckCircle size={20} />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-container">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={errors.name ? "error" : ""}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <span className="error-text">
                      <AlertCircle size={16} />
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-container">
                    <Phone size={20} className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+233 20 123 4567"
                      className={errors.phone ? "error" : ""}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-text">
                      <AlertCircle size={16} />
                      {errors.phone}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? "error" : ""}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="error-text">
                  <AlertCircle size={16} />
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={errors.password ? "error" : ""}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-text">
                  <AlertCircle size={16} />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password (Registration only) */}
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? "error" : ""}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">
                    <AlertCircle size={16} />
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="submit-error">
                <AlertCircle size={20} />
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="auth-footer">
            <p>
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="link-button"
                disabled={isLoading}
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="features-section">
          <div className="feature">
            <Shield size={24} />
            <span>Secure & Trusted</span>
          </div>
          <div className="feature">
            <Database size={24} />
            <span>All Networks</span>
          </div>
          <div className="feature">
            <User size={24} />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
