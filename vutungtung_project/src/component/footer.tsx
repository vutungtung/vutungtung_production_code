import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white bg-black/90 py-10 px-4 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white">
            VUTUNG<span className="text-red">TUNG</span>
          </h1>
          <p className="text-sm text-white mt-2">
            Your trusted partner for vehicle rentals. Safe, reliable, and
            affordable.
          </p>
        </div>

        {/* Services */}
        <div>
          <h2 className="font-semibold mb-2">Services</h2>
          <ul className="space-y-1 text-sm text-white">
            <li>
              <Link to="/car-rental" className="hover:text-red">
                Car Rental
              </Link>
            </li>
            <li>
              <Link to="/bike-rental" className="hover:text-red">
                Bike Rental
              </Link>
            </li>
            <li>
              <Link to="/truck-rental" className="hover:text-red">
                Truck Rental
              </Link>
            </li>
            <li>
              <Link to="/e-vehicle" className="hover:text-red">
                E-Vehicle
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h2 className="font-semibold mb-2">Company</h2>
          <ul className="space-y-1 text-sm text-white">
            <li>
              <Link to="/about" className="hover:text-red">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-red">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-red">
                Support
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-red">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-semibold mb-2">Contact</h2>
          <ul className="space-y-1 text-sm text-white">
            <li>24/7 Support</li>
            <li>+1 (555) 123-4567</li>
            <li>
              <a href="mailto:info@vutungtung.com" className="hover:underline">
                info@vutungtung.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-white mt-8 pt-4 text-center text-white text-sm">
        © 2024 vutungtung. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
