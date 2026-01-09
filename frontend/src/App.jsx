import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user && <Navbar />}

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
