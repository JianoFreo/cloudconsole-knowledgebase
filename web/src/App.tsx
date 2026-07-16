import { Navigate, Route, Routes } from "react-router";
import About from "./about/About";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/about" replace />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
