import { Navigate, Route, Routes } from "react-router";
import About from "./about/About";
import Browse from "./pages/Browse";
import ArticlePage from "./pages/ArticlePage";
import SharePage from "./pages/SharePage";
import DepartmentPage from "./pages/DepartmentPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/departments/:slug" element={<DepartmentPage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
        <Route path="/share" element={<SharePage />} />
      </Routes>
    </div>
  );
}

export default App;
