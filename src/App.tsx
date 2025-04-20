import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ArticleDetail from "./pages/article/[id]"; // Adjust path if necessary

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </Suspense>
  );
}

export default App;
