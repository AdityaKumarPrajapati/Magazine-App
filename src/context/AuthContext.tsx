import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Import the User interface from your storage utility
import { User, verifyUser } from "../utils/userStorage";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // This now calls the verifyUser logic which includes our Static Admin
    const user = verifyUser(email, password);
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Security: Remove password before storing in state/localStorage
    const { password: _, ...userWithoutPassword } = user;
    
    setCurrentUser(userWithoutPassword as User);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};