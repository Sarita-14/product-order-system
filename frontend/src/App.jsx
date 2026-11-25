
//Understanding React Router and page navigation
// - added the new pages (Products, Orders, Order details, New order, Customers)
// - logged-in pages are nested under ProtectedRoute + AppLayout, so the
//   login check and the Navbar are written once instead of on every page
// - removed <ReduxCounter /> from here: it was rendered under EVERY page.
//   The component file is kept untouched for learning.

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import OrderDetails from "./pages/OrderDetails";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* ---------- Public pages ---------- */}

        {/* Initially, whenever the user opens the application, Login page is displayed. */}
        <Route path="/" element={<Login />} />

        {/* New users can navigate to the Register page from the Login component. */}
        <Route path="/register" element={<Register />} />

        {/* ---------- Logged-in pages (Navbar + login check) ---------- */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* After successful login, the user is navigated to the Dashboard. */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          {/* "/orders/new" must be a static route so it is not treated as an order id */}
          <Route path="/orders/new" element={<NewOrder />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/customers" element={<Customers />} />
        </Route>

        {/* If the user visits an unknown URL, React displays the NotFound component. */}
        <Route path="*" element={<NotFound />} />

      </Routes>
     {/* Redux Toolkit implementation*/}
     {/* <ReduxCounter /> was rendered here — removed because it showed under every page (see CHANGED note above) */}
    </BrowserRouter>
  );
}

export default App;
