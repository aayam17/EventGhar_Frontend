import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin_dashbaord";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./routes/AdminRoute";

import EventDetails from "./pages/EventDetails";
import HostEvent from "./pages/HostEvent";
import Checkout from "./pages/Checkout";
import Ticket from "./pages/Ticket";
import MyBookings from "./pages/MyBookings";
import ContactUs from "./pages/ContactUs";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/host" element={<HostEvent />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/ticket/:orderId" element={<Ticket />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />

          {/* ADMIN */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
