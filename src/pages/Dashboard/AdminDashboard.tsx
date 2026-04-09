import { useAuth } from "../../context/AuthContext";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      <PageMeta title="Admin Dashboard" />
      <PageBreadcrumb pageName="Admin Dashboard" />

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

        {/* Admin Features Section */}
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Features (Coming Soon)
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Admin-specific features and management tools will be available here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
