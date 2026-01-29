function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Hxzard's Restaurant</h3>
            <p className="text-sm leading-relaxed">Crafted flavours, delivered fresh. Restaurant-quality meals made to order.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Menu</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Orders</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Cart</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Account</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-2 text-sm">
              <p>Email: support@hxzards.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Hours: 10 AM - 10 PM</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm">© {currentYear} Hxzard's Restaurant. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0 text-sm">
              <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
