import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { TableIcon, TrashBinIcon, PencilIcon, PlusIcon, ListIcon } from "../../icons";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  role: "admin" | "operator";
  password?: string;
  createdAt: string;
}

const ManageOperators: React.FC = () => {
  const [operators, setOperators] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    role: "operator" as "admin" | "operator",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const rawData = localStorage.getItem("users_db");
    if (rawData) {
      try {
        const allUsers: User[] = JSON.parse(rawData);
        // We show operators in this list, but the Add User modal can create Admins too
        const filteredOps = allUsers.filter((user) => user.role === "operator");
        setOperators(filteredOps);
      } catch (error) {
        console.error("Error parsing users_db:", error);
      }
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const rawData = localStorage.getItem("users_db");
    const allUsers: User[] = rawData ? JSON.parse(rawData) : [];

    const newUser: User = {
      ...formData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem("users_db", JSON.stringify(updatedUsers));
    
    fetchUsers();
    setIsModalOpen(false);
    setFormData({ fname: "", lname: "", phone: "", email: "", role: "operator", password: "" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this operator?")) {
      const rawData = localStorage.getItem("users_db");
      if (rawData) {
        const allUsers: User[] = JSON.parse(rawData);
        const updatedUsers = allUsers.filter((user) => user.id !== id);
        localStorage.setItem("users_db", JSON.stringify(updatedUsers));
        fetchUsers();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Operators</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Database of registered system users.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 text-white" />
          Add User
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <TableIcon className="text-blue-600" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Operators List</h3>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Name</th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500">Contact</th>
                <th className="px-6 py-3 text-xs font-bold uppercase text-gray-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {operators.length > 0 ? (
                operators.map((op) => (
                  <tr key={op.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{op.fname} {op.lname}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{op.email}</div>
                      <div className="text-xs text-gray-500">{op.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/admin-dashboard/edit-operator/${op.id}`)} 
                          className="rounded bg-blue-100 p-1.5 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(op.id)} 
                          className="rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                    No operators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- INLINE MODAL COMPONENT (Tailwind Only) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          {/* Modal Box */}
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 border dark:border-gray-800">
            <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add New User</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input 
                    type="text" 
                    placeholder="John" 
                    value={formData.fname} 
                    onChange={(e) => setFormData({...formData, fname: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input 
                    type="text" 
                    placeholder="Doe" 
                    value={formData.lname} 
                    onChange={(e) => setFormData({...formData, lname: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input 
                  type="text" 
                  placeholder="9876543210" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as "admin" | "operator"})}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOperators;