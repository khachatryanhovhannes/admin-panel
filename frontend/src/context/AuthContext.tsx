import { createContext, useContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type AuthContextType = {
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    // const { data } = await axios.post("http://localhost:3000/auth/login", {
    //   username,
    //   password,
    // });

    const data = {
      accessToken: "your_access_token_here", // Replace with actual token from your API response
      refreshToken: "your_refresh_token_here", // Replace with actual token from your API response
      username: "username",
    };
    console.log(data.accessToken);
    // const decoded: any = jwtDecode(data.accessToken); 
    setUser(data.username);
    localStorage.setItem("token", data.accessToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
