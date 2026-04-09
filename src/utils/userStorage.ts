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

// 1. Define the Static Super Admin
const STATIC_USERS: User[] = [
    {
        id: "super-admin-01",
        fname: "Super",
        lname: "Admin",
        email: "admin@magazine.com",
        phone: "+1234567890",
        role: "admin",
        password: "admin123",
        createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
        id: "operator-01",
        fname: "Magazine",
        lname: "Operator",
        email: "operator@magazine.com",
        phone: "+0987654321",
        role: "operator",
        password: "operator123",
        createdAt: "2024-01-01T00:00:00.000Z",
    }
];

// Get all users from storage
export const getAllUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    
    // 2. Filter out static users that might already be in storage to avoid duplicates,
    // then merge the static users with the storage users.
    const dynamicUsers = users.filter(
      (u) => !STATIC_USERS.some((s) => s.email === u.email)
    );
    
    return [...STATIC_USERS, ...dynamicUsers];
  } catch (error) {
    console.error("Error reading users:", error);
    return STATIC_USERS;
  }
};

// Find user by email
export const findUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find((user) => user.email === email) || null;
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

// Create new user (Optional: can still be used for adding operators locally)
export const createUser = (data: Omit<User, "id" | "createdAt">): User => {
    const users = getAllUsers();
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