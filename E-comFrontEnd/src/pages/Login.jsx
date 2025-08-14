
// import { useState } from "react";
// import { loginUser } from "../api/authApi";
// import { Link } from "react-router-dom"; // Added for navigation
// import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa"; // Added for social icons
// import bg from "../assets/bg_auth.webp";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await loginUser(form);
//     if (res.token) {
//       localStorage.setItem("token", res.token);
//       alert("Đăng nhập thành công!");
//     } else {
//       alert(res.message || "Đăng nhập thất bại.");
//     }
//   };

//   // Placeholder functions for social login (to be integrated with backend)
//   const handleSocialLogin = (platform) => {
//     // Replace with actual backend API calls for social login
//     alert(`Đăng nhập bằng ${platform} đang được triển khai.`);
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex justify-center items-center"
//       style={{ backgroundImage: `url(${bg})` }}
//     >
//       <div className="bg-black/80 p-8 w-full max-w-md rounded shadow-xl text-white font-vintage">
//         <h2 className="text-3xl text-center font-bold mb-6">ĐĂNG NHẬP</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full mb-4 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Mật khẩu"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full mb-6 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
//             required
//           />

//           <button
//             type="submit"
//             className="w-full bg-white text-black py-2 font-semibold hover:bg-gray-200 transition"
//           >
//             Đăng nhập
//           </button>
//         </form>
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển hướng người dùng
import { loginUser } from "../api/authApi"; // Gọi API đăng nhập
import { FaFacebook, FaGoogle, FaInstagram } from "react-icons/fa"; // Các icon mạng xã hội
import bg from "../assets/bg_auth.webp"; // Hình nền đăng nhập
import { Link } from "react-router-dom"; // Import Link để điều hướng đến trang đăng ký

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" }); // Trạng thái form đăng nhập
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi đăng nhập thành công

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Hàm xử lý khi người dùng nhấn nút đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form

    const res = await loginUser(form); // Gọi API đăng nhập với dữ liệu form

    if (res.token) {
      // Lưu token vào localStorage khi đăng nhập thành công
      localStorage.setItem("token", res.token);
      alert("Đăng nhập thành công!");

      // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
      navigate("/"); // Chuyển hướng đến trang chủ ("/")
    } else {
      alert(res.message || "Đăng nhập thất bại.");
    }
  };

  // Hàm đăng nhập qua mạng xã hội (hiện tại chỉ hiển thị thông báo)
  const handleSocialLogin = (platform) => {
    alert(`Đăng nhập bằng ${platform} đang được triển khai.`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }} // Đặt hình nền cho trang đăng nhập
    >
      <div className="bg-black/80 p-8 w-full max-w-md rounded shadow-xl text-white font-vintage">
        <h2 className="text-3xl text-center font-bold mb-6">ĐĂNG NHẬP</h2>

        <form onSubmit={handleSubmit}>
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
            className="w-full mb-6 px-4 py-2 bg-transparent border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-2 font-semibold hover:bg-gray-200 transition"
          >
            Đăng nhập
          </button>
        </form>

        {/* Các nút đăng nhập bằng mạng xã hội */}
        <div className="mt-6">
          <p className="text-center text-gray-400 mb-4">Hoặc đăng nhập bằng</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
              aria-label="Đăng nhập bằng Facebook"
            >
              <FaFacebook size={24} />
            </button>
            <button
              onClick={() => handleSocialLogin("Google")}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
              aria-label="Đăng nhập bằng Google"
            >
              <FaGoogle size={24} />
            </button>
            <button
              onClick={() => handleSocialLogin("Instagram")}
              className="p-2 bg-pink-600 rounded-full hover:bg-pink-700 transition"
              aria-label="Đăng nhập bằng Instagram"
            >
              <FaInstagram size={24} />
            </button>
          </div>
        </div>

        {/* Liên kết đăng ký nếu người dùng chưa có tài khoản */}
        <p className="text-center mt-6 text-gray-400">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-white hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
