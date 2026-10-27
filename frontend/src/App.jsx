import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import MyRequests from "./pages/MyRequests";
import { AssignedTasks, DepartmentQueue } from "./pages/QueuePages";
import RequestDetail from "./pages/RequestDetail";
import Dashboard from "./pages/Dashboard";

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/my-requests" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/my-requests" element={<MyRequests />} />
        <Route
          path="/assigned-tasks"
          element={
            <Protected roles={["AGENT"]}>
              <AssignedTasks />
            </Protected>
          }
        />
        <Route
          path="/department-queue"
          element={
            <Protected roles={["COORDINATOR"]}>
              <DepartmentQueue />
            </Protected>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected roles={["COORDINATOR"]}>
              <Dashboard />
            </Protected>
          }
        />
        <Route path="/requests/:id" element={<RequestDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
