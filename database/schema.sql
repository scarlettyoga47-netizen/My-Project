-- ============================================================
-- 本地生活商户点评系统 - 数据库建表脚本
-- 字符集: utf8mb4
-- 存储引擎: InnoDB
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 用户表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户主键ID',
  `phone`           VARCHAR(20) NOT NULL COMMENT '手机号(登录账号)',
  `password_hash`   VARCHAR(255) NOT NULL COMMENT '密码哈希(bcrypt加密)',
  `nickname`        VARCHAR(50) DEFAULT NULL COMMENT '用户昵称',
  `avatar`          VARCHAR(255) DEFAULT NULL COMMENT '头像图片URL',
  `role`            ENUM('user','merchant','admin') NOT NULL DEFAULT 'user' COMMENT '角色:普通用户/商户/管理员',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ------------------------------------------------------------
-- 品类表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id`      INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '品类主键ID',
  `name`    VARCHAR(50) NOT NULL COMMENT '品类名称',
  `icon`    VARCHAR(255) DEFAULT NULL COMMENT '品类图标URL',
  `sort`    INT NOT NULL DEFAULT 0 COMMENT '排序值(值越小越靠前)',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='品类表';

-- ------------------------------------------------------------
-- 商户表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `merchant`;
CREATE TABLE `merchant` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商户主键ID',
  `name`            VARCHAR(100) NOT NULL COMMENT '商户名称',
  `category_id`     INT UNSIGNED NOT NULL COMMENT '所属品类ID',
  `address`         VARCHAR(255) NOT NULL COMMENT '商户地址',
  `phone`           VARCHAR(20) NOT NULL COMMENT '商户联系电话',
  `business_hours`  VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `description`     VARCHAR(1000) DEFAULT NULL COMMENT '商户描述',
  `cover_image`     VARCHAR(255) DEFAULT NULL COMMENT '封面图片URL',
  `images`          JSON DEFAULT NULL COMMENT '商户相册图片URL数组',
  `rating`          DECIMAL(3,1) NOT NULL DEFAULT 0.0 COMMENT '商户综合评分',
  `review_count`    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点评数量',
  `status`          ENUM('pending','approved','rejected','disabled') NOT NULL DEFAULT 'pending' COMMENT '审核状态:待审核/已通过/已拒绝/已禁用',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT '所属用户ID(商户账号)',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`),
  CONSTRAINT `fk_merchant_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_merchant_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商户表';

-- ------------------------------------------------------------
-- 点评表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点评主键ID',
  `merchant_id`     BIGINT UNSIGNED NOT NULL COMMENT '商户ID',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT '点评用户ID',
  `rating`          TINYINT UNSIGNED NOT NULL COMMENT '评分(1-5星)',
  `content`         VARCHAR(1000) NOT NULL COMMENT '点评内容',
  `images_count`    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点评图片数量',
  `status`          ENUM('normal','removed') NOT NULL DEFAULT 'normal' COMMENT '状态:正常/已删除',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_review_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点评表';

-- ------------------------------------------------------------
-- 点评图片表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `review_image`;
CREATE TABLE `review_image` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图片主键ID',
  `review_id`   BIGINT UNSIGNED NOT NULL COMMENT '所属点评ID',
  `url`         VARCHAR(255) NOT NULL COMMENT '图片URL',
  `sort`        INT NOT NULL DEFAULT 0 COMMENT '排序值(值越小越靠前)',
  PRIMARY KEY (`id`),
  KEY `idx_review_id` (`review_id`),
  CONSTRAINT `fk_review_image_review` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点评图片表';

-- ------------------------------------------------------------
-- 点评点赞表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `review_like`;
CREATE TABLE `review_like` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '点赞主键ID',
  `review_id`   BIGINT UNSIGNED NOT NULL COMMENT '点评ID',
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '点赞用户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_review_user` (`review_id`,`user_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_review_like_review` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_like_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点评点赞表';

-- ------------------------------------------------------------
-- 收藏表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '收藏主键ID',
  `user_id`       BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `merchant_id`   BIGINT UNSIGNED NOT NULL COMMENT '商户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_merchant` (`user_id`,`merchant_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorite_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- ------------------------------------------------------------
-- 预约表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '预约主键ID',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT '预约用户ID',
  `merchant_id`     BIGINT UNSIGNED NOT NULL COMMENT '预约商户ID',
  `date`            DATE NOT NULL COMMENT '预约日期',
  `time_slot`       VARCHAR(10) NOT NULL COMMENT '预约时段(如 18:00)',
  `contact_phone`   VARCHAR(20) NOT NULL COMMENT '联系电话',
  `remark`          VARCHAR(500) DEFAULT NULL COMMENT '备注说明',
  `status`          ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态:待确认/已确认/已完成/已取消',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_date` (`date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_reservation_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reservation_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预约表';

-- ------------------------------------------------------------
-- 商户入驻申请表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `merchant_application`;
CREATE TABLE `merchant_application` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '申请主键ID',
  `user_id`             BIGINT UNSIGNED NOT NULL COMMENT '申请用户ID',
  `business_license`    VARCHAR(50) NOT NULL COMMENT '营业执照编号',
  `store_name`          VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `category_id`         INT UNSIGNED NOT NULL COMMENT '所属品类ID',
  `address`             VARCHAR(255) NOT NULL COMMENT '店铺地址',
  `contact_name`        VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  `contact_phone`       VARCHAR(20) NOT NULL COMMENT '联系电话',
  `status`              ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态:待审核/已通过/已拒绝',
  `reject_reason`       VARCHAR(500) DEFAULT NULL COMMENT '拒绝原因',
  `submitted_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `reviewed_at`         DATETIME DEFAULT NULL COMMENT '审核时间',
  `reviewer_id`         BIGINT UNSIGNED DEFAULT NULL COMMENT '审核人ID(管理员)',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_application_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_application_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_application_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商户入驻申请表';

-- ------------------------------------------------------------
-- 举报表
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '举报主键ID',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT '举报用户ID',
  `review_id`       BIGINT UNSIGNED NOT NULL COMMENT '被举报点评ID',
  `reason`          VARCHAR(500) NOT NULL COMMENT '举报原因',
  `status`          ENUM('pending','resolved','rejected') NOT NULL DEFAULT 'pending' COMMENT '处理状态:待处理/已处理/已驳回',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '举报时间',
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `handler_id`      BIGINT UNSIGNED DEFAULT NULL COMMENT '处理人ID(管理员)',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_review_id` (`review_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_report_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_report_review` FOREIGN KEY (`review_id`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_report_handler` FOREIGN KEY (`handler_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='举报表';

SET FOREIGN_KEY_CHECKS = 1;
