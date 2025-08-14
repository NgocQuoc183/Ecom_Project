import React from 'react';

const ReuzelTVSection = () => {
  return (
    <section className="bg-[#fdfaf3] py-10 px-4 sm:px-6 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* TV retro */}
        <div className="relative w-full">
          <div className="bg-[#2d2d2d] border-8 border-[#1a1a1a] rounded-xl p-3 sm:p-4 shadow-2xl">
            <div className="bg-[#000] rounded-md overflow-hidden border-4 border-[#3a3a3a]">
              <iframe
                className="w-full h-52 sm:h-64 md:h-72 lg:h-80 xl:h-96"
                src="https://youtu.be/MuCw8Jbw1uE?t=5"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex justify-between mt-3 text-yellow-300 text-xs sm:text-sm font-mono">
              <span>📡 Antenna</span>
              <span>🔘 CH | VOL 🔘</span>
            </div>
          </div>
          <div className="absolute top-[-10px] left-[-10px] bg-yellow-300 text-black text-xs sm:text-sm font-bold px-2 py-1 rounded-full shadow transform rotate-[-10deg]">
            VINTAGE MODE
          </div>
        </div>

        {/* Nội dung bên phải */}
        <div className="w-full flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2b2b2b] mb-4 tracking-tight">
            🎬 REUZEL TV
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5 text-sm sm:text-base">
            Khám phá thế giới tạo kiểu tóc cổ điển – từ những kiểu pompadour huyền thoại đến kỹ thuật tạo kiểu hiện đại. Reuzel không chỉ là sản phẩm, mà là một văn hoá dành cho Barbershop.
          </p>
          <a
            href="#"
            className="inline-block bg-[#c0392b] text-white font-semibold px-5 py-3 text-sm sm:text-base rounded-full hover:bg-[#a93226] transition"
          >
            📺 Xem tất cả Video
          </a>
        </div>

        {/* Kết nối cộng đồng */}
        <div className="col-span-1 lg:col-span-2 mt-10 bg-[#f4e8d5] rounded-xl p-5 sm:p-6 lg:p-8 shadow-md border border-[#e6d5b8]">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 border-b border-gray-600 pb-2">
            🔗 Kết nối với chúng tôi
          </h3>
          <p className="text-gray-800 mb-4 italic text-sm sm:text-base">
            Gia nhập cộng đồng Reuzel – nơi tôn vinh phong cách Barber truyền thống!
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-gray-700 font-medium text-sm sm:text-base">
            <div className="w-full sm:w-1/2">
              📞 Hotline miễn phí: <strong>1800 - 8102</strong>
            </div>
            <div className="w-full sm:w-1/2">🏢 Phím 1: Tư vấn khách hàng & Bán lẻ</div>
            <div className="w-full sm:w-1/2">🏢 Phím 2: Barbershop & Salon chuyên nghiệp</div>
            <div className="w-full sm:w-1/2 flex space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:underline text-blue-700">🔵 Facebook</a>
              <a href="#" className="hover:underline text-pink-600">📷 Instagram</a>
              <a href="#" className="hover:underline text-red-600">▶️ YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReuzelTVSection;
