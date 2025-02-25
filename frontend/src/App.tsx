import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LanguageList from "./pages/languages/LanguageList";
import LanguageEdit from "./pages/languages/LanguageEdit";

import PageList from "./pages/pages/PageList";
import PageEdit from "./pages/pages/PageEdit";

import ContentBlockList from "./pages/contentBlocks/ContentBlockList";
import ContentBlockEdit from "./pages/contentBlocks/ContentBlockEdit";

import GlobalContentList from "./pages/globalContents/GlobalContentList";
import GlobalContentEdit from "./pages/globalContents/GlobalContentEdit";

import MenuList from "./pages/menus/MenuList";
import MenuEdit from "./pages/menus/MenuEdit";

import MenuItemList from "./pages/menuItems/MenuItemList";
import MenuItemEdit from "./pages/menuItems/MenuItemEdit";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar navigation */}
        <aside
          style={{ width: 200, padding: 10, borderRight: "1px solid #ccc" }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Link to="/admin/languages">Languages</Link>
            <Link to="/admin/pages">Pages</Link>
            <Link to="/admin/content-blocks">Content Blocks</Link>
            <Link to="/admin/global-contents">Global Contents</Link>
            <Link to="/admin/menus">Menus</Link>
            <Link to="/admin/menu-items">Menu Items</Link>
            {/* Այստեղ կարող եք ավելացնել Users, Roles, Settings և այլն */}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 10 }}>
          <Routes>
            {/* LANGUAGES */}
            <Route path="/admin/languages" element={<LanguageList />} />
            <Route path="/admin/languages/:id" element={<LanguageEdit />} />

            {/* PAGES */}
            <Route path="/admin/pages" element={<PageList />} />
            <Route path="/admin/pages/:id" element={<PageEdit />} />

            {/* CONTENT BLOCKS */}
            <Route
              path="/admin/content-blocks"
              element={<ContentBlockList />}
            />
            <Route
              path="/admin/content-blocks/:id"
              element={<ContentBlockEdit />}
            />

            {/* GLOBAL CONTENTS */}
            <Route
              path="/admin/global-contents"
              element={<GlobalContentList />}
            />
            <Route
              path="/admin/global-contents/:id"
              element={<GlobalContentEdit />}
            />

            {/* MENUS */}
            <Route path="/admin/menus" element={<MenuList />} />
            <Route path="/admin/menus/:id" element={<MenuEdit />} />

            {/* MENU ITEMS */}
            <Route path="/admin/menu-items" element={<MenuItemList />} />
            <Route path="/admin/menu-items/:id" element={<MenuItemEdit />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
