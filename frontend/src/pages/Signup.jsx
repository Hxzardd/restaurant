import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

function Signup() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      if (res.status >= 200 && res.status < 300) {
        navigate("/login");
      } else {
        setError(res.data?.msg || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex bg-sand flex-row-reverse"
    >
      {/* Right side: Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-sage-900/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-5xl font-bold mb-4">Join the family.</h2>
            <p className="text-lg opacity-90 max-w-md">Discover a world of rich flavors and farm-to-table freshness. Create an account to start ordering.</p>
          </motion.div>
        </div>
      </div>

      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-wide text-forest mb-8">
              <span className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                 <UtensilsCrossed size={18} />
              </span>
              Hxzard's
            </Link>
            <h1 className="font-display text-4xl font-bold mb-3 text-forest">
              Join Us
            </h1>
            <p className="text-forest-muted">
              Create an account and start ordering.
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm bg-red-50 border border-red-100 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                Full Name
              </label>
              <input
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2 text-earth">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Creating account…" : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center lg:text-left text-sm text-forest-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-sage-600 hover:text-sage-700 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Signup;
