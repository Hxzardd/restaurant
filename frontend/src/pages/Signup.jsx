import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Flame, ArrowRight } from "lucide-react";

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
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-cream">
      <div className="w-full max-w-md animate-fade-up">
        {/* Brand */}
        <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-ink mb-10">
          <span className="w-8 h-8 rounded-full bg-paprika flex items-center justify-center text-white">
            <Flame size={16} aria-hidden="true" />
          </span>
          Hxzard&rsquo;s
        </Link>

        <div className="card p-8 sm:p-10">
          <span className="eyebrow mb-2">Join us</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">Create account</h1>
          <p className="text-sm text-ink-soft mb-8">
            One account for ordering, tracking, and reordering your favourites.
          </p>

          {error && <div className="error-banner mb-6">{error}</div>}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold tracking-widest uppercase mb-2 text-ink-soft">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading ? "Creating account…" : (<>Create Account <ArrowRight size={18} aria-hidden="true" /></>)}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-paprika hover:text-paprika-600 transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
