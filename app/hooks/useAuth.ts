import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // First check if user exists with given ID
      const { data, error } = await supabase
        .from("users")
        .select("*") // or select("role") if you only need the role
        .eq("id", username)
        .single();

      if (error || !data) {
        throw new Error("User not found");
      }

      // Simple password check (since password equals ID in this case)
      if (username !== password) {
        throw new Error("Invalid password");
      }

      // Set user data in state and localStorage
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
