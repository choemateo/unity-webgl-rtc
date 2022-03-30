/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `office3d_chat`;
CREATE DATABASE IF NOT EXISTS `office3d_chat` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `office3d_chat`;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `failed_jobs`;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `migrations`;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_resets_table', 1),
	(3, '2019_08_19_000000_create_failed_jobs_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2021_01_11_162018_add_login_meta_data_to_users_table', 1),
	(6, '2021_01_19_152802_create_wossop_messages_table', 1),
	(7, '2021_01_27_170401_add_about_and_avatar_to_users_table', 1),
	(8, '2021_09_04_015825_create_office_spaces_table', 1);

DROP TABLE IF EXISTS `office_spaces`;
CREATE TABLE IF NOT EXISTS `office_spaces` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `spacename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `buildname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'off',
  `create_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `office_spaces_spacename_index` (`spacename`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `office_spaces`;

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `password_resets`;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `personal_access_tokens`;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 3, 'wossop_token', '97fe5051779d30466e398ab71a1732809f53106a8586527e4e6e7fb2f248f122', '["*"]', NULL, '2021-12-03 11:59:52', '2021-12-03 11:59:52'),
	(2, 'App\\Models\\User', 3, 'wossop_token', 'b69e60ce4415c5ddcc4b382a8abc67863db49a2caaef32b565545b366bb82d54', '["*"]', NULL, '2021-12-03 12:01:31', '2021-12-03 12:01:31'),
	(3, 'App\\Models\\User', 3, 'wossop_token', '4060dd3f5da774e126a3289ffd4793d784a22d808cd0b588e1ec9519b55bf6c9', '["*"]', NULL, '2021-12-03 12:17:17', '2021-12-03 12:17:17'),
	(4, 'App\\Models\\User', 3, 'wossop_token', '6be8f3503139697c984c81a3d495e2f9990bc8eee3810966d94fa409e14ef78a', '["*"]', NULL, '2021-12-03 13:19:29', '2021-12-03 13:19:29'),
	(5, 'App\\Models\\User', 3, 'wossop_token', '7ed20046214f7a0c937fa9068c9fc032b8dc31f8e48fca10127834cc9765e9f3', '["*"]', NULL, '2021-12-03 21:37:51', '2021-12-03 21:37:51'),
	(6, 'App\\Models\\User', 3, 'wossop_token', 'f84f255e9c7276432f0b3dc0357328000cee29fe10fe89b56dbbfd596452c9a0', '["*"]', NULL, '2021-12-03 22:02:26', '2021-12-03 22:02:26'),
	(7, 'App\\Models\\User', 3, 'wossop_token', 'e9f8117e9196194e405c9f2afe1d9cf8b75f16fc6df165968f353d35602516f7', '["*"]', NULL, '2021-12-04 00:10:07', '2021-12-04 00:10:07'),
	(8, 'App\\Models\\User', 3, 'wossop_token', 'a34349bbdad19734bd0c0adcbb2fb0cb0c64641ffca9cf7828deb3d818a1e010', '["*"]', NULL, '2021-12-04 02:05:50', '2021-12-04 02:05:50'),
	(9, 'App\\Models\\User', 3, 'wossop_token', '8dba72ffcf94e51fda9c4e8ddef93c4521cd9ee7f6dafac77b5eab89c371daa6', '["*"]', NULL, '2021-12-04 02:24:50', '2021-12-04 02:24:50'),
	(10, 'App\\Models\\User', 3, 'wossop_token', 'eec972b8ea717174759a85745c1f22c8f2440ccfdf602e8f5440d825f67cf789', '["*"]', NULL, '2021-12-04 02:27:31', '2021-12-04 02:27:31'),
	(11, 'App\\Models\\User', 3, 'wossop_token', '4ebb380ba12ea66950c25a1cce947dba70b8fd8b018e5e07f4852d83e780615e', '["*"]', NULL, '2021-12-04 04:27:38', '2021-12-04 04:27:38'),
	(12, 'App\\Models\\User', 3, 'wossop_token', '25c0988f2a5ad39c1100f4817a2e6105a991fc0364833aa4827c8bb2b02cf630', '["*"]', NULL, '2021-12-04 07:15:26', '2021-12-04 07:15:26'),
	(13, 'App\\Models\\User', 3, 'wossop_token', 'f8018849745f3f80c34f69e2a93ff4436d2d35552dd4ada3a280b1f5f6747fc1', '["*"]', NULL, '2021-12-04 09:39:55', '2021-12-04 09:39:55'),
	(14, 'App\\Models\\User', 3, 'wossop_token', '2ea47f2f75319fea7dfb7c7c2fe7cbc766e266c2f24c45dbf9453cef0eb9f9ad', '["*"]', NULL, '2021-12-05 02:14:25', '2021-12-05 02:14:25'),
	(15, 'App\\Models\\User', 3, 'wossop_token', '07d3a6735f1e9d4551023acd5bffcbb23d487bc64047b7d1ded7ac708529e273', '["*"]', NULL, '2021-12-05 03:18:59', '2021-12-05 03:18:59'),
	(16, 'App\\Models\\User', 3, 'wossop_token', '1cfa40a12907b80caed3a109e060d1e1429e5fd7decfa9c739bb9f8c5816ca05', '["*"]', NULL, '2021-12-05 04:01:26', '2021-12-05 04:01:26'),
	(17, 'App\\Models\\User', 3, 'wossop_token', '958326269d1a8c144595bb7a5129a559412720c9a013a279d78a33936179ee9c', '["*"]', NULL, '2021-12-10 23:36:54', '2021-12-10 23:36:54'),
	(18, 'App\\Models\\User', 3, 'wossop_token', 'c839a51426b078c52d3ae125793243cfbb6794975fdc7c333c52e4f29a8a3a9e', '["*"]', NULL, '2021-12-11 00:53:11', '2021-12-11 00:53:11'),
	(19, 'App\\Models\\User', 3, 'wossop_token', '9812e511278620385c5f57047525d06fbc6886a5b1f4f820312f74c6cd9cca27', '["*"]', NULL, '2021-12-11 00:57:51', '2021-12-11 00:57:51'),
	(20, 'App\\Models\\User', 3, 'wossop_token', 'b71993954e35c8c4be55a5af86fa3879fe6de89eba3a2fb2322027276fd9b94e', '["*"]', NULL, '2021-12-11 05:54:22', '2021-12-11 05:54:22'),
	(21, 'App\\Models\\User', 3, 'wossop_token', '909eb86e6bfac3e0ec5ef15a5352f0daa38d6ec5dcdb2f451325bd8511ed0a41', '["*"]', NULL, '2021-12-11 06:03:20', '2021-12-11 06:03:20'),
	(22, 'App\\Models\\User', 3, 'wossop_token', '231e8bfda4b4b4f6d6f8b4fc745b72f90378351d5f9089a7bb2330f3e53fc0fe', '["*"]', NULL, '2021-12-11 06:06:23', '2021-12-11 06:06:23'),
	(23, 'App\\Models\\User', 3, 'wossop_token', '09d759391618744b426c7b5a2b6b93657a6279d451b7f3eb18e0c7f12f1f5614', '["*"]', NULL, '2021-12-11 08:22:38', '2021-12-11 08:22:38'),
	(24, 'App\\Models\\User', 3, 'wossop_token', '3271c98e63299cdca85d9d282f9443b9669c5dc863bf08561838eec041b0a80d', '["*"]', NULL, '2021-12-11 09:34:55', '2021-12-11 09:34:55'),
	(25, 'App\\Models\\User', 3, 'wossop_token', '2074161dc334d2b3abdaac2a2445fd336a802e280af9f549106aa123c8781760', '["*"]', NULL, '2021-12-11 14:52:21', '2021-12-11 14:52:21'),
	(26, 'App\\Models\\User', 3, 'wossop_token', '2594d91a3810b8e1caea200a4312ccfef11150e9ad70ac1b64e97c2db0c65b76', '["*"]', NULL, '2021-12-11 22:48:24', '2021-12-11 22:48:24'),
	(27, 'App\\Models\\User', 3, 'wossop_token', 'f0372dc9e7d7463d7528f3721baf169a985a186aa4a8fad2fa95a7461335f608', '["*"]', NULL, '2021-12-11 22:49:29', '2021-12-11 22:49:29'),
	(28, 'App\\Models\\User', 3, 'wossop_token', 'bf08a1e8adefad7c55e789595f66e4f805b3c3e2161bbb8b6ae4e2c121b4e43f', '["*"]', NULL, '2021-12-12 20:50:56', '2021-12-12 20:50:56'),
	(29, 'App\\Models\\User', 3, 'wossop_token', '9356bc908606fcebe1b5172f9d3afa2cfbeedc0cdfdf97be209f28bc39f7e5d1', '["*"]', NULL, '2021-12-21 04:33:01', '2021-12-21 04:33:01'),
	(30, 'App\\Models\\User', 3, 'wossop_token', '1ce6a9caace4ef25339302e9c86f99d48bc2dac89988cbc9a91de1741de7903c', '["*"]', NULL, '2021-12-21 19:06:05', '2021-12-21 19:06:05'),
	(31, 'App\\Models\\User', 3, 'wossop_token', '5f0714b425a046386dad4637b51c900a0a281963e6ff08da879410c67c4fe7ec', '["*"]', NULL, '2021-12-26 18:54:38', '2021-12-26 18:54:38'),
	(32, 'App\\Models\\User', 3, 'wossop_token', 'c8973fe4e14ef705e01327c93647fe7e34f484eb5a55a49c53df6e98ca7825e3', '["*"]', NULL, '2021-12-26 19:00:59', '2021-12-26 19:00:59'),
	(33, 'App\\Models\\User', 3, 'wossop_token', '2d62e07a029f1ab4d2fcb74759044aa151915330f245a75d89522f138fbc6b2b', '["*"]', NULL, '2021-12-27 18:23:14', '2021-12-27 18:23:14'),
	(34, 'App\\Models\\User', 3, 'wossop_token', '3e0f33a298affbbe025b197b3f1d17199ed4f70a18a835f7116242a863434370', '["*"]', NULL, '2022-01-27 07:04:57', '2022-01-27 07:04:57'),
	(35, 'App\\Models\\User', 4, 'wossop_token', '7e58e2df38a911462e79c3054757afb5c1beae29efdc889c43093149fbc14f2c', '["*"]', NULL, '2022-02-13 06:36:45', '2022-02-13 06:36:45'),
	(36, 'App\\Models\\User', 3, 'wossop_token', '8472ee5e885b122c51503277e2ae08a27a38097936d1b1a8bbcda87c3b1694fa', '["*"]', NULL, '2022-03-22 08:08:09', '2022-03-22 08:08:09'),
	(37, 'App\\Models\\User', 3, 'wossop_token', 'da93ee566fc99d6d321b791ca5bf9c118c75e72d10c44969d8bbafe319eeacc7', '["*"]', NULL, '2022-03-26 23:36:28', '2022-03-26 23:36:28'),
	(38, 'App\\Models\\User', 3, 'wossop_token', '5fc65310708ef25e36e0fd17204c5e8d2072a37c8f65df14a918e76968ff01c5', '["*"]', NULL, '2022-03-26 23:40:41', '2022-03-26 23:40:41'),
	(39, 'App\\Models\\User', 3, 'wossop_token', 'cddffcd2b8a525539a3ca680bf05e7069ae1317cbe44175fdd525be501fab824', '["*"]', NULL, '2022-03-27 01:47:15', '2022-03-27 01:47:15'),
	(40, 'App\\Models\\User', 3, 'wossop_token', '6dab97076f9a3e8cf5bc3bb6594601d4035c389be06507152e787738e1add7ee', '["*"]', NULL, '2022-03-29 07:49:06', '2022-03-29 07:49:06'),
	(41, 'App\\Models\\User', 3, 'wossop_token', '971c1c2f9d8955096d6db89da164d8c17ca7c6a608bfc1bc67a73890e1e787cd', '["*"]', NULL, '2022-03-29 21:28:26', '2022-03-29 21:28:26');

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manage` int(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `last_login_at`, `last_login_ip`, `about`, `avatar_path`, `manage`) VALUES
	(1, 'admin', 'admin@gmail.com', NULL, '$2y$10$O8R4Qd9LKz9rdPCruZvMceJb0nV3z5vRTljgONifSiYq9vsitpWca', NULL, '2021-12-03 09:47:05', '2021-12-03 09:47:05', NULL, NULL, NULL, NULL, 1);

DROP TABLE IF EXISTS `wossop_messages`;
CREATE TABLE IF NOT EXISTS `wossop_messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `receiver` bigint(20) unsigned NOT NULL,
  `sender` bigint(20) unsigned NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELETE FROM `wossop_messages`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
