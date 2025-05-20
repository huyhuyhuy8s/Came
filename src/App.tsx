
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Cart from "@/pages/Cart";
import Payment from "@/pages/Payment";
import OrderTracking from "@/pages/OrderTracking";
import Account from "@/pages/Account";
import Support from "@/pages/Support";
import Campaign from "@/pages/Campaign";
import SuccessPage from "@/pages/SuccessPage";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import SupportButton from "@/components/SupportButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="/account" element={<Account />} />
                <Route path="/support" element={<Support />} />
                <Route path="/campaign/:id" element={<Campaign />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <SupportButton />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
