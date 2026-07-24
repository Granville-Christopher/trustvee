import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccountTab from "./dashboard/AccountTab";
import DashboardLayout from "./dashboard/DashboardLayout";
import HomeTab from "./dashboard/HomeTab";
import ReferTab from "./dashboard/ReferTab";
import TasksTab from "./dashboard/TasksTab";
import WithdrawTab from "./dashboard/WithdrawTab";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<HomeTab />} />
            <Route path="tasks" element={<TasksTab />} />
            <Route path="refer" element={<ReferTab />} />
            <Route path="withdraw" element={<WithdrawTab />} />
            <Route path="account" element={<AccountTab />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
