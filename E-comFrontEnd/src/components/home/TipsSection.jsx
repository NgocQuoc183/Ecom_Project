import React from 'react';
import { Link } from 'react-router-dom';

const TipsSection = () => {
  return (
    <section className="bg-[#f5f7ea] py-12 px-4">
    <h2 className="text-3xl font-vintage font-bold text-left mb-10 border-b border-black pb-4 px-4 mx-auto max-w-[60%]">Bí kíp</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hình 1 */}
        <img
          src="https://theme.hstatic.net/200000424613/1000778313/14/section_tips_img_1.jpg?v=1499"
          alt="Kiểu tóc 1"
          className="w-full h-full object-cover"
        />

        {/* Hình 2 */}
        <img
          src="https://theme.hstatic.net/200000424613/1000778313/14/section_tips_img_2.jpg?v=1499"
          alt="Kiểu tóc 2"
          className="w-full h-full object-cover"
        />

        {/* Hình 3 với overlay */}
        <div className="relative group">
          <img
            src="https://theme.hstatic.net/200000424613/1000778313/14/section_tips_img_3.jpg?v=1499"
            alt="Phong cách cổ điển"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40 text-white">
            <p className="text-xl md:text-2xl font-semibold">Phong cách</p>
            <p className="text-3xl md:text-4xl font-bold my-2">CỔ ĐIỂN & HIỆN ĐẠI</p>

            <Link
              to="/lookbook"
              className="mt-6 bg-[#f8e8d2] text-black font-semibold px-4 py-2 border border-black hover:bg-black hover:text-white transition"
            >
              Xem thêm Lookbook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TipsSection;