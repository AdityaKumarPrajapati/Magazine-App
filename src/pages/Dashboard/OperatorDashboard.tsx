import { useAuth } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function OperatorDashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <PageMeta title="Operator Dashboard" />
      <PageBreadcrumb pageName="Operator Dashboard" />

      <div className="grid grid-cols-1 gap-6">
        {/* Welcome Card */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome, {currentUser?.firstName} {currentUser?.lastName}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You are logged in as <span className="font-medium capitalize">{currentUser?.role}</span>
          </p>
        </div>

        {/* Profile Information */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h3>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Name</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {currentUser?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Role</span>
              <span className="font-medium capitalize text-gray-900 dark:text-white">
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Task Stats */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Active Tasks</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">0</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">📊 View Reports</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access and view operational reports
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">✅ Manage Tasks</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track and update your assigned tasks
              </p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">💬 Communication</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send messages to team members
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}