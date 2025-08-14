// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { Swiper, SwiperSlide } from 'swiper/react';
// // import 'swiper/css';
// // import ProductCard from '../ProductCard';

// // const NewestProductsSection = () => {
// //   const [products, setProducts] = useState([]);

// //   useEffect(() => {
// //     axios.get('http://localhost:5000/api/products/newest?limit=6')
// //       .then(res => setProducts(res.data))
// //       .catch(err => console.error('Lỗi khi lấy sản phẩm mới nhất:', err));
// //   }, []);

// //   return (
// //     <section className="bg-[#f5f7ea] py-8 sm:py-12 px-4 text-center">
// //       <h2 className="text-2xl font-vintage font-bold mb-6 sm:mb-8 border-b border-black pb-3">SẢN PHẨM MỚI NHẤT</h2>
// //       <Swiper
// //         spaceBetween={8}
// //         slidesPerView={1}
// //         breakpoints={{
// //           1024: { slidesPerView: 4, spaceBetween: 16 },
// //         }}
// //         loop={true}
// //         className="px-2"
// //       >
// //         {products.map(product => (
// //           <SwiperSlide key={product.id}>
// //             <ProductCard product={product} />
// //           </SwiperSlide>
// //         ))}
// //       </Swiper>
// //     </section>
// //   );
// // };

// // export default NewestProductsSection;
// import React, { useEffect, useState } from 'react';
// import { getNewestProducts } from '../../api/productsApi';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import ProductCard from '../ProductCard';

// const NewestProductsSection = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Gọi API thông qua hàm getNewestProducts
//     const fetchProducts = async () => {
//       const data = await getNewestProducts();
//       setProducts(data);
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <section className="bg-[#f5f7ea] py-8 sm:py-12 px-4 text-center">
//       <h2 className="text-2xl font-vintage font-bold mb-6 sm:mb-8 border-b border-black pb-3">SẢN PHẨM MỚI NHẤT</h2>
//       <Swiper
//         spaceBetween={8}
//         slidesPerView={1}
//         breakpoints={{
//           1024: { slidesPerView: 4, spaceBetween: 16 },
//         }}
//         loop={true}
//         className="px-2"
//       >
//         {products.map(product => (
//           <SwiperSlide key={product.id}>
//             <ProductCard product={product} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// export default NewestProductsSection;
import React, { useEffect, useState } from 'react';
import { getNewestProducts } from '../../api/productsApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductCard from '../ProductCard';

const NewestProductsSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getNewestProducts();
        setProducts(data);
      } catch (err) {
        console.error('Lỗi khi gọi API getNewestProducts:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-full bg-[#f5f7ea] py-8 sm:py-12 px-4 text-center">
      <h2 className="text-2xl font-vintage font-bold mb-6 sm:mb-8 border-b border-black pb-3">
        SẢN PHẨM MỚI NHẤT
      </h2>

      <Swiper
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        loop={true}
        className="!px-2"
      >
        {products.map(product => (
          <SwiperSlide key={product.id} className="flex justify-center">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default NewestProductsSection;


