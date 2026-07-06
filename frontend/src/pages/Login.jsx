import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Flame, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();
  const location                = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || "/menu");
    } catch {
      setError("Invalid email or password. Please try again.");
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
          <span className="eyebrow mb-2">Welcome back</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-2">Sign in</h1>
          <p className="text-sm text-ink-soft mb-8">
            Pick up where you left off — your cart is waiting.
          </p>

          {error && <div className="error-banner mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2">
              {loading ? "Signing in…" : (<>Sign In <ArrowRight size={18} aria-hidden="true" /></>)}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-paprika hover:text-paprika-600 transition-colors duration-200">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm">
          <Link to="/menu" className="text-ink-soft hover:text-ink transition-colors duration-200">
            ← Just browsing? See the menu
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
