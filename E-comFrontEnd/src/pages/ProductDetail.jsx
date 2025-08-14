
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [zoomStyle, setZoomStyle] = useState({});

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/products/${id}`)
//       .then((res) => {
//         setProduct(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
//         setError('Không thể tải thông tin sản phẩm');
//         setLoading(false);
//       });
//   }, [id]);

//   const handleMouseMove = (e) => {
//     const { left, top, width, height } = e.target.getBoundingClientRect();
//     const x = ((e.pageX - left) / width) * 100;
//     const y = ((e.pageY - top) / height) * 100;
//     setZoomStyle({
//       transformOrigin: `${x}% ${y}%`,
//       transform: 'scale(1.5)',
//     });
//   };

//   const handleMouseLeave = () => {
//     setZoomStyle({
//       transformOrigin: 'center center',
//       transform: 'scale(1)',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#fefcf5] font-vintage">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
//           <div className="h-4 bg-gray-300 rounded w-32"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#fefcf5] font-vintage">
//         <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-[#c6bca5]">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-[#4b3824] mb-2">Đã xảy ra lỗi</h2>
//           <p className="text-gray-700 mb-6">{error || 'Không tìm thấy sản phẩm'}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="px-6 py-2 bg-[#704214] text-white font-semibold rounded-full hover:bg-[#8a5b35] transition"
//           >
//             Thử lại
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#fefcf5] py-12 px-4 sm:px-6 lg:px-8 font-vintage">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white border border-[#c6bca5] rounded-[1.5rem] shadow-[4px_4px_0px_#a7987b] overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            
//             {/* Hình ảnh sản phẩm */}
//             <div className="relative overflow-hidden rounded-xl">
//               <div 
//                   className="h-72 md:h-80 bg-[#fefcf5] cursor-zoom-in border border-[#d6c9b2] rounded-xl p-2 shadow-inner"
//                   onMouseMove={handleMouseMove}
//                   onMouseLeave={handleMouseLeave}
//                                         >
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-contain rounded-md transition-transform duration-300 ease-in-out"
//                     style={zoomStyle}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "https://via.placeholder.com/600x600?text=Ảnh+sản+phẩm";
//                     }}
//                       />
// </div>
//               {product.discount > 0 && (
//                 <div className="absolute top-4 right-4 bg-[#c0392b] text-white px-4 py-1 rounded-lg text-sm font-bold shadow-md border border-white">
//                   -{product.discount}%
//                 </div>
//               )}
//             </div>

//             {/* Thông tin sản phẩm */}
//             <div className="flex flex-col">
//               <div className="flex-grow">
//                 <div className="mb-4">
//                   <span className="inline-block bg-[#efe6d2] text-[#5a4324] text-xs px-3 py-1 rounded-md uppercase font-semibold tracking-wide border border-[#d2c3a1]">
//                     {product.category_name}
//                   </span>
//                 </div>

//                 <h1 className="text-3xl font-bold text-[#2f1e0e] mb-2">{product.name}</h1>

//                 <div className="flex items-center mb-4">
//                   {product.originalPrice && (
//                     <span className="text-lg text-gray-500 line-through mr-2">
//                       {product.originalPrice.toLocaleString()}đ
//                     </span>
//                   )}
//                   <span className="text-2xl font-extrabold text-[#b03c16]">
//                     {product.price.toLocaleString()}đ
//                   </span>
//                 </div>

//                 <div className="mb-6">
//                   <div className="flex items-center mb-2">
//                     <div className="flex mr-2">
//                       {[...Array(5)].map((_, i) => (
//                         <svg
//                           key={i}
//                           className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                       ))}
//                     </div>
//                     <span className="text-gray-600 text-sm">
//                       {product.reviewCount || 0} đánh giá
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mb-8">
//                   <h3 className="text-lg font-semibold text-[#2f1e0e] mb-2">Mô tả sản phẩm</h3>
//                   <p className="text-[#3e2e1c] leading-relaxed">{product.description}</p>
//                 </div>
//               </div>

//               {/* Nút bấm */}
//               <div className="flex space-x-4 mt-4">
//                 <button className="flex-1 px-6 py-3 bg-[#704214] text-white font-semibold tracking-widest uppercase rounded-full border-2 border-[#704214] hover:bg-transparent hover:text-[#704214] transition-all duration-300">
//                   Thêm vào giỏ
//                 </button>
//                 <button className="flex-1 px-6 py-3 bg-white text-[#704214] font-semibold tracking-widest uppercase rounded-full border-2 border-[#704214] hover:bg-[#704214] hover:text-white transition-all duration-300">
//                   Mua ngay
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../api/cart';
import jwt_decode from 'jwt-decode';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [quantity, setQuantity] = useState(1);

  // Lấy user ID từ token
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  }

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
        setError('Không thể tải thông tin sản phẩm');
        setLoading(false);
      });
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!userId) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    try {
      const response = await addToCart(userId, product.id, quantity);

      if (response.message === 'Thêm sản phẩm vào giỏ hàng thành công!' ||
          response.message === 'Cập nhật số lượng trong giỏ hàng thành công.') {
        alert('Sản phẩm đã được thêm vào giỏ hàng');
      } else {
        alert('Lỗi khi thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      alert('Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  // Hàm xử lý mua ngay
  const handleBuyNow = async () => {
    if (!userId) {
      alert('Vui lòng đăng nhập để mua hàng');
      navigate('/login');
      return;
    }

    try {
      // Thêm vào giỏ hàng trước
      await addToCart(userId, product.id, quantity);
      // Chuyển đến trang thanh toán
      navigate('/cart');
    } catch (error) {
      console.error('Lỗi khi mua ngay:', error);
      alert('Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 mb-6">{error || 'Không tìm thấy sản phẩm'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-amber-800 text-white font-semibold rounded-full hover:bg-amber-900 transition duration-300"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
            {/* Hình ảnh sản phẩm */}
            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="h-80 lg:h-96 bg-gray-50 cursor-zoom-in border border-gray-200 rounded-xl p-4 shadow-sm"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-md transition-transform duration-300 ease-in-out"
                  style={zoomStyle}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/600x600?text=Ảnh+sản+phẩm";
                  }}
                />
              </div>
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex flex-col">
              <div className="flex-grow">
                <div className="mb-4">
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
                    {product.category_name}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                <div className="flex items-center mb-5">
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through mr-3">
                      {product.originalPrice.toLocaleString()}đ
                    </span>
                  )}
                  <span className="text-2xl font-extrabold text-amber-700">
                    {product.price.toLocaleString()} <sup className="text-sm">đ</sup>
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {product.reviewCount || 0} đánh giá
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Chọn số lượng */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Nút bấm */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-amber-800 text-white font-semibold tracking-wide uppercase rounded-full hover:bg-amber-900 transition-all duration-300"
                >
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-white text-amber-800 font-semibold tracking-wide uppercase rounded-full border-2 border-amber-800 hover:bg-amber-800 hover:text-white transition-all duration-300"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;