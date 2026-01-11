import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import AdminMenu from "./pages/AdminMenu";


function AppContent() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Don't show Navbar on login or signup pages
  const showNavbar = user && location.pathname !== "/" && location.pathname !== "/signup";

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/menu"
          element={user ? <Menu /> : <Navigate to="/" replace />}
        />
        <Route
          path="/cart"
          element={user ? <Cart /> : <Navigate to="/" replace />}
        />
        <Route
          path="/orders"
          element={user ? <Orders /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin/orders"
          element={user ? <AdminOrders /> : <Navigate to="/" replace />}
        />
        <Route
        path="/admin/menu"
        element={user ? <AdminMenu /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
