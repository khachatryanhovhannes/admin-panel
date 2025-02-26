import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Languages from "./pages/languages";
import NavbarTable from "./pages/navbar";
import TextManagement from "./pages/texts";
import ConstantsManagement from "./pages/constants";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <aside
          style={{ width: 200, padding: 10, borderRight: "1px solid #ccc" }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link to="/admin/languages">Languages</Link>
            <Link to="/admin/texts">Text</Link>
            <Link to="/admin/menus">Menus</Link>
            <Link to="/admin/constants">Constants</Link>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 10 }}>
          <Routes>
            <Route path="/admin/languages" element={<Languages />} />
            <Route path="/admin/menus" element={<NavbarTable />} />
            <Route path="/admin/texts" element={<TextManagement />} />
            <Route path="/admin/constants" element={<ConstantsManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
