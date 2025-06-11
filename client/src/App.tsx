import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import NotFound from "./pages/not-found";
import { Loading } from "./components/ui/loading";
import { Toaster } from "./components/ui/sonner";
import "@fontsource/inter";

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Loading isLoading={isLoading} />
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
