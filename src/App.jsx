import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Interview from "./pages/Interview/Interview";
import History from "./pages/History/History";
import Pricing from "./pages/Pricing/Pricing";
import Dashboard from "./pages/Dashboard/Dashboard";
import Privacy from "./pages/Privacy/Privacy";
import Terms from "./pages/Terms/Terms";
import Refund from "./pages/Refund/Refund";
import Contact from "./pages/Contact/Contact";
import Shipping from "./pages/Shipping/Shipping";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { initGA, trackPageView, setupClickTracking } from "./services/analytics";

// Component to track page views on route changes
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view whenever the route changes
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Initialize Google Analytics on app mount
    initGA();
    
    // Setup automatic click tracking
    setupClickTracking();
    
    // Track initial page view
    trackPageView(window.location.pathname + window.location.search, document.title);
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/interview" element={<Interview />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping" element={<Shipping />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
