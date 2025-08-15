-- Thêm dữ liệu mẫu cho bảng reviews
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
-- Reviews cho sản phẩm ID 5 (BLUE POMADE)
(1, 5, 5, 'Sản phẩm tuyệt vời! Giữ nếp rất tốt và có mùi thơm dễ chịu. Tôi đã sử dụng được 3 tháng và rất hài lòng.', '2024-01-15 10:30:00'),
(2, 5, 4, 'Chất lượng tốt, độ bóng vừa phải. Phù hợp với kiểu tóc slick back. Giá hơi cao nhưng xứng đáng.', '2024-01-20 14:15:00'),
(3, 5, 5, 'Đây là pomade tốt nhất tôi từng dùng. Dễ tạo kiểu, giữ nếp cả ngày mà không bị cứng.', '2024-01-25 09:45:00'),
(4, 5, 3, 'Sản phẩm ổn nhưng hơi khó rửa sạch. Cần dùng dầu gội nhiều lần mới hết.', '2024-02-01 16:20:00'),
(5, 5, 4, 'Mùi hương rất thích, độ cứng vừa phải. Sẽ mua lại lần sau.', '2024-02-05 11:10:00'),
(6, 5, 5, 'Blue Pomade thực sự xuất sắc! Tạo kiểu dễ dàng và giữ nếp suốt cả ngày.', '2024-02-08 14:20:00'),
(7, 5, 4, 'Sản phẩm chất lượng cao, đóng gói đẹp. Giao hàng nhanh chóng.', '2024-02-10 09:15:00'),

-- Reviews cho sản phẩm ID 6 (GROOMING TONIC)
(1, 6, 4, 'Grooming Tonic tạo độ ẩm tốt cho tóc trước khi dùng pomade. Sản phẩm bổ trợ hữu ích.', '2024-01-25 12:10:00'),
(8, 6, 5, 'Rất thích sản phẩm này! Giúp tóc dễ tạo kiểu hơn và giữ ẩm tự nhiên.', '2024-02-07 09:25:00'),
(9, 6, 4, 'Tonic rất tốt, làm tóc mềm mại và dễ tạo kiểu. Mùi hương dễ chịu.', '2024-02-12 16:30:00'),
(10, 6, 5, 'Sản phẩm tuyệt vời! Kết hợp với pomade cho hiệu quả tối ưu.', '2024-02-14 11:45:00'),
(11, 6, 3, 'Sản phẩm ổn nhưng giá hơi cao so với công dụng. Vẫn sẽ dùng tiếp.', '2024-02-16 13:20:00'),

-- Reviews cho sản phẩm ID 7 (SURF TONIC)
(2, 7, 5, 'Surf Tonic tạo texture tự nhiên tuyệt vời! Phù hợp cho kiểu tóc beach waves.', '2024-01-17 11:50:00'),
(12, 7, 4, 'Sản phẩm tốt, tạo độ rối tự nhiên cho tóc. Mùi hương biển rất thích.', '2024-02-01 08:15:00'),
(13, 7, 5, 'Surf Tonic giúp tóc có texture tự nhiên như vừa đi biển về. Rất ấn tượng!', '2024-02-09 15:40:00'),
(14, 7, 4, 'Chất lượng tốt, dễ sử dụng. Phù hợp cho những ai thích kiểu tóc tự nhiên.', '2024-02-11 10:25:00'),
(15, 7, 3, 'Sản phẩm ổn nhưng không phù hợp với tóc dày như tôi. Hiệu quả không rõ ràng.', '2024-02-13 14:50:00'),
(16, 7, 5, 'Tuyệt vời! Tạo kiểu tóc surfer boy hoàn hảo. Sẽ mua lại chắc chắn.', '2024-02-15 12:35:00');
