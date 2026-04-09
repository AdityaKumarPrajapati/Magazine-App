import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import TaxEntry from "./pages/TaxEntry";
import AddNewEntry from "./pages/AddNewEntry";
import AddReceipt from "./pages/AddReceipt";
import EditReceipt from "./pages/EditReceipt";
import EntryReceipts from "./pages/EntryReceipts";
import ViewTaxList from "./pages/ViewTaxList";
import UserProfiles from "./pages/UserProfiles";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import OperatorDashboard from "./pages/Dashboard/OperatorDashboard";
import ManageOperators from "./pages/adminPages/ManageOperators";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// --- Route Guard ---
const ProtectedRoute = ({
  element,
  requiredRole,
}: {
  element: React.ReactElement;
  requiredRole?: "admin" | "operator";
}) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!currentUser) return <Navigate to="/signin" replace />;
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return element;
};

// --- Logic to find the right home dashboard ---
const DashboardRedirect = () => {
  const { currentUser, isLoading } = useAuth();
  if (isLoading) return null;
  if (!currentUser) return <Navigate to="/signin" replace />;

  return currentUser.role === "admin"
    ? <Navigate to="/admin-dashboard" replace />
    : <Navigate to="/operator-dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Main App Wrapper */}
      <Route element={<ProtectedRoute element={<AppLayout />} />}>
        {/* Entry Points */}
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* SHARED ROUTES (Matches your sidebar path: "/profile") */}
        <Route path="/profile" element={<UserProfiles />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin" element={<AdminDashboard />} />} />
        <Route
          path="/admin-dashboard/manage-operators"
          element={<ProtectedRoute requiredRole="admin" element={<ManageOperators />} />}
        />

        {/* OPERATOR ROUTES */}
        <Route path="/operator-dashboard" element={<ProtectedRoute requiredRole="operator" element={<OperatorDashboard />} />} />
        <Route path="/operator-dashboard/tax-entry" element={<ProtectedRoute requiredRole="operator" element={<TaxEntry />} />} />
        <Route path="/operator-dashboard/add-new-entry" element={<ProtectedRoute requiredRole="operator" element={<AddNewEntry />} />} />
        <Route path="/operator-dashboard/add-receipt" element={<ProtectedRoute requiredRole="operator" element={<AddReceipt />} />} />
        {/* <Route path="/operator-dashboard/edit-receipt" element={<ProtectedRoute requiredRole="operator" element={<EditReceipt />} />} /> */}
        <Route path="/operator-dashboard/edit-receipt/:entryIndex/:receiptId" element={<ProtectedRoute requiredRole="operator" element={<EditReceipt />} />} />
        <Route path="/operator-dashboard/view-tax-list" element={<ProtectedRoute requiredRole="operator" element={<ViewTaxList />} />} />
        <Route path="/operator-dashboard/view-tax-list/receipts" element={<ProtectedRoute requiredRole="operator" element={<EntryReceipts />} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}