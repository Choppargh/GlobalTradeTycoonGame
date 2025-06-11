import { BrowserRouter, Route, Routes } from "react-router-dom";
import SimpleHomePage from "./pages/SimpleHomePage";
import NotFound from "./pages/not-found";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleHomePage />} />
        <Route path="/home" element={<SimpleHomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
