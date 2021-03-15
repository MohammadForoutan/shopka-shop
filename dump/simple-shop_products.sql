-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: simple-shop
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `attributes` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `link` (`link`),
  UNIQUE KEY `link_2` (`link`),
  UNIQUE KEY `link_3` (`link`),
  UNIQUE KEY `link_4` (`link`),
  UNIQUE KEY `link_5` (`link`),
  UNIQUE KEY `link_6` (`link`),
  UNIQUE KEY `link_7` (`link`),
  UNIQUE KEY `link_8` (`link`),
  UNIQUE KEY `link_9` (`link`),
  UNIQUE KEY `link_10` (`link`),
  UNIQUE KEY `link_11` (`link`),
  UNIQUE KEY `link_12` (`link`),
  UNIQUE KEY `link_13` (`link`),
  UNIQUE KEY `link_14` (`link`),
  UNIQUE KEY `link_15` (`link`),
  UNIQUE KEY `link_16` (`link`),
  UNIQUE KEY `link_17` (`link`),
  UNIQUE KEY `link_18` (`link`),
  UNIQUE KEY `link_19` (`link`),
  UNIQUE KEY `link_20` (`link`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (16,'Xiaomi Redmi Note 9 Pro 128GB','Xiaomi-Redmi-Note-9-Pro-128GB',250000,'گوشی شیائومی ردمی نوت ۹ با ۱۲۸ گیگ حافظه ','2021-03-07 18:19:10','2021-03-15 18:29:20',10,'images/1615141150393.0134xiaomi-redmi-note-9-pro-128gb.jpg','<table dir=\"rtl\" style=\"border-collapse: collapse; width: 100%; height: 40px; border-style: none; margin-left: auto; margin-right: auto;\" border=\"1\">\r\n<tbody>\r\n<tr style=\"height: 21px;\">\r\n<td dir=\"rtl\" style=\"width: 48.3899%; height: 40px; text-align: center;\">برند</td>\r\n<td style=\"width: 48.4988%; height: 40px; text-align: center;\">شیائومی</td>\r\n</tr>\r\n</tbody>\r\n</table>'),(17,'Samsung Galaxy A71 ','Samsung-Galaxy-A71-128gb',8500000,'گوشی سامسونگ A۷۱ مدل ۱۲۸ گیگ','2021-03-07 18:28:41','2021-03-08 22:09:25',10,'images/1615141721151.7097Samsung Galaxy A71 128gb.jpg',NULL),(18,'کاپشن کوهنوردی پلار نورث فیس','jacket-mountain-g458k',7500000,'کاپشن مخصوص کوهنوردی','2021-03-07 18:32:30','2021-03-07 18:32:30',9,'images/1615141949992.193jacket-mountain-g458k.jpg',NULL),(19,'لپ تاپ 14 اینچی ریزر مدل Blade','razer_blade_14_inch_rich-kid',24000000,'لپتاپ گیمینگ ریزر با پردازنده نسل۷ اینتل','2021-03-07 18:41:13','2021-03-09 17:28:50',11,'images/1615142473062.4133razer-blade-14_inch.jpg','<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:80%\">\r\n	<tbody>\r\n		<tr>\r\n			<td style=\"text-align:center\">پوتک</td>\r\n			<td style=\"text-align:center\">مدل لپتاپ</td>\r\n		</tr>\r\n		<tr>\r\n			<td style=\"text-align:center\">14 inch</td>\r\n			<td style=\"text-align:center\">سایز</td>\r\n		</tr>\r\n		<tr>\r\n			<td style=\"text-align:center\">گیمینگ</td>\r\n			<td style=\"text-align:center\">سبک لپتاپ</td>\r\n		</tr>\r\n	</tbody>\r\n</table>\r\n\r\n<p style=\"text-align:center\">&nbsp;</p>\r\n'),(20,'ONE-PLUS Nord 5G - 128gb','one-plus-nord-5g-128gb',6250000,'گوشی وان پلاس نورد با ۱۲۸ گیگ حافظه','2021-03-08 14:12:04','2021-03-08 22:22:37',10,'images/1615212724076.483one-pluse-nord.jpg','<table cellspacing=\"0\" style=\"border-collapse:collapse; width:100%\">\r\n	<tbody>\r\n		<tr>\r\n			<td style=\"border-bottom:1px solid #000000; border-left:1px solid #000000; border-right:none; border-top:1px solid #000000; width:50%\">\r\n			<p style=\"text-align:center\"><span style=\"font-family:Lohit Devanagari\">وان پلاس</span></p>\r\n			</td>\r\n			<td style=\"border-bottom:1px solid #000000; border-left:1px solid #000000; border-right:1px solid #000000; border-top:1px solid #000000; width:50%\">\r\n			<p style=\"text-align:center\"><span style=\"font-family:Lohit Devanagari\">برند </span></p>\r\n			</td>\r\n		</tr>\r\n		<tr>\r\n			<td style=\"border-bottom:1px solid #000000; border-left:1px solid #000000; border-right:none; border-top:none; width:50%\">\r\n			<p style=\"text-align:center\"><span style=\"font-family:Lohit Devanagari\">۱۲۸ </span>gb</p>\r\n			</td>\r\n			<td style=\"border-bottom:1px solid #000000; border-left:1px solid #000000; border-right:1px solid #000000; border-top:none; width:50%\">\r\n			<p style=\"text-align:center\"><span style=\"font-family:Lohit Devanagari\">حافظه</span></p>\r\n			</td>\r\n		</tr>\r\n	</tbody>\r\n</table>\r\n');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-15 22:58:42
