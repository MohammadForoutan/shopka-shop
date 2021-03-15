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
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('3VqzkYe0XNWS913J4yFcSa1aiU8yCJyC','2021-03-16 14:37:19','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"DT4CrQmkgoNenk8rqSBKCPng\"}','2021-03-15 14:37:19','2021-03-15 14:37:19'),('6GfLDoTm-ndXeQOAAN-ZI-xWhiLh8vND','2021-03-16 18:07:57','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"MYE-cYv_rzwPKlKy5BNsAd7X\"}','2021-03-15 18:07:57','2021-03-15 18:07:57'),('B_J7L_Kqkl__NRfWp14rfDR2xwYb-tMT','2021-03-16 14:37:19','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"-0HqMptibJUmzrEbTwgucuOL\",\"flash\":{}}','2021-03-15 14:37:19','2021-03-15 14:37:19'),('fujuJHzuiPM027x3PVIdD5bxxcj3DdIr','2021-03-16 18:10:09','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"QrNJWKj-9ykC1eNQ4xvfzrsu\",\"flash\":{}}','2021-03-15 18:10:09','2021-03-15 18:10:09'),('IVzpAZdV293r5QUJWNLnWZGrjZZRd3B6','2021-03-16 15:02:57','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"V-GJHSzikL-twKqcmgmsNUHI\",\"flash\":{}}','2021-03-15 15:02:57','2021-03-15 15:02:57'),('jk2Hc7yanb8tYiozheMz6MbbWW7U55hv','2021-03-16 18:10:09','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"UCKw9WcGF_cNoiXFaKMaewtW\"}','2021-03-15 18:10:09','2021-03-15 18:10:09'),('m83mzFujJbeXSK2cSrcgWL4ONiacoypg','2021-03-16 18:07:57','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"2Cl4ZNDkAHoougXBO7A7F8UC\",\"flash\":{}}','2021-03-15 18:07:57','2021-03-15 18:07:57'),('R3YrKuQUXCNWhkprjLHAubpr77-j4oT7','2021-03-16 14:31:21','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"RWzvVkstwg72mSf5lmrayVYQ\",\"flash\":{}}','2021-03-15 14:31:21','2021-03-15 14:31:21'),('t8FXfuOTHRPbVdZ63y3eVs35zG9F3BF8','2021-03-16 19:07:42','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"0-ZmX-oGmZ-42D6lam2aa8DW\",\"flash\":{},\"isLoggedIn\":true,\"user\":{\"id\":1,\"name\":\"محمدرضا فروتن\",\"email\":\"test1@test.com\",\"password\":\"$2a$12$dYpfxGNjAjTDFx40Gkg2vOEBit7wQesgtJZauCj7m.B3jKQ8RMnw.\",\"resetToken\":null,\"resetTokenExpiration\":\"2021-03-05T16:48:28.000Z\",\"avatar\":\"images/1615818855943.923linux, mint svg icon.svg\",\"createdAt\":\"2021-03-05T11:48:23.000Z\",\"updatedAt\":\"2021-03-15T14:34:15.000Z\",\"accessLevelId\":2}}','2021-03-15 18:10:09','2021-03-15 19:07:42'),('UWYPDPQzHGfy8VtIyxMpvvPWb3fnGbUu','2021-03-16 14:31:21','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"XMjSrIyePYMVLYO7Qwsovx5a\"}','2021-03-15 14:31:21','2021-03-15 14:31:21'),('VBhxyantRsebNkDhBGFXd0FmPinseijA','2021-03-16 15:02:57','{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"csrfSecret\":\"4VwdjqSoHQiVtw0-C2sOrciT\"}','2021-03-15 15:02:57','2021-03-15 15:02:57');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
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
