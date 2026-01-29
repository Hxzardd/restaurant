import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Check if the response is successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        navigate("/");
      } else {
        alert(response.data?.msg || "Signup failed");
      }
    } catch (err) {
      // Only show error if it's actually an error response
      const errorMessage = err.response?.data?.msg || err.message || "Signup failed";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-orange-600 mb-1">Hxzard's Restaurant</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Create Account</h2>
            <p className="text-gray-500 text-sm">Join us and start ordering</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent text-base transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent text-base transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent text-base transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-base mt-8"
            >
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
