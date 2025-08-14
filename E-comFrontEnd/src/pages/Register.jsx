// // src/pages/Register.jsx
// import { useState } from "react";
// import { registerUser } from "../api/authApi";
// import bg from "../assets/bg_auth.webp";

// const Register = () => {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await registerUser(form);
//     alert(res.message || "Đăng ký thành công!");
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex justify-center items-center"
//       style={{ backgroundImage: `url(${bg})` }}
//     >
//       <form onSubmit={handleSubmit} className="bg-black/80 p-8 w-full max-w-md rounded shadow-xl text-white font-vintage">
//         <h2 className="text-3xl text-center font-bold mb-6">TẠO TÀI KHOẢN</h2>

//         <input type="text" name="name" placeholder="Họ tên" value={form.name} onChange={handleChange}
//           className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white" required />

//         <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
//           className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white" required />

//         <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange}
//           className="w-full mb-6 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white" required />

//         <button type="submit" className="w-full bg-white text-black py-2 font-semibold hover:bg-gray-200 transition">
//           Đăng ký
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa";
import bg from "../assets/bg_auth.webp";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(""); // Thêm state để lưu thông báo lỗi

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Xóa lỗi khi người dùng thay đổi input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    const res = await registerUser(form);
    alert(res.message || "Đăng ký thành công!");
  };

  const handleSocialRegister = (platform) => {
    alert(`Đăng ký bằng ${platform} đang được triển khai.`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-black/80 p-8 w-full max-w-md rounded shadow-xl text-white font-vintage">
        <h2 className="text-3xl text-center font-bold mb-6">TẠO TÀI KHOẢN</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black py-2 font-semibold hover:bg-gray-200 transition"
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-400 mb-4">Hoặc đăng ký bằng</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSocialRegister("Facebook")}
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
              aria-label="Đăng ký bằng Facebook"
            >
              <FaFacebook size={24} />
            </button>
            <button
              onClick={() => handleSocialRegister("Google")}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
              aria-label="Đăng ký bằng Google"
            >
              <FaGoogle size={24} />
            </button>
            <button
              onClick={() => handleSocialRegister("Instagram")}
              className="p-2 bg-pink-600 rounded-full hover:bg-pink-700 transition"
              aria-label="Đăng ký bằng Instagram"
            >
              <FaInstagram size={24} />
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-400">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-white hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
