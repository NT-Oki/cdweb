/*
 Navicat Premium Dump SQL

 Source Server         : tieuluan
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : movie_booking

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 28/05/2025 14:53:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for booking
-- ----------------------------
DROP TABLE IF EXISTS `booking`;
CREATE TABLE `booking`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code_booking` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `date_booking` date NULL DEFAULT NULL,
  `booking_status_id` bigint NULL DEFAULT NULL,
  `showtime_id` bigint NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `total_amount` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKm3d0q9s1hos02eamx9wrsupaq`(`booking_status_id` ASC) USING BTREE,
  INDEX `FKqpvw4sqntugqnqtrwkimyqe4w`(`showtime_id` ASC) USING BTREE,
  INDEX `FKkgseyy7t56x7lkjgu3wah5s3t`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FKkgseyy7t56x7lkjgu3wah5s3t` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKm3d0q9s1hos02eamx9wrsupaq` FOREIGN KEY (`booking_status_id`) REFERENCES `booking_status` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKqpvw4sqntugqnqtrwkimyqe4w` FOREIGN KEY (`showtime_id`) REFERENCES `showtime` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of booking
-- ----------------------------

-- ----------------------------
-- Table structure for booking_seat
-- ----------------------------
DROP TABLE IF EXISTS `booking_seat`;
CREATE TABLE `booking_seat`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `booking_id` bigint NULL DEFAULT NULL,
  `seat_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK3gcy7w2me25kc4qp8nobmg4q6`(`booking_id` ASC) USING BTREE,
  INDEX `FK3y806wtfhomwvu02t1u7u2136`(`seat_id` ASC) USING BTREE,
  CONSTRAINT `FK3gcy7w2me25kc4qp8nobmg4q6` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK3y806wtfhomwvu02t1u7u2136` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of booking_seat
-- ----------------------------

-- ----------------------------
-- Table structure for booking_status
-- ----------------------------
DROP TABLE IF EXISTS `booking_status`;
CREATE TABLE `booking_status`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of booking_status
-- ----------------------------
INSERT INTO `booking_status` VALUES (1, 'Pending');
INSERT INTO `booking_status` VALUES (2, 'Confirmed');
INSERT INTO `booking_status` VALUES (3, 'Cancelled');
INSERT INTO `booking_status` VALUES (4, 'Expired');
INSERT INTO `booking_status` VALUES (5, 'Checked-In');
INSERT INTO `booking_status` VALUES (6, 'Refunded');

-- ----------------------------
-- Table structure for kind_of_film
-- ----------------------------
DROP TABLE IF EXISTS `kind_of_film`;
CREATE TABLE `kind_of_film`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of kind_of_film
-- ----------------------------
INSERT INTO `kind_of_film` VALUES (1, 'Hành động');
INSERT INTO `kind_of_film` VALUES (2, 'Hài hước');
INSERT INTO `kind_of_film` VALUES (3, 'Tình cảm - Lãng mạn');
INSERT INTO `kind_of_film` VALUES (4, 'Kinh dị');
INSERT INTO `kind_of_film` VALUES (5, 'Tâm lý');
INSERT INTO `kind_of_film` VALUES (6, 'Phiêu lưu');
INSERT INTO `kind_of_film` VALUES (7, 'Viễn tưởng');
INSERT INTO `kind_of_film` VALUES (8, 'Hoạt hình');
INSERT INTO `kind_of_film` VALUES (9, 'Gia đình');
INSERT INTO `kind_of_film` VALUES (10, 'Chiến tranh');
INSERT INTO `kind_of_film` VALUES (11, 'Học đường');
INSERT INTO `kind_of_film` VALUES (12, 'Tài liệu');
INSERT INTO `kind_of_film` VALUES (13, 'Tâm linh');
INSERT INTO `kind_of_film` VALUES (14, 'Hình sự - Trinh thám');
INSERT INTO `kind_of_film` VALUES (15, 'Hồi hộp');

-- ----------------------------
-- Table structure for kind_of_movie
-- ----------------------------
DROP TABLE IF EXISTS `kind_of_movie`;
CREATE TABLE `kind_of_movie`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `kind_of_film_id` bigint NOT NULL,
  `movie_id` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKaupy2vsmnyfhnypkb6clsrwdg`(`kind_of_film_id` ASC) USING BTREE,
  INDEX `FKr2j4033iqbyd4vkg7kdr12x4`(`movie_id` ASC) USING BTREE,
  CONSTRAINT `FKaupy2vsmnyfhnypkb6clsrwdg` FOREIGN KEY (`kind_of_film_id`) REFERENCES `kind_of_film` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKr2j4033iqbyd4vkg7kdr12x4` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of kind_of_movie
-- ----------------------------
INSERT INTO `kind_of_movie` VALUES (1, 4, 1);
INSERT INTO `kind_of_movie` VALUES (2, 4, 2);
INSERT INTO `kind_of_movie` VALUES (3, 4, 3);
INSERT INTO `kind_of_movie` VALUES (4, 3, 4);
INSERT INTO `kind_of_movie` VALUES (5, 2, 4);
INSERT INTO `kind_of_movie` VALUES (6, 2, 5);
INSERT INTO `kind_of_movie` VALUES (7, 3, 5);
INSERT INTO `kind_of_movie` VALUES (8, 2, 6);
INSERT INTO `kind_of_movie` VALUES (9, 3, 6);
INSERT INTO `kind_of_movie` VALUES (10, 4, 7);
INSERT INTO `kind_of_movie` VALUES (11, 13, 7);
INSERT INTO `kind_of_movie` VALUES (12, 5, 8);
INSERT INTO `kind_of_movie` VALUES (13, 9, 8);
INSERT INTO `kind_of_movie` VALUES (14, 5, 9);
INSERT INTO `kind_of_movie` VALUES (15, 9, 9);
INSERT INTO `kind_of_movie` VALUES (16, 4, 10);
INSERT INTO `kind_of_movie` VALUES (17, 8, 11);
INSERT INTO `kind_of_movie` VALUES (18, 6, 11);
INSERT INTO `kind_of_movie` VALUES (19, 1, 12);
INSERT INTO `kind_of_movie` VALUES (20, 15, 12);
INSERT INTO `kind_of_movie` VALUES (22, 6, 12);

-- ----------------------------
-- Table structure for movie
-- ----------------------------
DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `director` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `duration_movie` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `name_movie` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `release_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `studio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `trailer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status_movie_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK4ygi2iee6iokm84k6dayard3d`(`status_movie_id` ASC) USING BTREE,
  CONSTRAINT `FK4ygi2iee6iokm84k6dayard3d` FOREIGN KEY (`status_movie_id`) REFERENCES `status_film` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of movie
-- ----------------------------
INSERT INTO `movie` VALUES (1, 'Huỳnh Tú Uyên, Trần Vân Anh, Trần Phong, Nam Nam, Vương Thanh Tùng, Hồ Quang Mẫn, Nguyễn Trung Huy, Hoa Thảo, Raman Quốc Cường', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/4/0/406x600-silent.jpg', 'Lấy cảm hứng từ trò chơi quen thuộc Năm Mười, câu chuyện xoay quanh một nhóm bạn cùng nhau đi nghỉ dưỡng tại Đà Lạt. Chuyến đi tưởng như chữa lành bỗng nhiên trở thành tai hoạ khi họ cùng chơi trò Năm Mười và một bí mật kinh hoàng năm xưa được hé lộ.', 'Tấn Hoàng Thông', '80', 'Năm Mười', '30/05/2025', 'Investra', 'http://youtube.com/watch?v=UQIBqQjXYbo&t=91s', 2);
INSERT INTO `movie` VALUES (2, 'Karen Nguyễn, Kay Trần, Thanh Duy, Nguyên Thảo, Lâm Hoàng Oanh, Mạc Trung Kiên, Nguyễn Hữu Tiến,...', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/d/_/d_i_y_h_-_payoff_poster_-_kc_06062025.jpg', 'Tú liên tục rơi vào vòng xoáy kỳ lạ khi những người cô quen biết dường như đã trở thành một người khác. Tình cờ một thế giới bí ẩn nằm sâu dưới đáy hồ mở ra, nơi bản sao tà ác của con người được hình thành và nuôi dưỡng bởi chấp niệm chưa được hóa giải củ', 'Trần Hữu Tấn', '98', 'Dưới Đáy Hồ', '06/06/2025', 'Production Q và HK Film', 'https://youtu.be/aDpPc-sMThQ', 2);
INSERT INTO `movie` VALUES (3, 'Quốc Trường, Mạc Đăng Khoa, Phương Thanh', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/u/t/utlan_firtlook_simple_layers_cmyk_1_.jpg', 'Sau sự ra đi của cha, Lan (Phương Thanh) về một vùng quê và ở đợ cho nhà ông Danh (Mạc Văn Khoa) - một người đàn ông góa vợ, không con cái. Ngay sau khi bước chân vào căn nhà, Lan phải đối mặt với hàng loạt hiện tượng kỳ dị và những cái chết bí ẩn liên tụ', 'Trần Trọng Dần', '123', 'Út Lan: Oán Linh Giữ Của', '20/06/2025', 'Nhà sản xuất phim kinh dị Việt Nam', 'https://www.youtube.com/watch?v=W3q2kI2q7Yc', 2);
INSERT INTO `movie` VALUES (4, 'Trấn Thành, Lê Giang, Lê Dương Bảo Lâm, Uyển Ân,...', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495btbt.jpg', 'Bộ tứ báo thủ bao gồm Chét-Xi-Cà, Dì Bốn, Cậu Mười Một, Con Kiều chính thức xuất hiện cùng với phi vụ báo thế kỉ. Nghe nói kế hoạch tiếp theo là ở Đà Lạt, liệu bốn báo thủ sẽ quậy Tết tung nóc cỡ nào?', 'Trấn Thành', '132', 'Bộ Tứ Báo Thủ', '29/01/2025', 'rấn Thành Films, Trấn Thành Town và Galaxy Studio', 'https://youtu.be/njfAWzmF6oY', 3);
INSERT INTO `movie` VALUES (5, 'Kaity Nguyễn, Trần Ngọc Vàng, Thanh Sơn', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/m/a/main_social_1_.jpg', 'Yêu Nhầm Bạn Thân kể câu chuyện tình yêu lãng mạn giữa khung cảnh tuyệt đẹp của Việt Nam, từ bờ cát trắng miền Trung đến núi rừng Tây Bắc. Bình An (Kaity Nguyễn), cô gái sống hết mình vì tình yêu, đang hạnh phúc bên bạn trai Vũ Trần (Thanh Sơn), một đạo d', 'Nguyễn Quang Dũng - Diệp Thế Vinh', '106', 'Yêu Nhầm Bạn Thân', '29/01/2025', 'HK Film, Galaxy Studio, KAT House và Trấn Thành Town', 'https://youtu.be/81v_4Fi-DGQ', 3);
INSERT INTO `movie` VALUES (6, 'Thu Trang, Đoàn Thiên Ân, Lê Xuân Tiền, Ma Ran Đô,...', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/n/_/n_h_n_b_c_t_-_payoff_poster_social_-_kc_m_ng_1_t_t_2025.jpg', 'Câu chuyện xoay quanh Vân - cô gái bán bánh mì vô tình gặp phải hai chàng trai trong một tai nạn nhỏ. Làm thế nào khi tiếng sét ái tình đánh một lúc cả ba người? Liệu giữa một chàng trai chững chạc, nam tính và một chàng trai đôi chút ngông nghênh, cool n', 'Thu Trang', '100', 'Nụ Hôn Bạc Tỷ', '29/01/2025', 'Công ty TNHH MTV Ngôi Sao Cineplex BHD Việt Nam', 'https://youtu.be/wr6MeifZCUs', 3);
INSERT INTO `movie` VALUES (7, 'Quang Tuấn, Khả Như, NSƯT Phú Đôn, Vân Dung, NSND Thanh Nam, Hoàng Mèo, Thanh Tân, Trung Ruồi, Kiều Chi,…', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/q/u/qu_nh_p_tr_ng_-_payoff_poster_-_kc_07032025_1_.jpg', 'Phim lấy cảm hứng từ câu chuyện có thật và “truyền thuyết kinh dị nhất về người chết sống lại” - Ở một ngôi làng vùng cao, cặp vợ chồng Quang và Như sống bằng nghề mai táng. Cuộc sống yên bình của họ bị xáo trộn khi phát hiện một cỗ quan tài vô chủ trên m', 'Pom Nguyễn', '121', 'Quỷ Nhập Tràng', '07/03/2025', 'Công ty TNHH AMF', 'https://youtu.be/fQKxDM-hxoU', 3);
INSERT INTO `movie` VALUES (8, 'Huỳnh Lập, Phương Mỹ Chi, NSƯT Hạnh Thuý, NSƯT Huỳnh Đông, Puka, Đào Anh Tuấn, Trung Dân, Kiều Linh, Lê Nam, Chí Tâm, Thanh Thức, Trác Thuý Miêu, Mai Thế Hiệp, NS Mạnh Dung, NSƯT Thanh Dậu, NS Thanh Hiền, Nguyễn Anh Tú,…', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/a/payoff_poster_ngt_master_sneak-2_1_.jpg', 'Nhà Gia Tiên xoay quanh câu chuyện đa góc nhìn về các thế hệ khác nhau trong một gia đình, có hai nhân vật chính là Gia Minh (Huỳnh Lập) và Mỹ Tiên (Phương Mỹ Chi). Trở về căn nhà gia tiên để quay các video “triệu view” trên mạng xã hội, Mỹ Tiên - một nhà', 'Huỳnh Lập', '117', 'Nhà Gia Tiên\n', '21/02/2025', '17 Production', 'https://youtu.be/wfPTz0A23ns', 3);
INSERT INTO `movie` VALUES (9, 'NSƯT Kim Phương, Long Đẹp Trai, NSƯT Tuyết Thu, Quách Ngọc Tuyên, Đoàn Thế Vinh, Hồng Thu, Yuno Bigboi, Anh Tú Wilson, Bảo Ngọc, Tín Nguyễn, Hồ Đông Quan, Cherry Hải My, Rio Hạo Nhiên,…', 'NSƯT Kim Phương, Long Đẹp Trai, NSƯT Tuyết Thu, Quách Ngọc Tuyên, Đoàn Thế Vinh, Hồng Thu, Yuno Bigboi, Anh Tú Wilson, Bảo Ngọc, Tín Nguyễn, Hồ Đông Quan, Cherry Hải My, Rio Hạo Nhiên,…', 'Một bộ phim về sự khác biệt quan điểm giữa ba thế hệ ông bà cha mẹ con cháu. Ai cũng đúng ở góc nhìn của mình nhưng đứng trước hoài bão của tuổi trẻ, cuối cùng thì ai sẽ là người phải nghe theo người còn lại? Và nếu ước mơ của những đứa trẻ bị cho là viển', 'Lý Hải', '135', 'Lật Mặt 8: Vòng Tay Trắng', '30/04/2025', 'Lý Hải Production', 'https://youtu.be/hUlBTt3NyGI', 1);
INSERT INTO `movie` VALUES (10, 'Quốc Huy, Đinh Ngọc Diệp, Quốc Anh, Minh Anh, Anh Phạm,', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/t/t/ttk_poster_official_fa_1638x2048px_1_.jpg', 'Thám Tử Kiên là một nhân vật được yêu thích trong tác phẩm điện của ăn khách của NGƯỜI VỢ CUỐI CÙNG của Victor Vũ, Thám Tử Kiên: Kỳ Không Đầu sẽ là một phim Victor Vũ trở về với thể loại sở trường Kinh Dị - Trinh Thám sau những tác phẩm tình cảm lãng mạn ', 'Victor Vũ', '131', 'Thám Tử Kiên: Kỳ Án Không Đầu', '28/04/2025', 'Galaxy Studio và November Films', 'https://youtu.be/QiXNbEKF3U0', 1);
INSERT INTO `movie` VALUES (11, 'Wasabi Mizuta, Megumi Ôhara, Yumi Kakazu, Subaru Kimura, Tomokazu Seki,...', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/c/o/copy_of_250220_dr25_main_b1_localized_embbed_1_.jpg', 'Thông qua món bảo bối mới của Doraemon, cả nhóm bạn bước thế giới trong một bức tranh nổi tiếng và bắt gặp cô bạn bí ẩn tên Claire. Với lời mời của Claire, cả nhóm cùng đến thăm vương quốc Artoria, nơi ẩn giấu một viên ngọc quý mang tên Artoria Blue đang ', 'Yukiyo Teramoto', '105', 'Phim Điện Ảnh Doraemon: Nobita và Cuộc Phiêu Lưu Vào Thế Giới Trong Tranh', '23/05/2025', 'Shin-Ei Animation, TV Asahi và ADK', 'https://youtu.be/Bz0zCdNBj1Q', 1);
INSERT INTO `movie` VALUES (12, 'Tom Cruise', 'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/m/i/mi8_poster_470x700_1.jpg', 'Cuộc đời là tất thảy những lựa chọn. Tom Cruise thủ vai Ethan Hunt trở lại trong Nhiệm Vụ: Bất Khả Thi – Nghiệp Báo Cuối Cùng.', 'Christopher McQuarrie', '168', 'Nhiệm vụ: Bất khả thi - Nghiệp báo cuối cùng', '30/05/2025', 'Paramount Pictures', 'https://youtu.be/no2HdwAX8jI', 1);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'ROLE_USER');
INSERT INTO `role` VALUES (2, 'ROLE_ADMIN');

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quantity_seat` int NOT NULL,
  `room_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES (1, 'Phòng chiếu tiêu chuẩn với màn hình lớn và hệ thống âm thanh Dolby', 101, 'Standard Room 1', '1', 45000);
INSERT INTO `room` VALUES (2, 'Phòng chiếu tiêu chuẩn với màn hình lớn và hệ thống âm thanh Dolby', 101, 'Standard Room 2', '2', 45000);
INSERT INTO `room` VALUES (3, 'Phòng chiếu tiêu chuẩn với màn hình lớn và hệ thống âm thanh Dolby', 101, 'Standard Room 3', '2', 45000);
INSERT INTO `room` VALUES (4, 'Phòng chiếu tiêu chuẩn với màn hình lớn và hệ thống âm thanh Dolby', 120, 'Standard Room 4', '1', 45000);

-- ----------------------------
-- Table structure for seat
-- ----------------------------
DROP TABLE IF EXISTS `seat`;
CREATE TABLE `seat`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `seat_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `room_id` bigint NULL DEFAULT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKd7f42843rt05tt66t6vcb7s9u`(`room_id` ASC) USING BTREE,
  CONSTRAINT `FKd7f42843rt05tt66t6vcb7s9u` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 421 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of seat
-- ----------------------------
INSERT INTO `seat` VALUES (1, 'ghế thường', 'A1', 1, 70000);
INSERT INTO `seat` VALUES (2, 'ghế thường', 'A2', 1, 70000);
INSERT INTO `seat` VALUES (3, 'ghế thường', 'A3', 1, 70000);
INSERT INTO `seat` VALUES (4, 'ghế thường', 'A4', 1, 70000);
INSERT INTO `seat` VALUES (5, 'ghế thường', 'A5', 1, 70000);
INSERT INTO `seat` VALUES (6, 'ghế thường', 'A6', 1, 70000);
INSERT INTO `seat` VALUES (7, 'ghế thường', 'A7', 1, 70000);
INSERT INTO `seat` VALUES (8, 'ghế thường', 'A8', 1, 70000);
INSERT INTO `seat` VALUES (9, 'ghế thường', 'A9', 1, 70000);
INSERT INTO `seat` VALUES (10, 'ghế thường', 'A10', 1, 70000);
INSERT INTO `seat` VALUES (11, 'ghế thường', 'A11', 1, 70000);
INSERT INTO `seat` VALUES (12, 'ghế thường', 'A12', 1, 70000);
INSERT INTO `seat` VALUES (13, 'ghế thường', 'B1', 1, 70000);
INSERT INTO `seat` VALUES (14, 'ghế thường', 'B2', 1, 70000);
INSERT INTO `seat` VALUES (15, 'ghế thường', 'B3', 1, 70000);
INSERT INTO `seat` VALUES (16, 'ghế thường', 'B4', 1, 70000);
INSERT INTO `seat` VALUES (17, 'ghế thường', 'B5', 1, 70000);
INSERT INTO `seat` VALUES (18, 'ghế thường', 'B6', 1, 70000);
INSERT INTO `seat` VALUES (19, 'ghế thường', 'B7', 1, 70000);
INSERT INTO `seat` VALUES (20, 'ghế thường', 'B8', 1, 70000);
INSERT INTO `seat` VALUES (21, 'ghế thường', 'B9', 1, 70000);
INSERT INTO `seat` VALUES (22, 'ghế thường', 'B10', 1, 70000);
INSERT INTO `seat` VALUES (23, 'ghế thường', 'B11', 1, 70000);
INSERT INTO `seat` VALUES (24, 'ghế thường', 'B12', 1, 70000);
INSERT INTO `seat` VALUES (25, 'ghế thường', 'C1', 1, 70000);
INSERT INTO `seat` VALUES (26, 'ghế thường', 'C2', 1, 70000);
INSERT INTO `seat` VALUES (27, 'ghế thường', 'C3', 1, 70000);
INSERT INTO `seat` VALUES (28, 'ghế thường', 'C4', 1, 70000);
INSERT INTO `seat` VALUES (29, 'ghế thường', 'C5', 1, 70000);
INSERT INTO `seat` VALUES (30, 'ghế thường', 'C6', 1, 70000);
INSERT INTO `seat` VALUES (31, 'ghế thường', 'C7', 1, 70000);
INSERT INTO `seat` VALUES (32, 'ghế thường', 'C8', 1, 70000);
INSERT INTO `seat` VALUES (33, 'ghế thường', 'C9', 1, 70000);
INSERT INTO `seat` VALUES (34, 'ghế thường', 'C10', 1, 70000);
INSERT INTO `seat` VALUES (35, 'ghế thường', 'C11', 1, 70000);
INSERT INTO `seat` VALUES (36, 'ghế thường', 'C12', 1, 70000);
INSERT INTO `seat` VALUES (37, 'ghế thường', 'D1', 1, 70000);
INSERT INTO `seat` VALUES (38, 'ghế thường', 'D2', 1, 70000);
INSERT INTO `seat` VALUES (39, 'ghế thường', 'D3', 1, 70000);
INSERT INTO `seat` VALUES (40, 'ghế thường', 'D4', 1, 70000);
INSERT INTO `seat` VALUES (41, 'ghế thường', 'D5', 1, 70000);
INSERT INTO `seat` VALUES (42, 'ghế thường', 'D6', 1, 70000);
INSERT INTO `seat` VALUES (43, 'ghế thường', 'D7', 1, 70000);
INSERT INTO `seat` VALUES (44, 'ghế thường', 'D8', 1, 70000);
INSERT INTO `seat` VALUES (45, 'ghế thường', 'D9', 1, 70000);
INSERT INTO `seat` VALUES (46, 'ghế thường', 'D10', 1, 70000);
INSERT INTO `seat` VALUES (47, 'ghế thường', 'D11', 1, 70000);
INSERT INTO `seat` VALUES (48, 'ghế thường', 'D12', 1, 70000);
INSERT INTO `seat` VALUES (49, 'ghế thường', 'E1', 1, 70000);
INSERT INTO `seat` VALUES (50, 'ghế thường', 'E2', 1, 70000);
INSERT INTO `seat` VALUES (51, 'ghế thường', 'E3', 1, 70000);
INSERT INTO `seat` VALUES (52, 'ghế thường', 'E4', 1, 70000);
INSERT INTO `seat` VALUES (53, 'ghế thường', 'E5', 1, 70000);
INSERT INTO `seat` VALUES (54, 'ghế thường', 'E6', 1, 70000);
INSERT INTO `seat` VALUES (55, 'ghế thường', 'E7', 1, 70000);
INSERT INTO `seat` VALUES (56, 'ghế thường', 'E8', 1, 70000);
INSERT INTO `seat` VALUES (57, 'ghế thường', 'E9', 1, 70000);
INSERT INTO `seat` VALUES (58, 'ghế thường', 'E10', 1, 70000);
INSERT INTO `seat` VALUES (59, 'ghế thường', 'E11', 1, 70000);
INSERT INTO `seat` VALUES (60, 'ghế thường', 'E12', 1, 70000);
INSERT INTO `seat` VALUES (61, 'ghế thường', 'F1', 1, 70000);
INSERT INTO `seat` VALUES (62, 'ghế thường', 'F2', 1, 70000);
INSERT INTO `seat` VALUES (63, 'ghế thường', 'F3', 1, 70000);
INSERT INTO `seat` VALUES (64, 'ghế thường', 'F4', 1, 70000);
INSERT INTO `seat` VALUES (65, 'ghế thường', 'F5', 1, 70000);
INSERT INTO `seat` VALUES (66, 'ghế thường', 'F6', 1, 70000);
INSERT INTO `seat` VALUES (67, 'ghế thường', 'F7', 1, 70000);
INSERT INTO `seat` VALUES (68, 'ghế thường', 'F8', 1, 70000);
INSERT INTO `seat` VALUES (69, 'ghế thường', 'F9', 1, 70000);
INSERT INTO `seat` VALUES (70, 'ghế thường', 'F10', 1, 70000);
INSERT INTO `seat` VALUES (71, 'ghế thường', 'F11', 1, 70000);
INSERT INTO `seat` VALUES (72, 'ghế thường', 'F12', 1, 70000);
INSERT INTO `seat` VALUES (73, 'ghế thường', 'G1', 1, 70000);
INSERT INTO `seat` VALUES (74, 'ghế thường', 'G2', 1, 70000);
INSERT INTO `seat` VALUES (75, 'ghế thường', 'G3', 1, 70000);
INSERT INTO `seat` VALUES (76, 'ghế thường', 'G4', 1, 70000);
INSERT INTO `seat` VALUES (77, 'ghế thường', 'G5', 1, 70000);
INSERT INTO `seat` VALUES (78, 'ghế thường', 'G6', 1, 70000);
INSERT INTO `seat` VALUES (79, 'ghế thường', 'G7', 1, 70000);
INSERT INTO `seat` VALUES (80, 'ghế thường', 'G8', 1, 70000);
INSERT INTO `seat` VALUES (81, 'ghế thường', 'G9', 1, 70000);
INSERT INTO `seat` VALUES (82, 'ghế thường', 'G10', 1, 70000);
INSERT INTO `seat` VALUES (83, 'ghế thường', 'G11', 1, 70000);
INSERT INTO `seat` VALUES (84, 'ghế thường', 'G12', 1, 70000);
INSERT INTO `seat` VALUES (85, 'ghế thường', 'H1', 1, 70000);
INSERT INTO `seat` VALUES (86, 'ghế thường', 'H2', 1, 70000);
INSERT INTO `seat` VALUES (87, 'ghế thường', 'H3', 1, 70000);
INSERT INTO `seat` VALUES (88, 'ghế thường', 'H4', 1, 70000);
INSERT INTO `seat` VALUES (89, 'ghế thường', 'H5', 1, 70000);
INSERT INTO `seat` VALUES (90, 'ghế thường', 'H6', 1, 70000);
INSERT INTO `seat` VALUES (91, 'ghế thường', 'H7', 1, 70000);
INSERT INTO `seat` VALUES (92, 'ghế thường', 'H8', 1, 70000);
INSERT INTO `seat` VALUES (93, 'ghế thường', 'H9', 1, 70000);
INSERT INTO `seat` VALUES (94, 'ghế thường', 'H10', 1, 70000);
INSERT INTO `seat` VALUES (95, 'ghế thường', 'H11', 1, 70000);
INSERT INTO `seat` VALUES (96, 'ghế thường', 'H12', 1, 70000);
INSERT INTO `seat` VALUES (97, 'ghế đôi', 'I1', 1, 135000);
INSERT INTO `seat` VALUES (98, 'ghế đôi', 'I2', 1, 135000);
INSERT INTO `seat` VALUES (99, 'ghế đôi', 'I3', 1, 135000);
INSERT INTO `seat` VALUES (100, 'ghế đôi', 'I4', 1, 135000);
INSERT INTO `seat` VALUES (101, 'ghế đôi', 'I5', 1, 135000);
INSERT INTO `seat` VALUES (102, 'ghế thường', 'A1', 2, 70000);
INSERT INTO `seat` VALUES (103, 'ghế thường', 'A2', 2, 70000);
INSERT INTO `seat` VALUES (104, 'ghế thường', 'A3', 2, 70000);
INSERT INTO `seat` VALUES (105, 'ghế thường', 'A4', 2, 70000);
INSERT INTO `seat` VALUES (106, 'ghế thường', 'A5', 2, 70000);
INSERT INTO `seat` VALUES (107, 'ghế thường', 'A6', 2, 70000);
INSERT INTO `seat` VALUES (108, 'ghế thường', 'A7', 2, 70000);
INSERT INTO `seat` VALUES (109, 'ghế thường', 'A8', 2, 70000);
INSERT INTO `seat` VALUES (110, 'ghế thường', 'A9', 2, 70000);
INSERT INTO `seat` VALUES (111, 'ghế thường', 'A10', 2, 70000);
INSERT INTO `seat` VALUES (112, 'ghế thường', 'A11', 2, 70000);
INSERT INTO `seat` VALUES (113, 'ghế thường', 'A12', 2, 70000);
INSERT INTO `seat` VALUES (114, 'ghế thường', 'B1', 2, 70000);
INSERT INTO `seat` VALUES (115, 'ghế thường', 'B2', 2, 70000);
INSERT INTO `seat` VALUES (116, 'ghế thường', 'B3', 2, 70000);
INSERT INTO `seat` VALUES (117, 'ghế thường', 'B4', 2, 70000);
INSERT INTO `seat` VALUES (118, 'ghế thường', 'B5', 2, 70000);
INSERT INTO `seat` VALUES (119, 'ghế thường', 'B6', 2, 70000);
INSERT INTO `seat` VALUES (120, 'ghế thường', 'B7', 2, 70000);
INSERT INTO `seat` VALUES (121, 'ghế thường', 'B8', 2, 70000);
INSERT INTO `seat` VALUES (122, 'ghế thường', 'B9', 2, 70000);
INSERT INTO `seat` VALUES (123, 'ghế thường', 'B10', 2, 70000);
INSERT INTO `seat` VALUES (124, 'ghế thường', 'B11', 2, 70000);
INSERT INTO `seat` VALUES (125, 'ghế thường', 'B12', 2, 70000);
INSERT INTO `seat` VALUES (126, 'ghế thường', 'C1', 2, 70000);
INSERT INTO `seat` VALUES (127, 'ghế thường', 'C2', 2, 70000);
INSERT INTO `seat` VALUES (128, 'ghế thường', 'C3', 2, 70000);
INSERT INTO `seat` VALUES (129, 'ghế thường', 'C4', 2, 70000);
INSERT INTO `seat` VALUES (130, 'ghế thường', 'C5', 2, 70000);
INSERT INTO `seat` VALUES (131, 'ghế thường', 'C6', 2, 70000);
INSERT INTO `seat` VALUES (132, 'ghế thường', 'C7', 2, 70000);
INSERT INTO `seat` VALUES (133, 'ghế thường', 'C8', 2, 70000);
INSERT INTO `seat` VALUES (134, 'ghế thường', 'C9', 2, 70000);
INSERT INTO `seat` VALUES (135, 'ghế thường', 'C10', 2, 70000);
INSERT INTO `seat` VALUES (136, 'ghế thường', 'C11', 2, 70000);
INSERT INTO `seat` VALUES (137, 'ghế thường', 'C12', 2, 70000);
INSERT INTO `seat` VALUES (138, 'ghế thường', 'D1', 2, 70000);
INSERT INTO `seat` VALUES (139, 'ghế thường', 'D2', 2, 70000);
INSERT INTO `seat` VALUES (140, 'ghế thường', 'D3', 2, 70000);
INSERT INTO `seat` VALUES (141, 'ghế thường', 'D4', 2, 70000);
INSERT INTO `seat` VALUES (142, 'ghế thường', 'D5', 2, 70000);
INSERT INTO `seat` VALUES (143, 'ghế thường', 'D6', 2, 70000);
INSERT INTO `seat` VALUES (144, 'ghế thường', 'D7', 2, 70000);
INSERT INTO `seat` VALUES (145, 'ghế thường', 'D8', 2, 70000);
INSERT INTO `seat` VALUES (146, 'ghế thường', 'D9', 2, 70000);
INSERT INTO `seat` VALUES (147, 'ghế thường', 'D10', 2, 70000);
INSERT INTO `seat` VALUES (148, 'ghế thường', 'D11', 2, 70000);
INSERT INTO `seat` VALUES (149, 'ghế thường', 'D12', 2, 70000);
INSERT INTO `seat` VALUES (150, 'ghế thường', 'E1', 2, 70000);
INSERT INTO `seat` VALUES (151, 'ghế thường', 'E2', 2, 70000);
INSERT INTO `seat` VALUES (152, 'ghế thường', 'E3', 2, 70000);
INSERT INTO `seat` VALUES (153, 'ghế thường', 'E4', 2, 70000);
INSERT INTO `seat` VALUES (154, 'ghế thường', 'E5', 2, 70000);
INSERT INTO `seat` VALUES (155, 'ghế thường', 'E6', 2, 70000);
INSERT INTO `seat` VALUES (156, 'ghế thường', 'E7', 2, 70000);
INSERT INTO `seat` VALUES (157, 'ghế thường', 'E8', 2, 70000);
INSERT INTO `seat` VALUES (158, 'ghế thường', 'E9', 2, 70000);
INSERT INTO `seat` VALUES (159, 'ghế thường', 'E10', 2, 70000);
INSERT INTO `seat` VALUES (160, 'ghế thường', 'E11', 2, 70000);
INSERT INTO `seat` VALUES (161, 'ghế thường', 'E12', 2, 70000);
INSERT INTO `seat` VALUES (162, 'ghế thường', 'F1', 2, 70000);
INSERT INTO `seat` VALUES (163, 'ghế thường', 'F2', 2, 70000);
INSERT INTO `seat` VALUES (164, 'ghế thường', 'F3', 2, 70000);
INSERT INTO `seat` VALUES (165, 'ghế thường', 'F4', 2, 70000);
INSERT INTO `seat` VALUES (166, 'ghế thường', 'F5', 2, 70000);
INSERT INTO `seat` VALUES (167, 'ghế thường', 'F6', 2, 70000);
INSERT INTO `seat` VALUES (168, 'ghế thường', 'F7', 2, 70000);
INSERT INTO `seat` VALUES (169, 'ghế thường', 'F8', 2, 70000);
INSERT INTO `seat` VALUES (170, 'ghế thường', 'F9', 2, 70000);
INSERT INTO `seat` VALUES (171, 'ghế thường', 'F10', 2, 70000);
INSERT INTO `seat` VALUES (172, 'ghế thường', 'F11', 2, 70000);
INSERT INTO `seat` VALUES (173, 'ghế thường', 'F12', 2, 70000);
INSERT INTO `seat` VALUES (174, 'ghế thường', 'G1', 2, 70000);
INSERT INTO `seat` VALUES (175, 'ghế thường', 'G2', 2, 70000);
INSERT INTO `seat` VALUES (176, 'ghế thường', 'G3', 2, 70000);
INSERT INTO `seat` VALUES (177, 'ghế thường', 'G4', 2, 70000);
INSERT INTO `seat` VALUES (178, 'ghế thường', 'G5', 2, 70000);
INSERT INTO `seat` VALUES (179, 'ghế thường', 'G6', 2, 70000);
INSERT INTO `seat` VALUES (180, 'ghế thường', 'G7', 2, 70000);
INSERT INTO `seat` VALUES (181, 'ghế thường', 'G8', 2, 70000);
INSERT INTO `seat` VALUES (182, 'ghế thường', 'G9', 2, 70000);
INSERT INTO `seat` VALUES (183, 'ghế thường', 'G10', 2, 70000);
INSERT INTO `seat` VALUES (184, 'ghế thường', 'G11', 2, 70000);
INSERT INTO `seat` VALUES (185, 'ghế thường', 'G12', 2, 70000);
INSERT INTO `seat` VALUES (186, 'ghế thường', 'H1', 2, 70000);
INSERT INTO `seat` VALUES (187, 'ghế thường', 'H2', 2, 70000);
INSERT INTO `seat` VALUES (188, 'ghế thường', 'H3', 2, 70000);
INSERT INTO `seat` VALUES (189, 'ghế thường', 'H4', 2, 70000);
INSERT INTO `seat` VALUES (190, 'ghế thường', 'H5', 2, 70000);
INSERT INTO `seat` VALUES (191, 'ghế thường', 'H6', 2, 70000);
INSERT INTO `seat` VALUES (192, 'ghế thường', 'H7', 2, 70000);
INSERT INTO `seat` VALUES (193, 'ghế thường', 'H8', 2, 70000);
INSERT INTO `seat` VALUES (194, 'ghế thường', 'H9', 2, 70000);
INSERT INTO `seat` VALUES (195, 'ghế thường', 'H10', 2, 70000);
INSERT INTO `seat` VALUES (196, 'ghế thường', 'H11', 2, 70000);
INSERT INTO `seat` VALUES (197, 'ghế thường', 'H12', 2, 70000);
INSERT INTO `seat` VALUES (198, 'ghế đôi', 'I1', 2, 135000);
INSERT INTO `seat` VALUES (199, 'ghế đôi', 'I2', 2, 135000);
INSERT INTO `seat` VALUES (200, 'ghế đôi', 'I3', 2, 135000);
INSERT INTO `seat` VALUES (201, 'ghế đôi', 'I4', 2, 135000);
INSERT INTO `seat` VALUES (202, 'ghế đôi', 'I5', 2, 135000);
INSERT INTO `seat` VALUES (203, 'ghế thường', 'A1', 3, 70000);
INSERT INTO `seat` VALUES (204, 'ghế thường', 'A2', 3, 70000);
INSERT INTO `seat` VALUES (205, 'ghế thường', 'A3', 3, 70000);
INSERT INTO `seat` VALUES (206, 'ghế thường', 'A4', 3, 70000);
INSERT INTO `seat` VALUES (207, 'ghế thường', 'A5', 3, 70000);
INSERT INTO `seat` VALUES (208, 'ghế thường', 'A6', 3, 70000);
INSERT INTO `seat` VALUES (209, 'ghế thường', 'A7', 3, 70000);
INSERT INTO `seat` VALUES (210, 'ghế thường', 'A8', 3, 70000);
INSERT INTO `seat` VALUES (211, 'ghế thường', 'A9', 3, 70000);
INSERT INTO `seat` VALUES (212, 'ghế thường', 'A10', 3, 70000);
INSERT INTO `seat` VALUES (213, 'ghế thường', 'A11', 3, 70000);
INSERT INTO `seat` VALUES (214, 'ghế thường', 'A12', 3, 70000);
INSERT INTO `seat` VALUES (215, 'ghế thường', 'B1', 3, 70000);
INSERT INTO `seat` VALUES (216, 'ghế thường', 'B2', 3, 70000);
INSERT INTO `seat` VALUES (217, 'ghế thường', 'B3', 3, 70000);
INSERT INTO `seat` VALUES (218, 'ghế thường', 'B4', 3, 70000);
INSERT INTO `seat` VALUES (219, 'ghế thường', 'B5', 3, 70000);
INSERT INTO `seat` VALUES (220, 'ghế thường', 'B6', 3, 70000);
INSERT INTO `seat` VALUES (221, 'ghế thường', 'B7', 3, 70000);
INSERT INTO `seat` VALUES (222, 'ghế thường', 'B8', 3, 70000);
INSERT INTO `seat` VALUES (223, 'ghế thường', 'B9', 3, 70000);
INSERT INTO `seat` VALUES (224, 'ghế thường', 'B10', 3, 70000);
INSERT INTO `seat` VALUES (225, 'ghế thường', 'B11', 3, 70000);
INSERT INTO `seat` VALUES (226, 'ghế thường', 'B12', 3, 70000);
INSERT INTO `seat` VALUES (227, 'ghế thường', 'C1', 3, 70000);
INSERT INTO `seat` VALUES (228, 'ghế thường', 'C2', 3, 70000);
INSERT INTO `seat` VALUES (229, 'ghế thường', 'C3', 3, 70000);
INSERT INTO `seat` VALUES (230, 'ghế thường', 'C4', 3, 70000);
INSERT INTO `seat` VALUES (231, 'ghế thường', 'C5', 3, 70000);
INSERT INTO `seat` VALUES (232, 'ghế thường', 'C6', 3, 70000);
INSERT INTO `seat` VALUES (233, 'ghế thường', 'C7', 3, 70000);
INSERT INTO `seat` VALUES (234, 'ghế thường', 'C8', 3, 70000);
INSERT INTO `seat` VALUES (235, 'ghế thường', 'C9', 3, 70000);
INSERT INTO `seat` VALUES (236, 'ghế thường', 'C10', 3, 70000);
INSERT INTO `seat` VALUES (237, 'ghế thường', 'C11', 3, 70000);
INSERT INTO `seat` VALUES (238, 'ghế thường', 'C12', 3, 70000);
INSERT INTO `seat` VALUES (239, 'ghế thường', 'D1', 3, 70000);
INSERT INTO `seat` VALUES (240, 'ghế thường', 'D2', 3, 70000);
INSERT INTO `seat` VALUES (241, 'ghế thường', 'D3', 3, 70000);
INSERT INTO `seat` VALUES (242, 'ghế thường', 'D4', 3, 70000);
INSERT INTO `seat` VALUES (243, 'ghế thường', 'D5', 3, 70000);
INSERT INTO `seat` VALUES (244, 'ghế thường', 'D6', 3, 70000);
INSERT INTO `seat` VALUES (245, 'ghế thường', 'D7', 3, 70000);
INSERT INTO `seat` VALUES (246, 'ghế thường', 'D8', 3, 70000);
INSERT INTO `seat` VALUES (247, 'ghế thường', 'D9', 3, 70000);
INSERT INTO `seat` VALUES (248, 'ghế thường', 'D10', 3, 70000);
INSERT INTO `seat` VALUES (249, 'ghế thường', 'D11', 3, 70000);
INSERT INTO `seat` VALUES (250, 'ghế thường', 'D12', 3, 70000);
INSERT INTO `seat` VALUES (251, 'ghế thường', 'E1', 3, 70000);
INSERT INTO `seat` VALUES (252, 'ghế thường', 'E2', 3, 70000);
INSERT INTO `seat` VALUES (253, 'ghế thường', 'E3', 3, 70000);
INSERT INTO `seat` VALUES (254, 'ghế thường', 'E4', 3, 70000);
INSERT INTO `seat` VALUES (255, 'ghế thường', 'E5', 3, 70000);
INSERT INTO `seat` VALUES (256, 'ghế thường', 'E6', 3, 70000);
INSERT INTO `seat` VALUES (257, 'ghế thường', 'E7', 3, 70000);
INSERT INTO `seat` VALUES (258, 'ghế thường', 'E8', 3, 70000);
INSERT INTO `seat` VALUES (259, 'ghế thường', 'E9', 3, 70000);
INSERT INTO `seat` VALUES (260, 'ghế thường', 'E10', 3, 70000);
INSERT INTO `seat` VALUES (261, 'ghế thường', 'E11', 3, 70000);
INSERT INTO `seat` VALUES (262, 'ghế thường', 'E12', 3, 70000);
INSERT INTO `seat` VALUES (263, 'ghế thường', 'F1', 3, 70000);
INSERT INTO `seat` VALUES (264, 'ghế thường', 'F2', 3, 70000);
INSERT INTO `seat` VALUES (265, 'ghế thường', 'F3', 3, 70000);
INSERT INTO `seat` VALUES (266, 'ghế thường', 'F4', 3, 70000);
INSERT INTO `seat` VALUES (267, 'ghế thường', 'F5', 3, 70000);
INSERT INTO `seat` VALUES (268, 'ghế thường', 'F6', 3, 70000);
INSERT INTO `seat` VALUES (269, 'ghế thường', 'F7', 3, 70000);
INSERT INTO `seat` VALUES (270, 'ghế thường', 'F8', 3, 70000);
INSERT INTO `seat` VALUES (271, 'ghế thường', 'F9', 3, 70000);
INSERT INTO `seat` VALUES (272, 'ghế thường', 'F10', 3, 70000);
INSERT INTO `seat` VALUES (273, 'ghế thường', 'F11', 3, 70000);
INSERT INTO `seat` VALUES (274, 'ghế thường', 'F12', 3, 70000);
INSERT INTO `seat` VALUES (275, 'ghế thường', 'G1', 3, 70000);
INSERT INTO `seat` VALUES (276, 'ghế thường', 'G2', 3, 70000);
INSERT INTO `seat` VALUES (277, 'ghế thường', 'G3', 3, 70000);
INSERT INTO `seat` VALUES (278, 'ghế thường', 'G4', 3, 70000);
INSERT INTO `seat` VALUES (279, 'ghế thường', 'G5', 3, 70000);
INSERT INTO `seat` VALUES (280, 'ghế thường', 'G6', 3, 70000);
INSERT INTO `seat` VALUES (281, 'ghế thường', 'G7', 3, 70000);
INSERT INTO `seat` VALUES (282, 'ghế thường', 'G8', 3, 70000);
INSERT INTO `seat` VALUES (283, 'ghế thường', 'G9', 3, 70000);
INSERT INTO `seat` VALUES (284, 'ghế thường', 'G10', 3, 70000);
INSERT INTO `seat` VALUES (285, 'ghế thường', 'G11', 3, 70000);
INSERT INTO `seat` VALUES (286, 'ghế thường', 'G12', 3, 70000);
INSERT INTO `seat` VALUES (287, 'ghế thường', 'H1', 3, 70000);
INSERT INTO `seat` VALUES (288, 'ghế thường', 'H2', 3, 70000);
INSERT INTO `seat` VALUES (289, 'ghế thường', 'H3', 3, 70000);
INSERT INTO `seat` VALUES (290, 'ghế thường', 'H4', 3, 70000);
INSERT INTO `seat` VALUES (291, 'ghế thường', 'H5', 3, 70000);
INSERT INTO `seat` VALUES (292, 'ghế thường', 'H6', 3, 70000);
INSERT INTO `seat` VALUES (293, 'ghế thường', 'H7', 3, 70000);
INSERT INTO `seat` VALUES (294, 'ghế thường', 'H8', 3, 70000);
INSERT INTO `seat` VALUES (295, 'ghế thường', 'H9', 3, 70000);
INSERT INTO `seat` VALUES (296, 'ghế thường', 'H10', 3, 70000);
INSERT INTO `seat` VALUES (297, 'ghế thường', 'H11', 3, 70000);
INSERT INTO `seat` VALUES (298, 'ghế thường', 'H12', 3, 70000);
INSERT INTO `seat` VALUES (299, 'ghế đôi', 'I1', 3, 135000);
INSERT INTO `seat` VALUES (300, 'ghế đôi', 'I2', 3, 135000);
INSERT INTO `seat` VALUES (301, 'ghế đôi', 'I3', 3, 135000);
INSERT INTO `seat` VALUES (302, 'ghế đôi', 'I4', 3, 135000);
INSERT INTO `seat` VALUES (303, 'ghế đôi', 'I5', 3, 135000);
INSERT INTO `seat` VALUES (304, 'ghế thường', 'A1', 4, 70000);
INSERT INTO `seat` VALUES (305, 'ghế thường', 'A2', 4, 70000);
INSERT INTO `seat` VALUES (306, 'ghế thường', 'A3', 4, 70000);
INSERT INTO `seat` VALUES (307, 'ghế thường', 'A4', 4, 70000);
INSERT INTO `seat` VALUES (308, 'ghế thường', 'A5', 4, 70000);
INSERT INTO `seat` VALUES (309, 'ghế thường', 'A6', 4, 70000);
INSERT INTO `seat` VALUES (310, 'ghế thường', 'A7', 4, 70000);
INSERT INTO `seat` VALUES (311, 'ghế thường', 'A8', 4, 70000);
INSERT INTO `seat` VALUES (312, 'ghế thường', 'A9', 4, 70000);
INSERT INTO `seat` VALUES (313, 'ghế thường', 'A10', 4, 70000);
INSERT INTO `seat` VALUES (314, 'ghế thường', 'A11', 4, 70000);
INSERT INTO `seat` VALUES (315, 'ghế thường', 'A12', 4, 70000);
INSERT INTO `seat` VALUES (316, 'ghế thường', 'B1', 4, 70000);
INSERT INTO `seat` VALUES (317, 'ghế thường', 'B2', 4, 70000);
INSERT INTO `seat` VALUES (318, 'ghế thường', 'B3', 4, 70000);
INSERT INTO `seat` VALUES (319, 'ghế thường', 'B4', 4, 70000);
INSERT INTO `seat` VALUES (320, 'ghế thường', 'B5', 4, 70000);
INSERT INTO `seat` VALUES (321, 'ghế thường', 'B6', 4, 70000);
INSERT INTO `seat` VALUES (322, 'ghế thường', 'B7', 4, 70000);
INSERT INTO `seat` VALUES (323, 'ghế thường', 'B8', 4, 70000);
INSERT INTO `seat` VALUES (324, 'ghế thường', 'B9', 4, 70000);
INSERT INTO `seat` VALUES (325, 'ghế thường', 'B10', 4, 70000);
INSERT INTO `seat` VALUES (326, 'ghế thường', 'B11', 4, 70000);
INSERT INTO `seat` VALUES (327, 'ghế thường', 'B12', 4, 70000);
INSERT INTO `seat` VALUES (328, 'ghế thường', 'C1', 4, 70000);
INSERT INTO `seat` VALUES (329, 'ghế thường', 'C2', 4, 70000);
INSERT INTO `seat` VALUES (330, 'ghế thường', 'C3', 4, 70000);
INSERT INTO `seat` VALUES (331, 'ghế thường', 'C4', 4, 70000);
INSERT INTO `seat` VALUES (332, 'ghế thường', 'C5', 4, 70000);
INSERT INTO `seat` VALUES (333, 'ghế thường', 'C6', 4, 70000);
INSERT INTO `seat` VALUES (334, 'ghế thường', 'C7', 4, 70000);
INSERT INTO `seat` VALUES (335, 'ghế thường', 'C8', 4, 70000);
INSERT INTO `seat` VALUES (336, 'ghế thường', 'C9', 4, 70000);
INSERT INTO `seat` VALUES (337, 'ghế thường', 'C10', 4, 70000);
INSERT INTO `seat` VALUES (338, 'ghế thường', 'C11', 4, 70000);
INSERT INTO `seat` VALUES (339, 'ghế thường', 'C12', 4, 70000);
INSERT INTO `seat` VALUES (340, 'ghế thường', 'D1', 4, 70000);
INSERT INTO `seat` VALUES (341, 'ghế thường', 'D2', 4, 70000);
INSERT INTO `seat` VALUES (342, 'ghế thường', 'D3', 4, 70000);
INSERT INTO `seat` VALUES (343, 'ghế thường', 'D4', 4, 70000);
INSERT INTO `seat` VALUES (344, 'ghế thường', 'D5', 4, 70000);
INSERT INTO `seat` VALUES (345, 'ghế thường', 'D6', 4, 70000);
INSERT INTO `seat` VALUES (346, 'ghế thường', 'D7', 4, 70000);
INSERT INTO `seat` VALUES (347, 'ghế thường', 'D8', 4, 70000);
INSERT INTO `seat` VALUES (348, 'ghế thường', 'D9', 4, 70000);
INSERT INTO `seat` VALUES (349, 'ghế thường', 'D10', 4, 70000);
INSERT INTO `seat` VALUES (350, 'ghế thường', 'D11', 4, 70000);
INSERT INTO `seat` VALUES (351, 'ghế thường', 'D12', 4, 70000);
INSERT INTO `seat` VALUES (352, 'ghế thường', 'E1', 4, 70000);
INSERT INTO `seat` VALUES (353, 'ghế thường', 'E2', 4, 70000);
INSERT INTO `seat` VALUES (354, 'ghế thường', 'E3', 4, 70000);
INSERT INTO `seat` VALUES (355, 'ghế thường', 'E4', 4, 70000);
INSERT INTO `seat` VALUES (356, 'ghế thường', 'E5', 4, 70000);
INSERT INTO `seat` VALUES (357, 'ghế thường', 'E6', 4, 70000);
INSERT INTO `seat` VALUES (358, 'ghế thường', 'E7', 4, 70000);
INSERT INTO `seat` VALUES (359, 'ghế thường', 'E8', 4, 70000);
INSERT INTO `seat` VALUES (360, 'ghế thường', 'E9', 4, 70000);
INSERT INTO `seat` VALUES (361, 'ghế thường', 'E10', 4, 70000);
INSERT INTO `seat` VALUES (362, 'ghế thường', 'E11', 4, 70000);
INSERT INTO `seat` VALUES (363, 'ghế thường', 'E12', 4, 70000);
INSERT INTO `seat` VALUES (364, 'ghế thường', 'F1', 4, 70000);
INSERT INTO `seat` VALUES (365, 'ghế thường', 'F2', 4, 70000);
INSERT INTO `seat` VALUES (366, 'ghế thường', 'F3', 4, 70000);
INSERT INTO `seat` VALUES (367, 'ghế thường', 'F4', 4, 70000);
INSERT INTO `seat` VALUES (368, 'ghế thường', 'F5', 4, 70000);
INSERT INTO `seat` VALUES (369, 'ghế thường', 'F6', 4, 70000);
INSERT INTO `seat` VALUES (370, 'ghế thường', 'F7', 4, 70000);
INSERT INTO `seat` VALUES (371, 'ghế thường', 'F8', 4, 70000);
INSERT INTO `seat` VALUES (372, 'ghế thường', 'F9', 4, 70000);
INSERT INTO `seat` VALUES (373, 'ghế thường', 'F10', 4, 70000);
INSERT INTO `seat` VALUES (374, 'ghế thường', 'F11', 4, 70000);
INSERT INTO `seat` VALUES (375, 'ghế thường', 'F12', 4, 70000);
INSERT INTO `seat` VALUES (376, 'ghế thường', 'G1', 4, 70000);
INSERT INTO `seat` VALUES (377, 'ghế thường', 'G2', 4, 70000);
INSERT INTO `seat` VALUES (378, 'ghế thường', 'G3', 4, 70000);
INSERT INTO `seat` VALUES (379, 'ghế thường', 'G4', 4, 70000);
INSERT INTO `seat` VALUES (380, 'ghế thường', 'G5', 4, 70000);
INSERT INTO `seat` VALUES (381, 'ghế thường', 'G6', 4, 70000);
INSERT INTO `seat` VALUES (382, 'ghế thường', 'G7', 4, 70000);
INSERT INTO `seat` VALUES (383, 'ghế thường', 'G8', 4, 70000);
INSERT INTO `seat` VALUES (384, 'ghế thường', 'G9', 4, 70000);
INSERT INTO `seat` VALUES (385, 'ghế thường', 'G10', 4, 70000);
INSERT INTO `seat` VALUES (386, 'ghế thường', 'G11', 4, 70000);
INSERT INTO `seat` VALUES (387, 'ghế thường', 'G12', 4, 70000);
INSERT INTO `seat` VALUES (388, 'ghế thường', 'H1', 4, 70000);
INSERT INTO `seat` VALUES (389, 'ghế thường', 'H2', 4, 70000);
INSERT INTO `seat` VALUES (390, 'ghế thường', 'H3', 4, 70000);
INSERT INTO `seat` VALUES (391, 'ghế thường', 'H4', 4, 70000);
INSERT INTO `seat` VALUES (392, 'ghế thường', 'H5', 4, 70000);
INSERT INTO `seat` VALUES (393, 'ghế thường', 'H6', 4, 70000);
INSERT INTO `seat` VALUES (394, 'ghế thường', 'H7', 4, 70000);
INSERT INTO `seat` VALUES (395, 'ghế thường', 'H8', 4, 70000);
INSERT INTO `seat` VALUES (396, 'ghế thường', 'H9', 4, 70000);
INSERT INTO `seat` VALUES (397, 'ghế thường', 'H10', 4, 70000);
INSERT INTO `seat` VALUES (398, 'ghế thường', 'H11', 4, 70000);
INSERT INTO `seat` VALUES (399, 'ghế thường', 'H12', 4, 70000);
INSERT INTO `seat` VALUES (400, 'ghế đôi', 'I1', 4, 135000);
INSERT INTO `seat` VALUES (401, 'ghế đôi', 'I2', 4, 135000);
INSERT INTO `seat` VALUES (402, 'ghế đôi', 'I3', 4, 135000);
INSERT INTO `seat` VALUES (403, 'ghế đôi', 'I4', 4, 135000);
INSERT INTO `seat` VALUES (404, 'ghế đôi', 'I5', 4, 135000);

-- ----------------------------
-- Table structure for showtime
-- ----------------------------
DROP TABLE IF EXISTS `showtime`;
CREATE TABLE `showtime`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `show_date` date NULL DEFAULT NULL,
  `start_time` datetime(6) NULL DEFAULT NULL,
  `movie_id` bigint NULL DEFAULT NULL,
  `room_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK8i90asti16tydhva795c3qwj2`(`movie_id` ASC) USING BTREE,
  INDEX `FK6xi8d7qa7ww5iaypsrc0gjpa8`(`room_id` ASC) USING BTREE,
  CONSTRAINT `FK6xi8d7qa7ww5iaypsrc0gjpa8` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK8i90asti16tydhva795c3qwj2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of showtime
-- ----------------------------
INSERT INTO `showtime` VALUES (1, '2025-05-28', '2025-05-28 10:00:00.000000', 1, 1);
INSERT INTO `showtime` VALUES (2, '2025-05-28', '2025-05-28 13:00:00.000000', 2, 2);
INSERT INTO `showtime` VALUES (3, '2025-05-28', '2025-05-28 16:30:00.000000', 3, 3);
INSERT INTO `showtime` VALUES (4, '2025-05-29', '2025-05-29 11:00:00.000000', 4, 1);
INSERT INTO `showtime` VALUES (5, '2025-05-29', '2025-05-29 14:00:00.000000', 5, 4);
INSERT INTO `showtime` VALUES (6, '2025-05-30', '2025-05-30 12:00:00.000000', 6, 2);
INSERT INTO `showtime` VALUES (7, '2025-05-30', '2025-05-30 15:00:00.000000', 7, 3);
INSERT INTO `showtime` VALUES (8, '2025-05-31', '2025-05-31 10:30:00.000000', 8, 1);
INSERT INTO `showtime` VALUES (9, '2025-05-31', '2025-05-31 13:30:00.000000', 9, 4);
INSERT INTO `showtime` VALUES (10, '2025-06-01', '2025-06-01 11:00:00.000000', 10, 2);
INSERT INTO `showtime` VALUES (11, '2025-06-01', '2025-06-01 14:00:00.000000', 11, 3);
INSERT INTO `showtime` VALUES (12, '2025-06-02', '2025-06-02 12:30:00.000000', 12, 1);

-- ----------------------------
-- Table structure for status_film
-- ----------------------------
DROP TABLE IF EXISTS `status_film`;
CREATE TABLE `status_film`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of status_film
-- ----------------------------
INSERT INTO `status_film` VALUES (1, 'active');
INSERT INTO `status_film` VALUES (2, 'inactive');
INSERT INTO `status_film` VALUES (3, 'deleted');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `card_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `gender` bit(1) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `role_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKn82ha3ccdebhokx3a8fgdqeyy`(`role_id` ASC) USING BTREE,
  CONSTRAINT `FKn82ha3ccdebhokx3a8fgdqeyy` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'Hà Nội', 'https://canvato.net/2ETUv', '123456789', 'i0zdT', 'test@example.com', b'1', 'Nguyễn Văn A', '$2a$10$Lm/qk3./DPAuZHwfK1W3iux6MWUGEF/2R5iGqymQZG/i.C.qsX5B.', '0987654321', b'1', 2);

SET FOREIGN_KEY_CHECKS = 1;
