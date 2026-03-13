import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">BookMyDoc</span>
          </Link>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Your trusted healthcare partner. Book appointments with verified doctors and manage your health digitally.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-foreground mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>123 Medical Center Ave</li>
            <li>contact@bookmydoc.com</li>
            <li>+1 (555) 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        Copyright {new Date().getFullYear()} All Rights Reserved &middot; Terms and Conditions &middot; Policy
      </div>
    </div>
  </footer>
);

export default Footer;
