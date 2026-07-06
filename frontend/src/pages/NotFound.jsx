import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display font-extrabold tracking-tight text-4xl sm:text-5xl mb-4">
        This plate is empty.
      </h1>
      <p className="text-ink-soft text-lg mb-9">
        The page you&rsquo;re looking for doesn&rsquo;t exist — but the menu definitely does.
      </p>
      <Link to="/menu" className="btn-primary px-8 py-3.5">
        Back to the Menu <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default NotFound;
