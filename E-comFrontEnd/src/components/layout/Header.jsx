import { useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { getUserProfile } from '../../api/userApi';
import logo from "../../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        // Fetch thông tin user đầy đủ từ API
        fetchUserProfile(decodedToken.id);
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Fetch user profile với avatar
  const fetchUserProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar_url: profile.avatar_url
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin user:", error);
      // Fallback về token decode nếu API lỗi
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          setUser(decodedToken);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
    }
  };

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
    alert('Đã đăng xuất thành công!');
  };

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

          {/* User Menu */}
          {user ? (
            <div className="relative user-menu">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:text-white text-gray-300 transition-colors"
              >
                {user.avatar_url ? (
                  <img
                    src={`http://localhost:3001${user.avatar_url}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <FiUser className={user.avatar_url ? 'hidden' : 'block'} />
                <span className="text-sm hidden lg:block">{user.name || 'User'}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiSettings className="text-sm" />
                    <span>Thông tin cá nhân</span>
                  </Link>
                  <Link
                    to="/ordershistory"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FiShoppingCart className="text-sm" />
                    <span>Lịch sử đơn hàng</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                  >
                    <FiLogOut className="text-sm" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <span className="text-gray-500">|</span>
              <Link
                to="/register"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
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

          {/* User Menu Mobile */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            {user ? (
              <div className="text-center space-y-3">
                <p className="text-gray-300 text-sm">Xin chào, {user.name || 'User'}!</p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-white transition text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link
                    to="/ordershistory"
                    className="text-gray-300 hover:text-white transition text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lịch sử đơn hàng
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-white transition text-sm"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
