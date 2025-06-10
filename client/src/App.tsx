import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import NotFound from "./pages/not-found";
import { TestComponent } from "./components/TestComponent";
import { Loading } from "./components/ui/loading";
// Removed InstallPrompt import as we're using CustomInstallPrompt instead
// import { Toaster } from "./components/ui/sonner";
// import { useRefreshRecovery } from "./hooks/useRefreshRecovery";
import "@fontsource/inter";

function App() {
  const [isLoading, setIsLoading] = useState(false); // Disable loading screen to prevent redirect loops

  return (
    <QueryClientProvider client={queryClient}>
      <Loading isLoading={isLoading} />
      {/* Custom install prompt is already included in HomePage */}
      {/* <Toaster position="top-right" /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
