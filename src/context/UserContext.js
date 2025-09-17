// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(session);
        if (session?.user) {
          // Get user profile data
          await fetchUserProfile(session.user.id);
        }
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setUser({
          id: userId,
          email: session?.user?.email,
          name: data.username || data.full_name || "User",
          ...data,
        });
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const signUp = async ({ email, password, username }) => {
    try {
      setIsLoading(true);

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create profile record
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            username: username,
            email: email,
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Profile creation failed, but auth succeeded
          // You might want to handle this case
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!session?.user?.id) return { error: "No user logged in" };

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local user state
      setUser((prev) => ({ ...prev, ...updates }));
      return { data, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
