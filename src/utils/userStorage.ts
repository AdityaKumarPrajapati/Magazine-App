// User storage utility - simulates backend storage using localStorage
const USERS_STORAGE_KEY = "users_db";

export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  role: "admin" | "operator";
  password: string;
  createdAt: string;
}

// Get all users from storage
export const getAllUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
};

// Find user by email
export const findUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find((user) => user.email === email) || null;
};

// Create new user
export const createUser = (data: Omit<User, "id" | "createdAt">): User => {
  const users = getAllUsers();

  // Check if email already exists
  if (users.some((user) => user.email === data.email)) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    ...data,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return newUser;
};

// Verify user credentials
export const verifyUser = (
  email: string,
  password: string
): User | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Delete all users (for testing)
export const clearAllUsers = (): void => {
  localStorage.removeItem(USERS_STORAGE_KEY);
};

// Export users as JSON
export const exportUsersAsJSON = (): string => {
  const users = getAllUsers();
  return JSON.stringify(users, null, 2);
};
