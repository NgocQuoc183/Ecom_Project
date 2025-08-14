import { useState } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "CỬA HÀNG", path: "/shop" },
    { name: "VỀ REUZEL", path: "/about" },
    { name: "BÍ KÍP", path: "/tips" },
    { name: "TÌM KIẾM CỬA HÀNG", path: "/find" },
  ];

  return (
    <header className="bg-black/85 text-white font-vintage text-sm tracking-widest sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center">
          <img src={logo} alt="REUZEL" className="h-8 sm:h-10 object-contain" />
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-4 sm:gap-6 tracking-[0.12em]">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `uppercase transition text-xs sm:text-sm ${
                  isActive ? "text-white font-bold" : "text-gray-300 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Icons - Desktop */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4 text-lg sm:text-xl">
          <Link to="/search" className="hover:text-white text-gray-300">
            <FiSearch />
          </Link>
          <Link to="/cart" className="relative hover:text-white text-gray-300">
            <FiShoppingCart />
            <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] sm:text-xs rounded-full px-1">0</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl sm:text-2xl text-gray-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/85 px-4 pb-4">
          <nav className="flex flex-col gap-3 text-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `uppercase transition text-sm ${
                    isActive ? "text-white font-bold" : "text-gray-300 hover:text-white"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          <div className="flex justify-center gap-6 text-xl mt-4">
            <Link
              to="/search"
              className="hover:text-white text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiSearch />
            </Link>
            <Link
              to="/cart"
              className="relative hover:text-white text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiShoppingCart />
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full px-1">0</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
