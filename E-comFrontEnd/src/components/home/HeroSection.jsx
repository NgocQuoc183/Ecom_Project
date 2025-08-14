import { Link } from "react-router-dom";
import hero from "../../assets/slideshow_1.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-800 to-gray-600 text-white py-24 px-4 md:px-10 font-vintage">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-wide">
            <span className="text-amber-300">ĐẲNG CẤP</span> <br />
            PHONG CÁCH <br />
            BARBERSHOP
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-md">
            Sản phẩm tạo kiểu tóc từ <span className="italic">REUZEL</span> - thương hiệu Hà Lan dành cho quý ông hiện đại.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-amber-400 text-black px-8 py-3 text-sm tracking-widest font-semibold uppercase border-2 border-amber-600 hover:bg-amber-500 hover:border-amber-700 hover:shadow-lg transition-all duration-300"
          >
            MUA NGAY
          </Link>
        </div>

        {/* Right: Image */}
        <div className="flex justify-center relative">
          <img
            src={hero}
            alt="Hero Reuzel"
            className="max-h-[500px] w-auto object-contain rounded-sm drop-shadow-2xl border-2 border-amber-900/50"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;