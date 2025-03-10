-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: project_name
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `constants`
--

DROP TABLE IF EXISTS `constants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `constants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `constants`
--

LOCK TABLES `constants` WRITE;
/*!40000 ALTER TABLE `constants` DISABLE KEYS */;
INSERT INTO `constants` VALUES (2,'COMPANY_NAME','HyCody');
/*!40000 ALTER TABLE `constants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nativeName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `iconUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES (5,'Armenian','╒А╒б╒╡╒е╓А╒е╒╢','hy','https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/2560px-Flag_of_Armenia.svg.png',1),(6,'English','Enlgish','en','https://t4.ftcdn.net/jpg/10/89/19/83/360_F_1089198330_ceRIsLmMJDKMW0jRKrE69lS4SJYRJ1eC.jpg',1);
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `navbar`
--

DROP TABLE IF EXISTS `navbar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `navbar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentId` int DEFAULT NULL,
  `orderId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `navbar_parentId_fkey` (`parentId`),
  CONSTRAINT `navbar_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `navbar` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navbar`
--

LOCK TABLES `navbar` WRITE;
/*!40000 ALTER TABLE `navbar` DISABLE KEYS */;
INSERT INTO `navbar` VALUES (22,'Home','/',NULL,1,1),(28,'About','/about',NULL,2,1),(29,'Contact','/contact',NULL,3,1);
/*!40000 ALTER TABLE `navbar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `navbar_item`
--

DROP TABLE IF EXISTS `navbar_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `navbar_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `navId` int NOT NULL,
  `languageId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `text` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `navbar_item_navId_fkey` (`navId`),
  KEY `navbar_item_languageId_fkey` (`languageId`),
  CONSTRAINT `navbar_item_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `language` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `navbar_item_navId_fkey` FOREIGN KEY (`navId`) REFERENCES `navbar` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navbar_item`
--

LOCK TABLES `navbar_item` WRITE;
/*!40000 ALTER TABLE `navbar_item` DISABLE KEYS */;
INSERT INTO `navbar_item` VALUES (13,22,5,1,'╘│╒м╒н╒б╒╛╒╕╓А'),(14,22,6,1,'Home'),(30,28,5,1,'╒Д╒е╓А ╒┤╒б╒╜╒л╒╢'),(31,28,6,1,'About Us'),(32,29,5,1,'╘┐╒б╒║'),(33,29,6,1,'Contact');
/*!40000 ALTER TABLE `navbar_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `text`
--

DROP TABLE IF EXISTS `text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `text` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `text`
--

LOCK TABLES `text` WRITE;
/*!40000 ALTER TABLE `text` DISABLE KEYS */;
INSERT INTO `text` VALUES (8,'HOME_HERO_TITLE'),(9,'HOME_HERO_DESCRIPTION'),(10,'HOME_SEO_TITLE'),(11,'HOME_SEO_DESCRIPTION'),(12,'HOME_SEO_KEYWORDS');
/*!40000 ALTER TABLE `text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `text_content`
--

DROP TABLE IF EXISTS `text_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `text_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `textId` int NOT NULL,
  `languageId` int NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `text_content_textId_fkey` (`textId`),
  KEY `text_content_languageId_fkey` (`languageId`),
  CONSTRAINT `text_content_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `language` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `text_content_textId_fkey` FOREIGN KEY (`textId`) REFERENCES `text` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `text_content`
--

LOCK TABLES `text_content` WRITE;
/*!40000 ALTER TABLE `text_content` DISABLE KEYS */;
INSERT INTO `text_content` VALUES (14,8,5,'╒Д╒е╒о ╒О╒е╓А╒╢╒б╒г╒л╓А'),(15,8,6,'BIG TITLE'),(16,9,5,'╒У╒╕╓Д╓А ╒╢╒п╒б╓А╒б╒г╓А╒╕╓В╒й╒╡╒╕╓В╒╢'),(17,9,6,'Small description'),(18,10,5,'╒О╒е╓А╒╢╒б╒г╒л╓А'),(19,10,6,'Title'),(20,11,5,'╒Ж╒п╒б╓А╒б╒г╓А╒╕╓В╒й╒╡╒╕╓В╒╢'),(21,11,6,'Descripition'),(22,12,5,'╒в╒б╒╝, ╒в╒б╒╝, ╒в╒б╒╝'),(23,12,6,'word, word, word');
/*!40000 ALTER TABLE `text_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-27 12:11:19
