import React from "react";

// Nhập hình ảnh từ src/assets/categories/
import PomadeImage from "../../assets/categories/pomade.png";
import StylersImage from "../../assets/categories/stylers.jpg";
import TonicImage from "../../assets/categories/tonic.jpg";
import BodycareImage from "../../assets/categories/hairbody.jpg";
import ShaveImage from "../../assets/categories/cream.jpg";

const categories = [
  {
    title: "POMADE",
    image: PomadeImage,
    description:
      "Từ độ giữ nếp vừa đến cao, độ hoàn thiện mờ đến bóng bẩy cho kiểu tóc, chúng tôi có mọi loại Pomade anh em cần.",
  },
  {
    title: "STYLERS",
    image: StylersImage,
    description:
      "Dòng sản phẩm tạo kiểu đa dạng gồm Gel, Cream, Paste, bột tạo kiểu giúp tăng tối đa độ dày và kết cấu tóc, giữ nếp linh hoạt cả ngày dài.",
  },
  {
    title: "TONIC",
    image: TonicImage,
    description:
      "Đừng bỏ qua công đoạn Pre-styling nếu muốn mái tóc có độ phồng chạm nóc!",
  },
  {
    title: "TÓC & TOÀN THÂN",
    image: BodycareImage,
    description:
      "Muốn trông thật ngầu? Trước hết, hãy chăm sóc bản thân và sạch sẽ.",
  },
  {
    title: "CẠO RÂU",
    image: ShaveImage,
    description:
      "Cần cạo hay dưỡng râu? Vào đây là vào việc!",
  },
];

const CategorySection = () => {
  return (
    <section className="bg-[#f4f7de] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-vintage font-bold tracking-wider mb-3">
          Mua hàng
        </h2>
        <div className="border-t border-black w-28 mb-10"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="text-center border border-black p-4 flex flex-col items-center justify-between bg-white hover:shadow-md transition duration-200"
            >
              <h3 className="text-base font-vintage tracking-widest mb-3">
                {cat.title}
              </h3>
              <img
                src={cat.image}
                alt={cat.title}
                className="h-32 w-32 object-contain mb-4"
              />
              <p className="text-sm text-gray-800 leading-relaxed font-mono text-justify">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;