import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import { Navbar } from "./components/layout/Navbar";
import { CartDrawer } from "./components/cart/CartDrawer";
import { HomePage } from "./page/HomePage";
import { ProductsPage } from "./page/ProductPage";
import { ProductDetailPage } from "./page/ProductDetail";
import { PcBuilderPage } from "./page/PcBuilder";
import { ComparePage } from "./page/Compare";
import { OffersPage } from "./page/OffeersPage";
import { LoginPage } from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import { AccountPage } from "./page/AccountPage";
import { CheckoutPage } from "./page/CheckoutPage";
import { AdminPage } from "./page/AdminPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role === "USER") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { restore } = useAuthStore();
  useEffect(() => {
    restore();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/pc-builder" element={<PcBuilderPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-bg-card)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
              fontSize: "14px",
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
