import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import LoginPage from "./pages/login";
import Languages from "./pages/languages";
import NavbarTable from "./pages/navbar";
import TextManagement from "./pages/texts";
import ConstantsManagement from "./pages/constants";
import LogoutButton from "./components/LogoutButton";
import Home from "./pages/home";

function Layout() {
  const { user } = useAuth();
  return (
    <div style={{ display: "flex" }}>
      {user && (
        <aside
          style={{ width: 200, padding: 15, borderRight: "1px solid #ccc" }}
        >
          <h2 style={{ marginBottom: 40, textAlign: "center" }}>
            <span style={{ fontWeight: "bold" }}>HyCody</span> <br /> Content
            Management System
          </h2>
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/languages">Languages</Link>
            <Link to="/admin/texts">Text</Link>
            <Link to="/admin/menus">Menus</Link>
            <Link to="/admin/constants">Constants</Link>
            <LogoutButton />
          </nav>
        </aside>
      )}
      <main style={{ flex: 1, padding: 10 }}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/admin" /> : <LoginPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/languages" element={<Languages />} />
            <Route path="/admin/menus" element={<NavbarTable />} />
            <Route path="/admin/texts" element={<TextManagement />} />
            <Route path="/admin/constants" element={<ConstantsManagement />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={user ? "/admin/languages" : "/login"} />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
