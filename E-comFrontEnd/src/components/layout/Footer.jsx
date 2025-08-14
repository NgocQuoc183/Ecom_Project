import footer_logo from "../../assets/footer_logo.png";


const Footer = () => {
  return (
    <footer className="bg-black/85 text-white text-sm tracking-wide">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo + Info */}
        <div className="space-y-4 text-center md:text-left">
          <img
            src={footer_logo}// Đặt lại đường dẫn nếu cần
            alt="REUZEL"
            className="h-20 mx-auto md:mx-0"
          />
          <p className="leading-relaxed text-xs">
            CÔNG TY TNHH TƯ VẤN LÀM ĐẸP TRỰC TUYẾN<br />
            GPKD số 0109742641 cấp ngày 08/09/2021<br />
            tại Sở Kế hoạch và Đầu tư Hà Nội
          </p>
          <p className="text-xs">
            Địa chỉ: Số 116 Từ Hoa, Phường Quảng An,<br />
            Quận Tây Hồ, Thành phố Hà Nội
          </p>
        </div>

        {/* Về Reuzel */}
        <div className="space-y-2">
          <h3 className="font-bold text-base">VỀ REUZEL</h3>
          <ul className="space-y-1">
            <li>CÂU CHUYỆN</li>
            <li>VĂN HOÁ</li>
            <li>CHỐNG THỬ NGHIỆM ĐỘNG VẬT</li>
            <li>SCHOREM – CÁI NÔI CỦA</li>
            <li>REUZEL POMADE</li>
          </ul>
        </div>

        {/* Bí kíp */}
        <div className="space-y-2">
          <h3 className="font-bold text-base">BÍ KÍP</h3>
          <ul className="space-y-1">
            <li>LOOKBOOK</li>
            <li>VIDEO</li>
          </ul>
        </div>

        {/* Sản phẩm */}
        <div className="space-y-2">
          <h3 className="font-bold text-base">SẢN PHẨM</h3>
          <ul className="space-y-1">
            <li>POMADE</li>
            <li>TẠO KIỂU THẾ HỆ MỚI</li>
            <li>TONIC</li>
            <li>TÓC & TOÀN THÂN</li>
            <li>CẠO RÂU</li>
          </ul>
        </div>

        {/* Mua hàng */}
        <div className="space-y-2">
          <h3 className="font-bold text-base">MUA HÀNG</h3>
          <ul className="space-y-1">
            <li>TÌM KIẾM</li>
            <li>GIỚI THIỆU</li>
            <li>CHÍNH SÁCH ĐỔI TRẢ</li>
            <li>CHÍNH SÁCH BẢO MẬT</li>
            <li>CHÍNH SÁCH GIAO NHẬN</li>
            <li>CHÍNH SÁCH KIỂM HÀNG</li>
            <li>CHÍNH SÁCH THANH TOÁN</li>
            <li>LIÊN HỆ</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
