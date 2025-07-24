-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 14, 2025 at 09:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_pawnshop`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_auctioned_items`
--

CREATE TABLE `tbl_auctioned_items` (
  `Item_ID` int(11) NOT NULL,
  `Item_Value` float(8,2) DEFAULT NULL,
  `Description` varchar(75) DEFAULT NULL,
  `Net_Value` float(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_auctioned_items`
--

INSERT INTO `tbl_auctioned_items` (`Item_ID`, `Item_Value`, `Description`, `Net_Value`) VALUES
(3, 3213.00, '1233232', 33.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customer`
--

CREATE TABLE `tbl_customer` (
  `Customer_ID` int(11) NOT NULL,
  `Customer_FirstName` varchar(20) NOT NULL,
  `Customer_MiddleInitial` char(2) DEFAULT NULL,
  `Customer_LastName` varchar(20) NOT NULL,
  `Customer_Birthday` date NOT NULL,
  `Customer_Address` varchar(50) NOT NULL,
  `Customer_Nationality` varchar(20) NOT NULL,
  `Customer_Gender` enum('Male','Female','Other') NOT NULL,
  `Status` enum('Active','Inactive') NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_customer`
--

INSERT INTO `tbl_customer` (`Customer_ID`, `Customer_FirstName`, `Customer_MiddleInitial`, `Customer_LastName`, `Customer_Birthday`, `Customer_Address`, `Customer_Nationality`, `Customer_Gender`, `Status`) VALUES
(1, 'John Cyrus', 'M', 'Yleaña', '2002-05-29', 'maa', 'Filipino', 'Male', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_item`
--

CREATE TABLE `tbl_item` (
  `Item_ID` int(11) NOT NULL,
  `Pawnticket_ID` int(11) DEFAULT NULL,
  `Item_Value` float(8,2) DEFAULT NULL,
  `Description` varchar(75) DEFAULT NULL,
  `Interest` int(10) DEFAULT NULL,
  `Net_Value` float(8,2) DEFAULT NULL,
  `category` enum('Appliances','Jewelries','Gadgets','Others') NOT NULL,
  `Is_Hidden` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_item`
--

INSERT INTO `tbl_item` (`Item_ID`, `Pawnticket_ID`, `Item_Value`, `Description`, `Interest`, `Net_Value`, `category`, `Is_Hidden`) VALUES
(1, 1, 23000.00, 'ip12/126gb', 23000, 23000.00, 'Gadgets', 1),
(2, 2, 3.00, '123', 3, 3.00, 'Appliances', 1),
(3, 3, 33.00, '1233232', 333, 33.00, 'Jewelries', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pawnticket`
--

CREATE TABLE `tbl_pawnticket` (
  `Pawnticket_ID` int(11) NOT NULL,
  `Customer_ID` int(11) DEFAULT NULL,
  `Principal_Value` float(8,2) DEFAULT NULL,
  `Maturity_Date` date DEFAULT NULL,
  `Expiry_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_pawnticket`
--

INSERT INTO `tbl_pawnticket` (`Pawnticket_ID`, `Customer_ID`, `Principal_Value`, `Maturity_Date`, `Expiry_Date`) VALUES
(1, 1, 23000.00, '2025-03-15', '2025-07-08'),
(2, 1, 3.00, '2025-04-13', '2025-07-12'),
(3, 1, 33.00, '3412-12-04', '0321-12-13'),
(4, 1, 232.00, '2025-02-27', '2025-03-15');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_payment`
--

CREATE TABLE `tbl_payment` (
  `Payment_ID` int(11) NOT NULL,
  `Pawnticket_ID` int(11) DEFAULT NULL,
  `Date_Paid` date DEFAULT NULL,
  `Amount_Paid` float(8,2) DEFAULT NULL,
  `PaymentType` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_payment`
--

INSERT INTO `tbl_payment` (`Payment_ID`, `Pawnticket_ID`, `Date_Paid`, `Amount_Paid`, `PaymentType`) VALUES
(1, 4, '2025-03-13', 321312.00, 'Cash');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_redeemed_items`
--

CREATE TABLE `tbl_redeemed_items` (
  `Redeemed_ID` int(11) NOT NULL,
  `Pawnticket_ID` int(11) NOT NULL,
  `Item_Value` float(10,2) NOT NULL,
  `Redeemed_Value` float(10,2) NOT NULL,
  `Redeemed_Date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_redeemed_items`
--

INSERT INTO `tbl_redeemed_items` (`Redeemed_ID`, `Pawnticket_ID`, `Item_Value`, `Redeemed_Value`, `Redeemed_Date`) VALUES
(1, 2, 3.00, 3.00, '2025-03-14 20:02:54');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_renew`
--

CREATE TABLE `tbl_renew` (
  `Renew_ID` int(11) NOT NULL,
  `Payment_ID` int(11) DEFAULT NULL,
  `New_Principal_Value` float(8,2) DEFAULT NULL,
  `Maturity_Date` date DEFAULT NULL,
  `Expiration_Date` date DEFAULT NULL,
  `Penalty` float(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_renew`
--

INSERT INTO `tbl_renew` (`Renew_ID`, `Payment_ID`, `New_Principal_Value`, `Maturity_Date`, `Expiration_Date`, `Penalty`) VALUES
(1, 1, 232.00, '2025-02-27', '2025-03-15', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_renewed_items`
--

CREATE TABLE `tbl_renewed_items` (
  `Pawnticket_ID` int(11) NOT NULL,
  `Item_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_renewed_items`
--

INSERT INTO `tbl_renewed_items` (`Pawnticket_ID`, `Item_ID`) VALUES
(4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sold_items`
--

CREATE TABLE `tbl_sold_items` (
  `Sold_ID` int(11) NOT NULL,
  `Item_ID` int(11) NOT NULL,
  `Sale_Price` decimal(10,2) NOT NULL,
  `Sold_Date` datetime DEFAULT current_timestamp(),
  `Customer_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_sold_items`
--

INSERT INTO `tbl_sold_items` (`Sold_ID`, `Item_ID`, `Sale_Price`, `Sold_Date`, `Customer_ID`) VALUES
(1, 1, 3232131.00, '2025-03-15 04:06:07', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_auctioned_items`
--
ALTER TABLE `tbl_auctioned_items`
  ADD PRIMARY KEY (`Item_ID`);

--
-- Indexes for table `tbl_customer`
--
ALTER TABLE `tbl_customer`
  ADD PRIMARY KEY (`Customer_ID`);

--
-- Indexes for table `tbl_item`
--
ALTER TABLE `tbl_item`
  ADD PRIMARY KEY (`Item_ID`),
  ADD KEY `fk_pawnticket_id` (`Pawnticket_ID`);

--
-- Indexes for table `tbl_pawnticket`
--
ALTER TABLE `tbl_pawnticket`
  ADD PRIMARY KEY (`Pawnticket_ID`),
  ADD KEY `Customer_ID` (`Customer_ID`);

--
-- Indexes for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD PRIMARY KEY (`Payment_ID`),
  ADD KEY `Pawnticket_ID` (`Pawnticket_ID`);

--
-- Indexes for table `tbl_redeemed_items`
--
ALTER TABLE `tbl_redeemed_items`
  ADD PRIMARY KEY (`Redeemed_ID`),
  ADD KEY `fk_redeemed_pawnticket` (`Pawnticket_ID`);

--
-- Indexes for table `tbl_renew`
--
ALTER TABLE `tbl_renew`
  ADD PRIMARY KEY (`Renew_ID`),
  ADD KEY `Payment_ID` (`Payment_ID`);

--
-- Indexes for table `tbl_renewed_items`
--
ALTER TABLE `tbl_renewed_items`
  ADD PRIMARY KEY (`Pawnticket_ID`,`Item_ID`),
  ADD KEY `Item_ID` (`Item_ID`);

--
-- Indexes for table `tbl_sold_items`
--
ALTER TABLE `tbl_sold_items`
  ADD PRIMARY KEY (`Sold_ID`),
  ADD KEY `fk_sold_item` (`Item_ID`),
  ADD KEY `fk_customer` (`Customer_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_auctioned_items`
--
ALTER TABLE `tbl_auctioned_items`
  MODIFY `Item_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_customer`
--
ALTER TABLE `tbl_customer`
  MODIFY `Customer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_item`
--
ALTER TABLE `tbl_item`
  MODIFY `Item_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_pawnticket`
--
ALTER TABLE `tbl_pawnticket`
  MODIFY `Pawnticket_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  MODIFY `Payment_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_redeemed_items`
--
ALTER TABLE `tbl_redeemed_items`
  MODIFY `Redeemed_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_renew`
--
ALTER TABLE `tbl_renew`
  MODIFY `Renew_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_sold_items`
--
ALTER TABLE `tbl_sold_items`
  MODIFY `Sold_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_auctioned_items`
--
ALTER TABLE `tbl_auctioned_items`
  ADD CONSTRAINT `fk_auctioned_item` FOREIGN KEY (`Item_ID`) REFERENCES `tbl_item` (`Item_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_item`
--
ALTER TABLE `tbl_item`
  ADD CONSTRAINT `fk_item_pawnticket` FOREIGN KEY (`Pawnticket_ID`) REFERENCES `tbl_pawnticket` (`Pawnticket_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_pawnticket`
--
ALTER TABLE `tbl_pawnticket`
  ADD CONSTRAINT `fk_pawnticket_customer` FOREIGN KEY (`Customer_ID`) REFERENCES `tbl_customer` (`Customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_payment`
--
ALTER TABLE `tbl_payment`
  ADD CONSTRAINT `fk_payment_pawnticket` FOREIGN KEY (`Pawnticket_ID`) REFERENCES `tbl_pawnticket` (`Pawnticket_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_redeemed_items`
--
ALTER TABLE `tbl_redeemed_items`
  ADD CONSTRAINT `fk_redeemed_pawnticket` FOREIGN KEY (`Pawnticket_ID`) REFERENCES `tbl_pawnticket` (`Pawnticket_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_renew`
--
ALTER TABLE `tbl_renew`
  ADD CONSTRAINT `fk_renew_payment` FOREIGN KEY (`Payment_ID`) REFERENCES `tbl_payment` (`Payment_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_renewed_items`
--
ALTER TABLE `tbl_renewed_items`
  ADD CONSTRAINT `fk_renewed_item` FOREIGN KEY (`Item_ID`) REFERENCES `tbl_item` (`Item_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_renewed_pawnticket` FOREIGN KEY (`Pawnticket_ID`) REFERENCES `tbl_pawnticket` (`Pawnticket_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_sold_items`
--
ALTER TABLE `tbl_sold_items`
  ADD CONSTRAINT `fk_sold_items_customer` FOREIGN KEY (`Customer_ID`) REFERENCES `tbl_customer` (`Customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sold_items_item` FOREIGN KEY (`Item_ID`) REFERENCES `tbl_item` (`Item_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
