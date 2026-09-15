-- ============================================================
-- 本地生活商户点评系统 - 初始化测试数据
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 初始化用户数据 (user表)
-- ------------------------------------------------------------
INSERT INTO `user` (`id`, `phone`, `password_hash`, `nickname`, `avatar`, `role`) VALUES
(1, '13800000000', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '平台管理员', 'https://example.com/avatar/admin.png', 'admin'),
(2, '13800000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '美食家小王', 'https://example.com/avatar/user1.png', 'user'),
(3, '13800000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '健身达人小李', 'https://example.com/avatar/user2.png', 'user'),
(4, '13800000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '休闲玩家小张', 'https://example.com/avatar/user3.png', 'user'),
(5, '13800000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '川味轩老板', 'https://example.com/avatar/merchant1.png', 'merchant'),
(6, '13800000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '粤菜馆老板', 'https://example.com/avatar/merchant2.png', 'merchant'),
(7, '13800000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'KTV老板', 'https://example.com/avatar/merchant3.png', 'merchant'),
(8, '13800000007', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '美容院老板', 'https://example.com/avatar/merchant4.png', 'merchant'),
(9, '13800000008', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '健身房老板', 'https://example.com/avatar/merchant5.png', 'merchant');

-- ------------------------------------------------------------
-- 初始化品类数据 (category表)
-- ------------------------------------------------------------
INSERT INTO `category` (`id`, `name`, `icon`, `sort`) VALUES
(1, '餐饮', 'https://example.com/icon/food.png', 1),
(2, '休闲娱乐', 'https://example.com/icon/entertainment.png', 2),
(3, '丽人', 'https://example.com/icon/beauty.png', 3),
(4, '运动健身', 'https://example.com/icon/fitness.png', 4);

-- ------------------------------------------------------------
-- 初始化商户数据 (merchant表)
-- 品类: 餐饮(2个), 休闲娱乐(1个), 丽人(1个), 运动健身(1个)
-- ------------------------------------------------------------
INSERT INTO `merchant` (`id`, `name`, `category_id`, `address`, `phone`, `business_hours`, `description`, `cover_image`, `images`, `rating`, `review_count`, `status`, `user_id`) VALUES
(1, '川味轩正宗川菜', 1, '北京市朝阳区建国路88号SOHO现代城A座1层', '010-66668888', '周一至周日 10:00-22:00', '正宗川菜馆，传承二十年老味道，招牌水煮鱼、麻婆豆腐深受食客喜爱。环境优雅，适合家庭聚餐和朋友聚会。', 'https://example.com/merchant/chuancai/cover.jpg',
JSON_ARRAY('https://example.com/merchant/chuancai/img1.jpg','https://example.com/merchant/chuancai/img2.jpg','https://example.com/merchant/chuancai/img3.jpg','https://example.com/merchant/chuancai/img4.jpg'),
4.5, 0, 'approved', 5),

(2, '粤港茶餐厅', 1, '北京市海淀区中关村大街15号中关村广场B1层', '010-88886666', '周一至周日 07:00-23:00', '地道港式茶餐厅，提供早茶、午市、晚市全时段服务。虾饺、烧卖、肠粉等港式点心现点现蒸，奶茶咖啡香浓醇厚。', 'https://example.com/merchant/yuegang/cover.jpg',
JSON_ARRAY('https://example.com/merchant/yuegang/img1.jpg','https://example.com/merchant/yuegang/img2.jpg','https://example.com/merchant/yuegang/img3.jpg'),
4.7, 0, 'approved', 6),

(3, '星聚会KTV(望京店)', 2, '北京市朝阳区望京街9号望京SOHO T3楼3层', '010-55559999', '周一至周日 11:00-次日02:00', '高端量贩式KTV，豪华包厢配置顶级音响设备，海量曲库实时更新。提供酒水零食套餐，是朋友聚会、生日派对的绝佳选择。', 'https://example.com/merchant/ktv/cover.jpg',
JSON_ARRAY('https://example.com/merchant/ktv/img1.jpg','https://example.com/merchant/ktv/img2.jpg','https://example.com/merchant/ktv/img3.jpg','https://example.com/merchant/ktv/img4.jpg','https://example.com/merchant/ktv/img5.jpg'),
4.3, 0, 'approved', 7),

(4, '丽人坊美容SPA会所', 3, '北京市西城区金融街7号英蓝国际金融中心B2层', '010-77773333', '周一至周日 09:00-21:00', '高端美容SPA会所，提供面部护理、身体SPA、美甲美睫等全方位美容服务。使用国际一线品牌护肤产品，专业美容师一对一服务。', 'https://example.com/merchant/beauty/cover.jpg',
JSON_ARRAY('https://example.com/merchant/beauty/img1.jpg','https://example.com/merchant/beauty/img2.jpg','https://example.com/merchant/beauty/img3.jpg'),
4.8, 0, 'approved', 8),

(5, '力健健身俱乐部(国贸店)', 4, '北京市朝阳区建国门外大街1号国贸商城L3层', '010-99995555', '周一至周日 06:00-23:00', '大型综合健身俱乐部，配备进口健身器械、恒温游泳池、团课教室。提供私教训练、瑜伽、动感单车等多种课程，满足不同健身需求。', 'https://example.com/merchant/fitness/cover.jpg',
JSON_ARRAY('https://example.com/merchant/fitness/img1.jpg','https://example.com/merchant/fitness/img2.jpg','https://example.com/merchant/fitness/img3.jpg','https://example.com/merchant/fitness/img4.jpg'),
4.6, 0, 'approved', 9);

-- ------------------------------------------------------------
-- 初始化点评数据 (review表) - 共12条，每个商户至少2条
-- ------------------------------------------------------------
INSERT INTO `review` (`id`, `merchant_id`, `user_id`, `rating`, `content`, `images_count`, `status`) VALUES
(1, 1, 2, 5, '超级好吃的川菜！水煮鱼麻辣鲜香，鱼肉嫩滑，配菜也很入味。麻婆豆腐正宗，配米饭绝了。服务员态度很好，上菜速度快，下次还会再来！', 3, 'normal'),
(2, 1, 3, 4, '整体不错，味道正宗。宫保鸡丁酸甜可口，夫妻肺片也很好吃。就是周末人太多，等了半个多小时才有位置，建议提前预约。环境略吵，但川菜馆嘛，热闹点也正常。', 2, 'normal'),
(3, 1, 4, 5, '作为一个四川人，在北京能吃到这么正宗的川菜真的很感动！回锅肉、口水鸡都有家乡的味道。分量足，价格合理，强烈推荐！', 4, 'normal'),

(4, 2, 2, 5, '早茶太棒了！虾饺皮薄馅大，虾肉Q弹。烧卖、叉烧包都很赞。港式奶茶很正宗，不甜不腻。环境很有老香港的感觉，服务也很周到。周末人多，建议早点来。', 3, 'normal'),
(5, 2, 3, 4, '下午茶套餐性价比很高，一份主食+一杯饮料才三十多。菠萝油刚出炉的超好吃，冰火两重天的感觉。云吞面面很劲道，云吞里有整只虾。', 2, 'normal'),
(6, 2, 4, 5, '肠粉滑溜溜的，酱汁调得刚刚好。烧腊双拼饭的烧鸭皮脆肉嫩，蜜汁叉烧甜而不腻。服务员都是广东人，说话都带着港味，体验感满分！', 3, 'normal'),

(7, 3, 2, 4, '和朋友周末来唱歌，包厢很大，装修很潮。音响效果不错，曲库很全，新歌老歌都有。点了个酒水套餐，价格还行。就是厕所不太干净，希望能改进。', 2, 'normal'),
(8, 3, 4, 5, '生日派对选的这里，超大包厢能坐20多个人，气氛超好！灯光效果很炫，还有DJ台。服务员帮忙布置了气球，送了生日果盘，太贴心了！强烈推荐！', 4, 'normal'),

(9, 4, 2, 5, '第一次来这家美容院，体验感超棒！做了个面部补水护理，美容师手法专业，按得我都睡着了。做完皮肤水嫩嫩的，效果立竿见影。环境很私密，单人间很安静。办了会员，以后常来。', 3, 'normal'),
(10, 4, 3, 5, '做了美甲和美睫，效果超级满意！美甲师很有耐心，帮我选的颜色很显白。美睫是日式的，很自然不扎眼。环境优雅，进门有香薰，还有花茶和小点心，真的很享受。', 4, 'normal'),

(11, 5, 3, 5, '在这家健身房练了三个月，从150斤减到130斤，效果显著！器械很新很全，练腿练背练胸的器械都有。游泳池水很干净，人不多。教练很专业，不会过度推销，给我的减脂计划很科学。', 3, 'normal'),
(12, 5, 4, 4, '健身房环境不错，团课很丰富，瑜伽课、动感单车、搏击操都有。更衣室和淋浴间很干净，还有汗蒸房。唯一缺点就是高峰期人多，热门器械要排队。总体还是很满意的。', 2, 'normal');

-- ------------------------------------------------------------
-- 初始化点评图片数据 (review_image表)
-- ------------------------------------------------------------
INSERT INTO `review_image` (`id`, `review_id`, `url`, `sort`) VALUES
(1, 1, 'https://example.com/review/r1/img1.jpg', 1),
(2, 1, 'https://example.com/review/r1/img2.jpg', 2),
(3, 1, 'https://example.com/review/r1/img3.jpg', 3),
(4, 2, 'https://example.com/review/r2/img1.jpg', 1),
(5, 2, 'https://example.com/review/r2/img2.jpg', 2),
(6, 3, 'https://example.com/review/r3/img1.jpg', 1),
(7, 3, 'https://example.com/review/r3/img2.jpg', 2),
(8, 3, 'https://example.com/review/r3/img3.jpg', 3),
(9, 3, 'https://example.com/review/r3/img4.jpg', 4),
(10, 4, 'https://example.com/review/r4/img1.jpg', 1),
(11, 4, 'https://example.com/review/r4/img2.jpg', 2),
(12, 4, 'https://example.com/review/r4/img3.jpg', 3),
(13, 5, 'https://example.com/review/r5/img1.jpg', 1),
(14, 5, 'https://example.com/review/r5/img2.jpg', 2),
(15, 6, 'https://example.com/review/r6/img1.jpg', 1),
(16, 6, 'https://example.com/review/r6/img2.jpg', 2),
(17, 6, 'https://example.com/review/r6/img3.jpg', 3),
(18, 7, 'https://example.com/review/r7/img1.jpg', 1),
(19, 7, 'https://example.com/review/r7/img2.jpg', 2),
(20, 8, 'https://example.com/review/r8/img1.jpg', 1),
(21, 8, 'https://example.com/review/r8/img2.jpg', 2),
(22, 8, 'https://example.com/review/r8/img3.jpg', 3),
(23, 8, 'https://example.com/review/r8/img4.jpg', 4),
(24, 9, 'https://example.com/review/r9/img1.jpg', 1),
(25, 9, 'https://example.com/review/r9/img2.jpg', 2),
(26, 9, 'https://example.com/review/r9/img3.jpg', 3),
(27, 10, 'https://example.com/review/r10/img1.jpg', 1),
(28, 10, 'https://example.com/review/r10/img2.jpg', 2),
(29, 10, 'https://example.com/review/r10/img3.jpg', 3),
(30, 10, 'https://example.com/review/r10/img4.jpg', 4),
(31, 11, 'https://example.com/review/r11/img1.jpg', 1),
(32, 11, 'https://example.com/review/r11/img2.jpg', 2),
(33, 11, 'https://example.com/review/r11/img3.jpg', 3),
(34, 12, 'https://example.com/review/r12/img1.jpg', 1),
(35, 12, 'https://example.com/review/r12/img2.jpg', 2);

-- ------------------------------------------------------------
-- 初始化点评点赞数据 (review_like表)
-- ------------------------------------------------------------
INSERT INTO `review_like` (`id`, `review_id`, `user_id`) VALUES
(1, 1, 3),
(2, 1, 4),
(3, 2, 2),
(4, 2, 4),
(5, 4, 3),
(6, 4, 4),
(7, 5, 2),
(8, 6, 2),
(9, 6, 3),
(10, 8, 2),
(11, 8, 3),
(12, 9, 3),
(13, 9, 4),
(14, 10, 2),
(15, 11, 2),
(16, 11, 4),
(17, 12, 3);

-- ------------------------------------------------------------
-- 更新商户表点评统计数据
-- ------------------------------------------------------------
UPDATE `merchant` SET `rating` = 4.7, `review_count` = 3 WHERE `id` = 1;
UPDATE `merchant` SET `rating` = 4.7, `review_count` = 3 WHERE `id` = 2;
UPDATE `merchant` SET `rating` = 4.5, `review_count` = 2 WHERE `id` = 3;
UPDATE `merchant` SET `rating` = 5.0, `review_count` = 2 WHERE `id` = 4;
UPDATE `merchant` SET `rating` = 4.5, `review_count` = 2 WHERE `id` = 5;

SET FOREIGN_KEY_CHECKS = 1;
