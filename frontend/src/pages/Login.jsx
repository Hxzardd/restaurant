import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login }               = useContext(AuthContext);
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/menu");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(224,144,64,0.08) 0%, #0f0d0b 70%)",
      }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ border: "1px solid rgba(224,144,64,0.06)" }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ border: "1px solid rgba(224,144,64,0.08)" }}
        />
      </div>

      <div className="relative w-full max-w-md page-fade-in">
        {/* Card */}
        <div
          className="rounded-2xl border p-10"
          style={{ backgroundColor: "#1d1915", borderColor: "#38302a", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <p
              className="font-display text-sm font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#e09040" }}
            >
              Hxzard's Restaurant
            </p>
            <h1
              className="font-display text-5xl font-bold mb-3"
              style={{ color: "#f2ece0", lineHeight: "1.1" }}
            >
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: "#5c4e42" }}>
              Sign in to continue ordering
            </p>
          </div>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg text-sm border"
              style={{ backgroundColor: "rgba(200,90,90,0.1)", borderColor: "rgba(200,90,90,0.25)", color: "#e08080" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a89478" }}>
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
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#a89478" }}>
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
              className="w-full py-3.5 font-semibold rounded-lg transition-all duration-200 active:scale-95 mt-2"
              style={{ backgroundColor: "#e09040", color: "#0f0d0b" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = "#cc7e2e")}
              onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = "#e09040")}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: "#5c4e42" }}>
            No account yet?{" "}
            <Link
              to="/signup"
              className="font-semibold transition-colors duration-200"
              style={{ color: "#e09040" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#cc7e2e")}
              onMouseLeave={e => (e.currentTarget.style.color = "#e09040")}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
