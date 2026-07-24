import {
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaUserFriends,
  FaWallet,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import "../styles/dashboard.css";
import { DashboardProvider, useDashboard } from "./DashboardContext";

function DashboardShell() {
  const { logout, toast } = useDashboard();

  return (
    <div className="dash">
      <header className="dash-top">
        <Logo className="dash-logo" />
        <button
          type="button"
          className="dash-logout"
          onClick={logout}
          aria-label="Sign out"
        >
          <FaSignOutAlt size={16} />
        </button>
      </header>

      {toast ? (
        <p className="dash-toast dash-toast--fixed" role="status">
          {toast}
        </p>
      ) : null}

      <main className="dash-main">
        <Outlet />
      </main>

      <nav className="dash-nav" aria-label="Dashboard">
        <NavLink to="/dashboard" end>
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/dashboard/tasks">
          <FaClipboardList />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/dashboard/refer">
          <FaUserFriends />
          <span>Refer</span>
        </NavLink>
        <NavLink to="/dashboard/withdraw">
          <FaWallet />
          <span>Withdraw</span>
        </NavLink>
        <NavLink to="/dashboard/account">
          <FaUser />
          <span>Account</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  );
}
