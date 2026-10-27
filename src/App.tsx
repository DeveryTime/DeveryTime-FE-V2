import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PostMainRoute from "./pages/PostMainPage/PostMainRoute";
import PostWritePage from "./pages/postWritePage/PostWritePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/posts" replace />} />
        <Route path="/posts" element={<PostMainRoute />} />
        <Route path="/posts/new" element={<PostWritePage />} />
        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
