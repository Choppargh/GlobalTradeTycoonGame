import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/not-found";
import { Loading } from "./components/ui/loading";
// Removed InstallPrompt import as we're using CustomInstallPrompt instead
import { Toaster } from "./components/ui/sonner";
import { useRefreshRecovery } from "./hooks/useRefreshRecovery";
import { AuthProvider } from "./contexts/AuthContext";
import "@fontsource/inter";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the refresh recovery hook to handle unexpected refreshes
  useRefreshRecovery();

  useEffect(() => {
    // Simulate loading assets/data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading screen for 2 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Loading isLoading={isLoading} />
      {/* Custom install prompt is already included in HomePage */}
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
