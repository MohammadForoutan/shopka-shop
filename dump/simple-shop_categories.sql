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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `link` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
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
  UNIQUE KEY `link_21` (`link`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (2,'همه','all','همه محصولات','2021-03-05 14:53:01','2021-03-05 14:53:01'),(9,'لباس','clothes','انواع لباس','2021-03-07 17:24:17','2021-03-07 18:13:02'),(10,'موبایل','mobile','دسته بندی موبایل ها','2021-03-07 18:07:51','2021-03-07 18:07:51'),(11,'لپتاپ و کامپیوتر','compuer_and_laptop','لپتاپ و کامپیوتر اداری','2021-03-07 18:36:42','2021-03-08 12:55:04'),(13,'s','dsdds','sdsdds','2021-03-14 13:13:33','2021-03-14 13:13:33');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-15 22:58:43
