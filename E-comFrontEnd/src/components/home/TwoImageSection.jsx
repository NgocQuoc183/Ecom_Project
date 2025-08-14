import React from "react";
import LeftImage from "../../assets/section_founder_img_1.jpg"; 
import RightImage from "../../assets/section_founder_img_2.jpg";
import RedTextImage from "../../assets/founder_signature.jpg"; 

const TwoImageSection = () => {
  return (
    <section className="bg-gray-100 py-8 sm:py-12 px-4 sm:px-6 min-h-[300px] flex flex-col">
      {/* Container chứa 2 hình ảnh và text ở giữa */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 flex-1 relative max-w-7xl mx-auto">
        {/* Hình bên trái */}
        <div className="w-full sm:w-1/3 flex justify-center mb-4 sm:mb-0">
          <img
            src={LeftImage}
            alt="Left Product"
            className="max-h-48 sm:max-h-56 md:max-h-64 object-contain"
          />
        </div>

        {/* Nội dung text ở giữa */}
        <div className="w-full sm:w-1/3 px-4 text-center relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">REUZEL</h1>
          <p className="text-xs sm:text-sm italic mb-3 sm:mb-4">
            Phát âm "ROO-ZEL". Phải đọc chữ "Z" với giọng thật ngầu và dứt khoát.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Câu chuyện của Reuzel đến từ một con hẻm với hai chàng trai yêu thích nghề cắt tóc nam, 
            đó là Leon & Berris. Cả hai có niềm đam mê lớn lao từ khi còn nhỏ, được sống trong 
            nền văn hóa với nhạc Rock, sự bụi bặm của giới lao động Rotterdam.
          </p>
        </div>

        {/* Hình bên phải */}
        <div className="w-full sm:w-1/3 flex justify-center mt-4 sm:mt-0">
          <img
            src={RightImage}
            alt="Right Product"
            className="max-h-48 sm:max-h-56 md:max-h-64 object-contain"
          />
        </div>

        {/* Hình chữ ký đỏ */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0">
          <img
            src={RedTextImage}
            alt="Red Text"
            className="max-w-[150px] sm:max-w-[200px] h-12 sm:h-16 object-contain opacity-70"
          />
        </div>
      </div>

      {/* Nút Xem thêm */}
      <div className="text-center">
        <button className="border-2 border-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-sm sm:text-base hover:bg-black hover:text-white transition-colors">
          XEM THÊM
        </button>
      </div>
    </section>
  );
};

export default TwoImageSection;