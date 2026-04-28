-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 28, 2026 at 10:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lumina_books_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_pages`
--

CREATE TABLE `about_pages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'About Us',
  `hero_description` text NOT NULL,
  `our_story` text NOT NULL,
  `our_mission` text NOT NULL,
  `our_values` text NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `contact_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_pages`
--

INSERT INTO `about_pages` (`id`, `title`, `hero_description`, `our_story`, `our_mission`, `our_values`, `contact_email`, `contact_phone`, `contact_address`, `created_at`, `updated_at`) VALUES
(1, 'Updated About TTT   T', 'Updated description   T', 'Updated story T', 'To connect readers with exceptional books while fostering a love for reading across all ages and backgrounds. T', 'We believe in quality over quantity, carefully curating our collection to ensure every book meets our high standards. Our commitment to customer satisfaction drives everything we do. T', 'contact@luminabooks.comT', '+1 (555) 123-4567 T', '123 Book Street, Reading City, RC 12345 T', '2026-04-02 00:24:02', '2026-04-18 08:39:21');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `stock_threshold` int(11) NOT NULL DEFAULT 10,
  `isbn` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `preview_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preview_content`)),
  `preview_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preview_images`)),
  `pages` int(11) DEFAULT NULL,
  `language` varchar(255) NOT NULL DEFAULT 'English',
  `format` varchar(255) NOT NULL DEFAULT 'Paperback',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `average_rating` decimal(2,1) NOT NULL DEFAULT 0.0,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `category_id`, `title`, `author`, `description`, `price`, `stock`, `stock_threshold`, `isbn`, `publisher`, `image`, `preview_content`, `preview_images`, `pages`, `language`, `format`, `is_featured`, `average_rating`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', 12.99, 49, 10, '978-0743273565', 'Scribner', NULL, NULL, NULL, 180, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:35'),
(2, 1, 'To Kill a Mockingbird', 'Harper Lee', 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', 14.99, 45, 10, '978-0061120084', 'Harper Perennial', NULL, NULL, NULL, 336, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:35'),
(6, 3, 'Clean Code', 'Robert C. Martin', 'A handbook of agile software craftsmanship for writing clean, maintainable code.', 39.99, 40, 10, '978-0132350884', 'Prentice Hall', NULL, NULL, NULL, 464, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:35'),
(7, 3, 'Design Patterns', 'Gang of Four', 'Elements of reusable object-oriented software design patterns.', 44.99, 20, 10, '978-0201633610', 'Addison-Wesley', NULL, NULL, NULL, 395, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-15 04:37:40'),
(8, 3, 'The Pragmatic Programmer', 'David Thomas & Andrew Hunt', 'Your journey to mastery in software development.', 42.99, 35, 10, '978-0135957059', 'Addison-Wesley', NULL, NULL, NULL, 352, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:36'),
(9, 4, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'A groundbreaking narrative of humanity\'s creation and evolution.', 22.99, 55, 10, '978-0062316097', 'Harper', NULL, NULL, NULL, 464, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:36'),
(10, 4, 'Guns, Germs, and Steel', 'Jared Diamond', 'The fates of human societies and why history unfolded as it did.', 19.99, 28, 10, '978-0393354324', 'W. W. Norton', NULL, NULL, NULL, 528, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-15 04:37:40'),
(11, 5, 'Atomic Habits', 'James Clear', 'An easy and proven way to build good habits and break bad ones.', 16.99, 70, 10, '978-0735211292', 'Avery', NULL, NULL, NULL, 320, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:36'),
(12, 5, 'The Lean Startup', 'Eric Ries', 'How today\'s entrepreneurs use continuous innovation to create radically successful businesses.', 17.99, 32, 10, '978-0307887894', 'Crown Business', NULL, NULL, NULL, 336, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-15 04:37:40'),
(13, 6, 'Thinking, Fast and Slow', 'Daniel Kahneman', 'A groundbreaking tour of the mind and the two systems that drive the way we think.', 15.99, 42, 10, '978-0374533557', 'Farrar, Straus and Giroux', NULL, NULL, NULL, 499, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-15 04:37:40'),
(14, 6, 'The Power of Now', 'Eckhart Tolle', 'A guide to spiritual enlightenment and living in the present moment.', 13.99, 38, 10, '978-1577314806', 'New World Library', NULL, NULL, NULL, 236, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-15 04:37:40'),
(15, 1, 'The Alchemist', 'Paulo Coelho', 'A magical story about following your dreams and listening to your heart.', 14.99, 65, 10, '978-0062315007', 'HarperOne', NULL, NULL, NULL, 208, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-01 11:26:29', '2026-04-22 08:46:36'),
(19, 1, 'To Kill a Mockingbird', 'Harper Lee', 'Classic novel about justice and race.', 14.99, 30, 10, '9780061120084', 'J.B. Lippincott', 'covers/mockingbird.jpg', NULL, '[\"covers\\/mock1.jpg\",\"covers\\/mock2.jpg\"]', 336, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 02:46:35', '2026-04-23 02:57:14'),
(20, 1, 'Brave New World', 'Aldous Huxley', 'Dystopian futuristic society.', 13.50, 24, 10, '9780060850524', 'Harper Perennial', 'covers/brave.jpg', NULL, '[\"covers\\/brave1.jpg\",\"covers\\/brave2.jpg\"]', 288, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-23 02:57:14', '2026-04-23 03:49:20'),
(23, 3, 'Java: The Complete Reference', 'Herbert Schildt', 'Comprehensive Java guide.', 45.00, 22, 10, '9781260440232', 'McGraw-Hill', 'covers/java.jpg', NULL, '[\"covers\\/java1.jpg\",\"covers\\/java2.jpg\"]', 1248, 'English', 'Hardcover', 0, 0.0, 'approved', '2026-04-02 08:29:53', '2026-04-23 02:57:14'),
(24, 3, 'Head First Design Patterns', 'Eric Freeman', 'Visual guide to design patterns.', 39.99, 20, 10, '9780596007126', 'O\'Reilly', 'covers/patterns.jpg', NULL, '[\"covers\\/patterns1.jpg\",\"covers\\/patterns2.jpg\"]', 694, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 10:54:54', '2026-04-23 02:57:14'),
(25, 1, 'The Catcher in the Rye', 'J.D. Salinger', 'A teenage boy\'s account of his experiences in New York City after being expelled from prep school.', 13.99, 46, 10, '978-0316769174', 'Little, Brown', NULL, NULL, NULL, 277, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-12 04:20:58'),
(26, 1, 'Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners and marriage among the landed gentry of Georgian England.', 11.99, 54, 10, '978-0141439518', 'Penguin Classics', NULL, NULL, NULL, 432, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:31'),
(27, 1, 'Wuthering Heights', 'Emily Brontë', 'A tale of love and revenge amid the Yorkshire moors, spanning two generations.', 12.99, 35, 10, '978-0141439556', 'Penguin Classics', NULL, NULL, NULL, 352, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-03 02:20:27'),
(28, 1, 'The Hobbit', 'J.R.R. Tolkien', 'A fantasy adventure of a reluctant hobbit hero embarking on an unexpected quest.', 15.99, 62, 10, '978-0547928227', 'Houghton Mifflin Harcourt', NULL, NULL, NULL, 310, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:31'),
(29, 1, 'The Lord of the Rings', 'J.R.R. Tolkien', 'An epic fantasy journey through Middle-earth to destroy an ancient evil ring.', 29.99, 58, 10, '978-0544003415', 'Houghton Mifflin Harcourt', NULL, NULL, NULL, 1178, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:31'),
(30, 1, 'Jane Eyre', 'Charlotte Brontë', 'A gothic romance about a poor orphan girl and her relationship with a mysterious man.', 12.99, 42, 10, '978-0141441146', 'Penguin Classics', NULL, NULL, NULL, 477, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-22 08:46:31'),
(31, 1, 'Moby Dick', 'Herman Melville', 'An epic adventure about a captain\'s obsessive hunt for a white whale.', 16.99, 28, 10, '978-0142437247', 'Penguin Classics', NULL, NULL, NULL, 736, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(32, 1, 'The Count of Monte Cristo', 'Alexandre Dumas', 'A tale of adventure and revenge about an unjustly imprisoned man and his escape and transformation.', 17.99, 51, 10, '978-0140449266', 'Penguin Classics', NULL, NULL, NULL, 928, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:32'),
(36, 3, 'Python Cookbook', 'David Beazley & Brian K. Jones', 'Recipes and solutions for common Python programming tasks.', 36.99, 37, 10, '978-1449357337', 'O\'Reilly', NULL, NULL, NULL, 704, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(37, 3, 'JavaScript: The Good Parts', 'Douglas Crockford', 'A comprehensive guide to the best programming practices in JavaScript.', 29.99, 41, 10, '978-0596517748', 'O\'Reilly', NULL, NULL, NULL, 176, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(38, 3, 'Structure and Interpretation of Computer Programs', 'Hal Abelson, Jerry Sussman, Julie Sussman', 'A legendary MIT textbook on computer programming fundamentals.', 68.99, 15, 10, '978-0262510875', 'MIT Press', NULL, NULL, NULL, 688, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(39, 3, 'The C Programming Language', 'Brian W. Kernighan & Dennis M. Ritchie', 'The definitive guide to C programming from two of its creators.', 34.99, 29, 10, '978-0131103627', 'Prentice Hall', NULL, NULL, NULL, 274, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(40, 3, 'Code: The Hidden Language of Computer Hardware and Software', 'Charles Petzold', 'An exploration of the history and principles that underlie all digital technology.', 24.99, 39, 10, '978-0735611313', 'Prentice Hall', NULL, NULL, NULL, 400, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:32'),
(41, 3, 'Refactoring: Improving the Design of Existing Code', 'Martin Fowler', 'Techniques for restructuring code to improve its design without changing behavior.', 51.99, 22, 10, '978-0201485677', 'Addison-Wesley', NULL, NULL, NULL, 464, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(42, 4, 'The Silk Road: Connecting Cultures and Commerce', 'Peter Frankopan', 'A fascinating exploration of the trade routes that shaped world history.', 21.99, 34, 10, '978-0374246326', 'Farrar, Straus and Giroux', NULL, NULL, NULL, 448, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:32'),
(43, 4, 'The Fall of the Roman Empire', 'Christopher Kelly', 'A gripping account of Rome\'s transformation and the barbarian invasions.', 19.99, 30, 10, '978-0393327588', 'W. W. Norton', NULL, NULL, NULL, 432, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(44, 4, 'The American Civil War: A Military History', 'John Keegan', 'A comprehensive military analysis of America\'s bloodiest conflict.', 24.99, 27, 10, '978-0394746739', 'Knopf', NULL, NULL, NULL, 536, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(45, 4, 'Empires of the Atlantic World', 'David Cannadine', 'A comparative history of the British and American imperial experiences.', 23.99, 31, 10, '978-0300107173', 'Yale University Press', NULL, NULL, NULL, 640, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(46, 5, 'Good to Great', 'Jim Collins', 'Why some companies make the leap and other don\'t - and how to transform your business.', 27.99, 45, 10, '978-0066620992', 'HarperBusiness', NULL, NULL, NULL, 320, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:32'),
(47, 5, 'The Innovators', 'Walter Isaacson', 'How a group of hackers, geniuses, and geeks created the digital revolution.', 19.99, 38, 10, '978-1476708690', 'Simon & Schuster', NULL, NULL, NULL, 656, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(48, 5, 'Zero to One', 'Peter Thiel & Blake Masters', 'Notes on startups, or how to build the future - lessons from the PayPal founder.', 16.99, 50, 10, '978-0804139298', 'Crown Business', NULL, NULL, '[]', 225, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:32'),
(49, 5, 'Crushing It!', 'Gary Vaynerchuk', 'How to leverage social media to build your personal brand and business.', 17.99, 43, 10, '978-0061914516', 'HarperStudio', NULL, NULL, NULL, 272, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(50, 5, 'The Art of the Deal', 'Donald Trump & Tony Schwartz', 'Behind-the-scenes stories and strategies from a legendary dealmaker.', 16.99, 25, 10, '978-0345409041', 'Ballantine', NULL, NULL, NULL, 355, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(51, 6, 'Mindset: The New Psychology of Success', 'Carol S. Dweck', 'How a simple change of mindset can improve your success in business and life.', 17.99, 67, 10, '978-0345472328', 'Ballantine', NULL, NULL, NULL, 288, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:33'),
(52, 6, 'The 7 Habits of Highly Effective People', 'Stephen Covey', 'Principles for personal transformation and achieving your goals.', 18.99, 59, 10, '978-1451639619', 'Free Press', NULL, NULL, NULL, 432, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-22 08:46:33'),
(53, 6, 'Man\'s Search for Meaning', 'Viktor Frankl', 'A Holocaust survivor\'s reflections on meaning, freedom, and human resilience.', 15.99, 53, 10, '978-0807014271', 'Beacon Press', NULL, NULL, NULL, 165, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:33'),
(54, 6, 'Flow: The Psychology of Optimal Experience', 'Mihaly Csikszentmihalyi', 'The science of happiness and how to achieve deep engagement in work and life.', 17.99, 36, 10, '978-0061339202', 'Harper Perennial', NULL, NULL, NULL, 464, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(55, 6, 'The Four Agreements', 'Don Miguel Ruiz', 'A practical guide to personal freedom and fulfillment through ancient wisdom.', 14.99, 61, 10, '978-1878424310', 'Amber-Allen Publishing', NULL, NULL, NULL, 160, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-22 08:46:33'),
(56, 1, 'The Odyssey', 'Homer', 'An ancient Greek epic about a hero\'s long journey home after the Trojan War.', 13.99, 32, 10, '978-0143039952', 'Penguin Classics', NULL, NULL, NULL, 448, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(57, 1, 'Frankenstein', 'Mary Shelley', 'A Gothic horror novel about a scientist and his monstrous creation.', 11.99, 40, 10, '978-0486282114', 'Dover', NULL, NULL, NULL, 288, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(58, 1, 'Dracula', 'Bram Stoker', 'A classic Gothic vampire novel told through letters, diary entries, and newspaper clippings.', 12.99, 38, 10, '978-0486411095', 'Dover', NULL, NULL, NULL, 432, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:34'),
(59, 1, 'The Strange Case of Dr Jekyll and Mr Hyde', 'Robert Louis Stevenson', 'A novella about a doctor\'s descent into madness through a dual personality.', 9.99, 50, 10, '978-0486264685', 'Dover', NULL, NULL, NULL, 80, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(60, 1, 'The Picture of Dorian Gray', 'Oscar Wilde', 'A novel about vanity and corruption featuring a man whose portrait ages instead of him.', 10.99, 46, 10, '978-0486274867', 'Dover', NULL, NULL, NULL, 128, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(63, 3, 'Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 'The definitive comprehensive textbook on computer algorithms and data structures.', 89.99, 18, 10, '978-0262033848', 'MIT Press', NULL, NULL, NULL, 1312, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(64, 3, 'Domain-Driven Design', 'Eric Evans', 'A guide to tackling complexity in software architecture through domain-driven design.', 54.99, 20, 10, '978-0321125675', 'Addison-Wesley', NULL, NULL, NULL, 560, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(65, 3, 'Test Driven Development', 'Kent Beck', 'By Example - a practical guide to writing better code through testing.', 44.99, 24, 10, '978-0321146533', 'Addison-Wesley', NULL, NULL, NULL, 240, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(66, 4, 'The French Revolution', 'Thomas Carlyle', 'A vivid narrative history of one of history\'s most transformative events.', 22.99, 26, 10, '978-0486424569', 'Dover', NULL, NULL, NULL, 720, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(67, 4, 'Napoleon: A Life', 'Andrew Roberts', 'A comprehensive biography of the French military leader and emperor.', 25.99, 35, 10, '978-0393247602', 'W. W. Norton', NULL, NULL, NULL, 926, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-22 08:46:34'),
(68, 5, 'Venture Capitalists at War', 'Dan Senor & Saul Singer', 'The story of Israeli entrepreneurs and their impact on global innovation.', 20.99, 28, 10, '978-0446556286', 'Twelve', NULL, NULL, NULL, 400, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(69, 5, 'The Startup Way', 'Eric Ries', 'How modern companies use entrepreneurial management to transform culture and drive growth.', 18.99, 41, 10, '978-0385539578', 'Crown Business', NULL, NULL, NULL, 336, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(70, 6, 'Emotional Intelligence', 'Daniel Goleman', 'Why it can matter more than IQ - a groundbreaking exploration of emotions and success.', 17.99, 54, 10, '978-0553375305', 'Bantam', NULL, NULL, NULL, 368, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-22 08:46:34'),
(71, 6, 'Radical Acceptance', 'Tara Brach', 'Embracing your life with the heart of a Buddha - finding peace through acceptance.', 17.99, 32, 10, '978-0553380163', 'Bantam', NULL, NULL, NULL, 336, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(72, 1, 'The Name of the Wind', 'Patrick Rothfuss', 'The first book in an epic fantasy series about a legendary figure retelling his past.', 18.99, 56, 10, '978-0756404741', 'DAW Books', NULL, NULL, NULL, 662, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-02 11:46:15', '2026-04-22 08:46:34'),
(73, 1, 'American Gods', 'Neil Gaiman', 'A dark fantasy mixing mythology with modern America in an epic road trip narrative.', 17.99, 47, 10, '978-0380789023', 'William Morrow', NULL, NULL, NULL, 635, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 11:46:15', '2026-04-22 08:46:35'),
(75, 8, 'dd', 'dd', 'rgrg', 23.00, 50, 10, NULL, NULL, 'book-covers/ar4BszueLprxCnpzM4joQZe410epUeku201rBIy3.webp', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/book-covers\\/3eIBdaeuVa0JlmEblWfog3Ywhs9bGzbdaQPf0Ysj.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 22:08:26', '2026-04-11 06:00:39'),
(76, 7, 'rrr', 'rr', 'vegrgerg', 43.00, 43, 10, NULL, NULL, 'book-covers/Iw2Sbf1m53tEVFSrBcSVMbdakfqKvmDqsXWk82Se.jpg', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/book-covers\\/WQbSCXdhjFVtrfTZozUa4XKqOVuQTihWoye5G1xg.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-02 23:15:56', '2026-04-05 21:56:03'),
(77, 1, 't4t', 't4', '43t4433', 45.00, 44, 10, NULL, NULL, 'book-covers/q9Vxmjx0hxCYixfOnRXunJ5gBPTpJwC8mrvQQ3G8.png', NULL, '[\"http:\\/\\/localhost:8000\\/storage\\/book-covers\\/RzADfo4CsVv5QqUsQV3GV41V0EEzDSBepTFKP5EL.png\",\"http:\\/\\/localhost:8000\\/storage\\/book-covers\\/zN8NVmT1Wi0qGXheQZmnd336juIBIryTT2O40qOp.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-03 02:28:07', '2026-04-05 21:56:03'),
(78, 1, 'AAAAAAAAAAAAAA', 'AAAAAAAAAAAAA', 'AAAAAAAAAAAAAA', 22.00, 5, 10, NULL, NULL, 'book-covers/zIYEXqfYco7ULod5SLP2ZijYmx52vHDgNr5oaQtl.webp', NULL, NULL, NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-05 22:11:20', '2026-04-11 06:01:26'),
(79, 3, 'aaaa', 'aaa', 'aaa', 4234.00, 2411, 10, NULL, NULL, 'book-covers/wpqgx1kenFZupU3prV5JHQ6XZKhxydPBLSQlyHb7.png', NULL, NULL, NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-09 08:19:52', '2026-04-12 04:20:58'),
(81, 1, 'The Shadow of the Wind', 'Carlos Ruiz Zafón', 'A literary mystery set in post-war Barcelona about a forgotten book and the secrets it holds.', 15.99, 45, 10, '978-0143034902', 'Penguin Books', 'covers/shadow-wind.jpg', NULL, '[\"https://example.com/preview/81-p1.jpg\", \"https://example.com/preview/81-p2.jpg\", \"https://example.com/preview/81-p3.jpg\", \"https://example.com/preview/81-p4.jpg\", \"https://example.com/preview/81-p5.jpg\"]', 528, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:00:00', '2026-04-22 08:46:30'),
(83, 1, 'The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', 'A reclusive Hollywood icon finally decides to give her life story to an unknown magazine reporter.', 13.99, 55, 10, '978-1501139239', 'Atria Books', 'covers/evelyn-hugo.jpg', NULL, '[\"https://example.com/preview/83-p1.jpg\", \"https://example.com/preview/83-p2.jpg\", \"https://example.com/preview/83-p3.jpg\", \"https://example.com/preview/83-p4.jpg\", \"https://example.com/preview/83-p5.jpg\"]', 384, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:10:00', '2026-04-22 08:46:30'),
(84, 3, 'Clean Architecture', 'Robert C. Martin', 'A practical guide to software architecture, design, and patterns for building robust systems.', 42.00, 30, 10, '978-0134494166', 'Prentice Hall', 'covers/clean-arch.jpg', NULL, '[\"https://example.com/preview/84-p1.jpg\", \"https://example.com/preview/84-p2.jpg\", \"https://example.com/preview/84-p3.jpg\", \"https://example.com/preview/84-p4.jpg\", \"https://example.com/preview/84-p5.jpg\"]', 432, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:15:00', '2026-04-22 08:46:30'),
(85, 4, 'Sapiens: A Graphic History', 'Yuval Noah Harari', 'The story of humanity adapted into a vibrant graphic novel format by David Vandermeulen.', 24.99, 40, 10, '978-0062993427', 'Harper Perennial', 'covers/sapiens-graphic.jpg', NULL, '[\"https://example.com/preview/85-p1.jpg\", \"https://example.com/preview/85-p2.jpg\", \"https://example.com/preview/85-p3.jpg\", \"https://example.com/preview/85-p4.jpg\", \"https://example.com/preview/85-p5.jpg\"]', 240, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:20:00', '2026-04-15 04:37:40'),
(86, 5, 'Thinking in Bets', 'Annie Duke', 'Making smarter decisions when you don\'t have all the facts, written by a former World Series poker champion.', 18.99, 35, 10, '978-0735216365', 'Portfolio', 'covers/thinking-bets.jpg', NULL, '[\"https://example.com/preview/86-p1.jpg\", \"https://example.com/preview/86-p2.jpg\", \"https://example.com/preview/86-p3.jpg\", \"https://example.com/preview/86-p4.jpg\", \"https://example.com/preview/86-p5.jpg\"]', 288, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:25:00', '2026-04-22 08:46:29'),
(87, 6, 'Maybe You Should Talk to Someone', 'Lori Gottlieb', 'A therapist goes to therapy, revealing the universal struggles and triumphs of the human experience.', 16.99, 50, 10, '978-1328662057', 'Houghton Mifflin', 'covers/talk-someone.jpg', NULL, '[\"https://example.com/preview/87-p1.jpg\", \"https://example.com/preview/87-p2.jpg\", \"https://example.com/preview/87-p3.jpg\", \"https://example.com/preview/87-p4.jpg\", \"https://example.com/preview/87-p5.jpg\"]', 432, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:30:00', '2026-04-15 04:37:40'),
(88, 1, 'Project Hail Mary', 'Andy Weir', 'A lone astronaut must save the earth from disaster in this gripping hard sci-fi adventure.', 19.99, 65, 10, '978-0593135204', 'Ballantine Books', 'covers/hail-mary.jpg', NULL, '[\"https://example.com/preview/88-p1.jpg\", \"https://example.com/preview/88-p2.jpg\", \"https://example.com/preview/88-p3.jpg\", \"https://example.com/preview/88-p4.jpg\", \"https://example.com/preview/88-p5.jpg\"]', 496, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:35:00', '2026-04-22 08:46:28'),
(89, 3, 'Refactoring UI', 'Adam Wathan & Steve Schoger', 'Learn how to design beautiful user interfaces by yourself without a degree in graphic design.', 35.00, 25, 10, '978-1234567890', 'Refactoring UI', 'covers/refactoring-ui.jpg', NULL, '[\"https://example.com/preview/89-p1.jpg\", \"https://example.com/preview/89-p2.jpg\", \"https://example.com/preview/89-p3.jpg\", \"https://example.com/preview/89-p4.jpg\", \"https://example.com/preview/89-p5.jpg\"]', 304, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:40:00', '2026-04-22 08:46:27'),
(90, 4, 'The Code Book', 'Simon Singh', 'The science of secrecy from ancient Egypt to quantum cryptography.', 17.50, 38, 10, '978-0385495325', 'Anchor', 'covers/code-book.jpg', NULL, '[\"https://example.com/preview/90-p1.jpg\", \"https://example.com/preview/90-p2.jpg\", \"https://example.com/preview/90-p3.jpg\", \"https://example.com/preview/90-p4.jpg\", \"https://example.com/preview/90-p5.jpg\"]', 416, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-12 05:45:00', '2026-04-15 04:37:40'),
(91, 1, 'Dune', 'Frank Herbert', 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the \"spice\" melange.', 1250.00, 13, 10, NULL, NULL, 'book-covers/qFPPpp50GOKXtNCo3RAYVbMqEIgEVNbWmM6Oeq8O.jpg', NULL, NULL, NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-15 01:58:22', '2026-04-19 04:45:37'),
(92, 1, 'DDDDDDDDDDDDDD', 'DDDDDDDDDD', 'DDDDDDDDDDDDDD', 234234.00, 33, 10, NULL, NULL, 'book-covers/2dqKrjgrAQJLDTubruL0ONvV5CEE4XF8dtEqkm98.jpg', NULL, NULL, NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-15 02:17:03', '2026-04-15 02:17:03'),
(93, 1, 'ADADAD', 'ADDADAD', 'AADADAADD', 3242.00, 23, 10, NULL, NULL, 'book-covers/XY2RmS3LnSziOBSxtLVnJjY8XTEzngA5qOOG4rYG.jpg', NULL, '[\"book-previews\\/OKDJq7rgoau0AJp2ZKGR8pylmTIJ8Z32TDKdHCJb.png\",\"book-previews\\/r5Xxyh6LbWY7gdEzTWFfallddH6MKh6qTIuxuxIA.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-15 02:24:23', '2026-04-15 02:30:03'),
(94, 1, 'qdqdqd', 'dqdqd', 'qdqdq', 334.00, 15, 10, NULL, NULL, 'book-covers/sxtoguyKlGumlWgyCquHZb3YEVtMh7nsiV4IWwHf.webp', NULL, NULL, NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-15 02:34:36', '2026-04-19 07:08:59'),
(96, 1, 'zzzzzzzzzzzz', 'zzzzzzzzzzzz', 'zzzz', 23142.00, 5, 10, NULL, NULL, 'book-covers/czBBysQonNVmcaOFCjjjrOF2KksWQBFOt9fDekkR.jpg', NULL, '[\"book-previews\\/jW2WPmCExcUlGud95tI5LNj27fMqKHSjogWWVCaI.png\",\"book-previews\\/srMvNH0b3txfYh1CrKHOeRy6ttbAyptPLHgNZ1hL.png\",\"book-previews\\/2AoxdMwtlJytX9ush4B9d7TaKRW53x1gF58mtnmE.png\"]', 20, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-15 02:59:33', '2026-04-21 10:27:14'),
(97, 7, 'cccccccccccc', 'cccccccccccccccc', 'ccccccccccccccc', 32423.00, 25, 10, NULL, NULL, 'book-covers/cHEfjqpTniv88qpKKZ2Z2sVo87bxm2IP8WHHWXm8.png', NULL, '[\"book-covers\\/I61XNiey6rwyZ7kYKxz0Ko9srFfTofuzq6FTYZgi.jpg\",\"book-covers\\/pooijeITJD5bUbvH6asTO5tiOADfxvVz2UfD5jhg.png\"]', 32, 'English', 'Paperback', 0, 4.5, 'approved', '2026-04-15 04:06:59', '2026-04-22 05:23:21'),
(100, 15, 'trtrtrt', 'trtrt', 'rtrtrtr', 556.00, 43343, 10, NULL, NULL, 'book-covers/Lyoxkrd4wTOzVe91ainI6DgI0aOh2oxG1Sm6qAWP.png', NULL, '[\"book-covers\\/YZokIcGlevGFyuBBpmuykPL0WATWb7ao8Pso5S4W.jpg\",\"book-covers\\/8mX6y0h9FM4rR4cbfyDpA2Ma0Fz28txziePlJRKv.png\"]', NULL, 'English', 'Paperback', 1, 0.0, 'approved', '2026-04-18 09:56:52', '2026-04-22 08:46:44'),
(101, 1, 'fefrfrfrfefe', 'rfeferferf', 'erferfeffer', 67.00, 28, 10, NULL, NULL, 'book-covers/mtq7EZbmgxlpA9GBQhh73A4lLnAsvC7irZJvnUZR.webp', NULL, '[\"book-covers\\/FegKN0CePSKoOB7BAV8uxztzQC6qIiRsy7V0EBO4.png\",\"book-covers\\/Ytz29Z5fjCJPWSe6SXTroT30wTf1647Yu5uw9Cvl.png\"]', NULL, 'English', 'Paperback', 1, 0.0, 'approved', '2026-04-18 09:59:36', '2026-04-22 08:46:43'),
(105, 1, 'SVS', 'ssds', 'dsdsdsd', 324.00, 32, 10, NULL, NULL, 'book-covers/zLsSgNcwjUDj2lz1F36eTOHN7fGDi8wn0J2Q3zyF.jpg', NULL, '[\"book-covers\\/FMk8pAjKwC6gotuMfN5uo8Xp944Z7GHvsrf5awWF.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-20 09:31:56', '2026-04-20 09:31:56'),
(107, 1, 'SVSS', 'sdsd', 'sdsd', 3.00, 3, 10, NULL, NULL, 'book-covers/kNXqQbQUaAmY9jrX0Wr1YjvHOJnI9kQZvk2xxFqs.jpg', NULL, '[\"book-covers\\/7uSpzDJ0nfIkwlK48w53IsMMoGPhwGbjzJ9IZYfN.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-20 10:52:04', '2026-04-20 11:13:52'),
(108, 1, 'q', 'q', 'q', 2.00, 2, 10, NULL, NULL, 'book-covers/VeWoouzFBLrzTo3h1ZftceZ1blnTfPN3Zz4dZc9j.jpg', NULL, '[\"book-previews\\/vIJRxiMVFoJMPI9VIhXdIqLWs45QfwzNDNTe8uL3.jpg\"]', NULL, 'English', 'Paperback', 0, 0.0, 'draft', '2026-04-20 11:21:48', '2026-04-20 11:21:48'),
(109, 1, 'cc', 'cc', 'cc', 3.00, 3, 10, NULL, NULL, 'book-covers/f4pUmSkzCVkCqsovkjshKe7sF7Fbim6LJ7VVbQy7.png', NULL, '[\"book-previews\\/SHzLcwhsELuI9PFOfxu4g6ExddjCPVd8BvLB2hk1.jpg\"]', NULL, 'English', 'Paperback', 1, 0.0, 'draft', '2026-04-21 06:35:53', '2026-04-22 08:46:42'),
(110, 3, 'ENG', 'dd', 'dd', 33.00, 2, 10, NULL, NULL, 'book-covers/kO1R4TXQCYQLGTT7vtu5gmVCytPrrbRCHxDbSlLI.jpg', NULL, '[\"book-previews\\/Dw1sABDbLjVHAsK3y2URboFREx5Pas2VnkR5lsX0.png\"]', 33, 'Bengali', 'Paperback', 1, 3.0, 'approved', '2026-04-21 06:56:55', '2026-04-23 07:31:22'),
(111, 1, 'C', 'C', 'C', 3.00, 2, 10, NULL, NULL, 'book-covers/aSFkPqROZT8Hvc1S1xiePbgwfIwhfj4ZrJ0XMNhy.png', NULL, '[\"book-previews\\/ZS8Z7R33KFzviN68Hf4C24CIgmmkB9hiZXnNkHNx.png\"]', 34, 'English', 'Hardcover', 1, 0.0, 'approved', '2026-04-21 07:18:31', '2026-04-22 08:46:38'),
(112, 1, 'Z', 'Z', 'Z', 1.00, 0, 10, NULL, NULL, 'book-covers/rqoEcd5rbj78J5Tttxu3uZ4gCZ7rv1KYRnDRXIkM.png', NULL, '[\"book-previews\\/Lklg1yYgf6lsSutbtdGxNjyIEq5TnLbFTHygAjlP.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-22 09:23:50', '2026-04-23 03:49:20'),
(113, 10, 'AAB', 'AAB', 'tbbbbbbbbbbbbbbbbbbbb', 234.00, 4, 10, NULL, NULL, 'book-covers/CDwyuMdeVfC09h1SjrHvwFMwZ76p3ZIdTEXkkvz1.jpg', NULL, '[\"book-previews\\/ZuRxEDEP1TC4aftysyspJgsB5PX9I25IXtMzH7Ex.png\"]', NULL, 'English', 'Paperback', 0, 0.0, 'approved', '2026-04-23 05:39:12', '2026-04-23 07:22:52'),
(114, 10, 'ABAB', 'efef', 'efeff', 32.00, 3, 10, NULL, NULL, 'book-covers/9fK5P04kJhgSo5Buy1wq98N1JV7CGe68GDz47cQm.png', NULL, '[\"book-previews\\/I2nBWPGQANKDzKujgSQjB8eDyO4XhzITjqdyGVq4.jpg\",\"book-previews\\/4EToNab4Kl9FyeDFQ1NX22xoB7AKxifgKo4JdmID.png\"]', 12, 'Bengali', 'Hardcover', 0, 0.0, 'approved', '2026-04-23 05:47:14', '2026-04-23 05:47:14'),
(115, 5, 'Book1', 'dsvdsv', 'sdvsdvsdv', 222.00, 12, 10, NULL, NULL, 'book-covers/kWUZ6qlKAkw44Z2VDy36MrrADHYrEDiIsElD8Uez.png', NULL, '[\"book-previews\\/6Je1p4NEWiERK7B5w0GaEknWODDvQBVTRV1eIbqy.jpg\",\"book-previews\\/B8GSlEVP1aIG6QAVaqyEZKna481Rw8kQUeWAA9a4.jpg\",\"book-previews\\/X69QARHVBLEweqky3eMTP0N3GZ65KgNR2v6yprfD.png\"]', 444, 'Bengali', 'Hardcover', 0, 0.0, 'approved', '2026-04-23 07:36:11', '2026-04-23 07:37:27');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'book',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Fiction', 'fiction', 'Fictional novels and stories', 'book', '2026-04-01 11:26:29', '2026-04-01 11:26:29'),
(3, 'Technology', 'technology', 'Programming and tech books', 'book', '2026-04-01 11:26:29', '2026-04-01 11:26:29'),
(4, 'History', 'history', 'Historical accounts and analysis', 'book', '2026-04-01 11:26:29', '2026-04-01 11:26:29'),
(5, 'Business', 'business', 'Business and entrepreneurship', 'book', '2026-04-01 11:26:29', '2026-04-01 11:26:29'),
(6, 'Self-Help', 'self-help', 'Personal development books', 'book', '2026-04-01 11:26:29', '2026-04-01 11:26:29'),
(7, 'Pokemon', 'pokemon', NULL, 'book', '2026-04-02 00:37:25', '2026-04-02 00:37:25'),
(8, 'AAA', 'aaa', NULL, 'book', '2026-04-02 03:30:26', '2026-04-02 03:30:26'),
(10, 'Sifi', 'sifi', NULL, 'book', '2026-04-03 08:59:20', '2026-04-03 08:59:20'),
(12, 'Literature', 'literature', NULL, 'course', '2026-04-05 23:37:49', '2026-04-05 23:37:49'),
(13, 'Language', 'language', NULL, 'course', '2026-04-05 23:37:49', '2026-04-05 23:37:49'),
(14, 'hi', 'hi', NULL, 'course', '2026-04-05 23:43:00', '2026-04-05 23:43:00'),
(15, 'bye', 'bye', NULL, 'course', '2026-04-05 23:52:09', '2026-04-05 23:52:09'),
(24, 'A', 'a', NULL, 'course', '2026-04-23 09:36:29', '2026-04-23 09:36:29');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `instructor` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `syllabus` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_hours` int(11) NOT NULL DEFAULT 0,
  `lessons_count` int(11) NOT NULL DEFAULT 0,
  `level` varchar(255) NOT NULL DEFAULT 'beginner',
  `image` varchar(255) DEFAULT NULL,
  `preview_video` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `category` varchar(255) NOT NULL DEFAULT 'general',
  `language` varchar(255) NOT NULL DEFAULT 'English',
  `access_time` varchar(255) NOT NULL DEFAULT 'Lifetime',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `slug`, `instructor`, `description`, `syllabus`, `price`, `duration_hours`, `lessons_count`, `level`, `image`, `preview_video`, `is_featured`, `is_active`, `status`, `category`, `language`, `access_time`, `created_at`, `updated_at`) VALUES
(1, 'IELTS Band 8+ Complete Preparation', 'ielts-band-8-complete', 'Dr. Sarah Mitchell', 'Master all four IELTS modules with proven strategies, practice tests, and expert feedback. Achieve your target band score with our comprehensive preparation program.', NULL, 79.99, 14, 25, 'intermediate', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 1, 'published', 'ielts-preparation', 'English', 'Lifetime', '2026-04-06 02:56:09', '2026-04-22 08:50:13'),
(2, 'Academic Writing for University Students', 'academic-writing-university', 'Prof. James Anderson', 'Learn to write research papers, essays, and dissertations at university level. Master APA, MLA, and Chicago citation styles.', NULL, 59.99, 13, 25, 'advanced', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, 1, 'published', 'academic-english', 'English', 'Lifetime', '2026-04-06 02:56:09', '2026-04-22 08:50:12'),
(3, 'Business English for Corporate Professionals', 'business-english-corporate', 'Rachel Thompson', 'Develop professional communication skills for the corporate world. Master presentations, negotiations, and business correspondence.', NULL, 69.99, 12, 25, 'intermediate', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'business-communication', 'English', 'Lifetime', '2026-04-06 02:56:09', '2026-04-22 08:50:03'),
(4, 'Creative Writing: From Idea to Publication', 'creative-writing-publication', 'Emma Richardson', 'Transform your creative ideas into polished manuscripts. Learn fiction writing, character development, and the publishing process.', NULL, 49.99, 28, 25, 'beginner', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'creative-writing', 'English', 'Lifetime', '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(5, 'Spoken English Fluency Masterclass', 'spoken-english-fluency', 'Michael Davis', 'Speak English confidently in any situation. Improve pronunciation, fluency, and natural conversation skills.', NULL, 39.99, 11, 25, 'beginner', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'spoken-english', 'English', 'Lifetime', '2026-04-06 02:56:09', '2026-04-22 08:50:03'),
(6, 'IELTS Writing Intensive Course', 'ielts-writing-intensive', 'Dr. Sarah Mitchell', 'Focused IELTS writing preparation with band-specific strategies, model answers, and personalized feedback techniques.', NULL, 45.99, 20, 25, 'intermediate', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'ielts-preparation', 'English', 'Lifetime', '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(7, 'English Grammar Complete Guide', 'english-grammar-complete', 'Prof. James Anderson', 'Master English grammar from basic to advanced levels. Perfect for students, professionals, and test preparation.', NULL, 34.99, 22, 25, 'beginner', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'academic-english', 'English', 'Lifetime', '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(8, 'Business Presentation Excellence', 'business-presentation-excellence', 'Rachel Thompson', 'Create and deliver impactful business presentations that persuade, inform, and inspire your audience.', NULL, 54.99, 18, 25, 'intermediate', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'business-communication', 'English', 'Lifetime', '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(9, 'Short Story Writing Workshop', 'short-story-writing', 'Emma Richardson', 'Learn the craft of short story writing from concept to completion. Write compelling stories that captivate readers.', NULL, 29.99, 15, 25, 'beginner', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'creative-writing', 'English', 'Lifetime', '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(10, 'English for Travel & Tourism', 'english-travel-tourism', 'Michael Davis', 'Essential English for travelers and tourism professionals. Navigate airports, hotels, restaurants, and tourist spots with confidence.', NULL, 24.99, 12, 25, 'beginner', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'spoken-english', 'English', 'Lifetime', '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(13, 'B', 'b', 'B', 'B', NULL, 33.00, 0, 3, 'beginner', NULL, 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 04:38:11', '2026-04-06 04:38:11'),
(14, 'Tinker Course', 'tinker-course-1775472572', 'Test', 'Test', NULL, 10.00, 1, 1, 'beginner', NULL, NULL, 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 04:49:32', '2026-04-06 04:49:32'),
(15, '4t', '4t', '4t', '4t', NULL, 44.00, 0, 3, 'beginner', NULL, 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 05:20:21', '2026-04-06 05:20:21'),
(16, 'Verification Course', 'verification-course-1775474525', 'Verification Instructor', 'Verification Description', NULL, 10.00, 1, 2, 'beginner', NULL, NULL, 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 05:22:05', '2026-04-06 05:22:05'),
(18, 'qqq', 'qqq', 'qq', 'qqq', NULL, 112.00, 0, 3, 'beginner', NULL, 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 05:31:35', '2026-04-06 05:31:35'),
(19, 'ssss', 'ssss', 's', 's', NULL, 33.00, 0, 3, 'beginner', NULL, 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 05:41:31', '2026-04-06 05:41:31'),
(20, 'tbtbttbtbt', 'tbtbttbtbt', 'bttbtbtb', 'bbtb', NULL, 555.00, 0, 1, 'beginner', NULL, 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 06:31:45', '2026-04-06 06:31:45'),
(24, 'bfvfvfvfv', 'bfvfvfvfv', 'b', 'fv', NULL, 4.00, 0, 2, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/kr2k37Tl1L9pr66U3kGQ.png', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(25, 'AB', 'ab-course', 'AB Instructor', 'This is a comprehensive test course named AB with full curriculum, quizzes, and resources.', NULL, 100.00, 5, 7, 'beginner', 'https://placehold.co/600x400/orange/white?text=AB+Course', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-06 08:15:56', '2026-04-22 08:50:01'),
(26, 'TEST', 'test', 't', 't', NULL, 55.00, 0, 3, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/9YlzYEljudcmRjphnGhJ.jpg', 'http://localhost:8000/storage/courses/videos/fLsMHEoAKvKcTvqT8RqH.mp4', 1, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-07 01:11:56', '2026-04-22 08:50:14'),
(27, 'Complete Web Development Bootcamp', 'complete-web-development-bootcamp', 'Sharar Hossain', 'Learn HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects and master modern web development from scratch.', NULL, 2999.00, 3, 6, 'beginner', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 0, 1, 'published', 'programming', 'English', 'Lifetime', '2026-04-07 08:51:09', '2026-04-22 08:50:01'),
(28, 'TEST2', 'test2', 'T', 'rgrgrg', NULL, 5.00, 0, 3, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/Nu6e6YAiLcff40ABvHt3.jpg', 'http://localhost:8000/storage/courses/videos/wQEDEKAH3F3wPKQqgZ7X.mp4', 1, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-07 10:30:04', '2026-04-22 08:50:15'),
(29, 'ttttttttttttt', 'ttttttttttttt', 'tttttttt', 'tttttttt', NULL, 0.00, 0, 1, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/C5PJFFc7DieVA1pfLmmC.png', 'http://localhost:8000/storage/courses/videos/PQAvtEEOXeW6Y4bt1haD.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-09 07:35:28', '2026-04-22 08:50:00'),
(30, 'AAASSSSAAAA', 'aaassssaaaa', 'dfewf', 'sdcsdcsc', NULL, 33.00, 0, 2, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/9vqSKM1MShvWCx1sHmLt.png', 'http://localhost:8000/storage/courses/videos/fYKiE479g2kZU43vWLv3.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-09 08:51:39', '2026-04-16 06:20:28'),
(31, 'zsszszszszss', 'zsszszszszss', 'zsszszszs', 'sacavd', NULL, 45454.00, 1, 3, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/piK4DVZT8nvZwsS5Q7Bh.jpg', 'http://localhost:8000/storage/courses/videos/9vbBS1AxGUcHLEOG716W.mp4', 0, 1, 'published', 'bye', 'English', 'Lifetime', '2026-04-18 10:08:06', '2026-04-22 08:50:00'),
(32, 'ascascascsacss', 'ascascascsacss', 'cscscsc', 'vccv', NULL, 0.00, 0, 1, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/xCyNtIKjDjaiu683UqiZ.png', 'http://localhost:8000/storage/courses/videos/K20YdHRzKufOX1guVd8c.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-18 10:12:00', '2026-04-18 10:12:00'),
(33, 'QQQQWQWQW', 'qqqqwqwqw', 'adsd', 'zxczxc', NULL, 0.00, 0, 1, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/ZwreZAzGwyVcLEg9OCTT.jpg', 'http://localhost:8000/storage/courses/videos/1YmuOVu9FJAztucwOXxF.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-20 11:16:14', '2026-04-20 11:16:14'),
(34, 'qq', 'qq', 'qq', '22', NULL, 2.00, 0, 1, 'beginner', 'http://localhost:8000/storage/courses/thumbnails/Cu5clbQFixoqE2BI2Itu.png', 'http://localhost:8000/storage/courses/videos/7GQyFDjjzUlhYdu9skCt.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-20 11:20:19', '2026-04-20 11:20:19'),
(35, 'vfvfvf', 'vfvfvf', 'fvfvf', 'vffvfv', NULL, 0.00, 0, 0, 'beginner', NULL, NULL, 0, 0, 'draft', 'hi', 'English', 'Lifetime', '2026-04-21 03:37:32', '2026-04-22 08:50:21'),
(36, 'z', 'z', 'zz', 'z', NULL, 11.00, 0, 1, 'beginner', 'http://127.0.0.1:8000/storage/courses/thumbnails/pxPN6H5ESJuGLPf88Foh.png', 'http://127.0.0.1:8000/storage/courses/videos/IaDr3wsR697PpYfkqd4U.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-21 05:58:31', '2026-04-22 08:50:23'),
(37, 'ede', 'ede', 'wdwd', 'dwd', NULL, 22.00, 1, 2, 'intermediate', 'http://127.0.0.1:8000/storage/courses/thumbnails/uXMHdYRUs6ZStRM4dtmg.png', 'http://127.0.0.1:8000/storage/courses/videos/R29IWit2VzKI8KOaUhKc.mp4', 0, 0, 'draft', 'hi', 'Bengali', '1 Year', '2026-04-21 10:17:40', '2026-04-22 08:50:24'),
(38, 'Advanced English Grammar', 'advanced-english-grammar', 'Michael Brown', 'Master English grammar rules.', NULL, 49.99, 12, 36, 'Intermediate', 'courses/grammar.jpg', 'https://www.youtube.com/embed/2z7f5Xz7v0I', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-23 02:58:46', '2026-04-23 02:58:46'),
(39, 'Creative Storytelling', 'creative-storytelling', 'Emma Watson', 'Learn storytelling techniques.', NULL, 39.99, 8, 24, 'Beginner', 'courses/story.jpg', 'https://www.youtube.com/embed/Nj-hdQMa3uA', 0, 1, 'published', 'writing', 'English', 'Lifetime', '2026-04-23 02:58:46', '2026-04-23 02:58:46'),
(40, 'Quantum Physics Basics', 'quantum-physics-basics', 'Dr. Brian Cox', 'Intro to quantum world.', NULL, 59.99, 10, 30, 'Beginner', 'courses/quantum.jpg', 'https://www.youtube.com/embed/p7bzE1E5PMY', 0, 1, 'published', 'science', 'English', 'Lifetime', '2026-04-23 02:58:46', '2026-04-23 02:58:46'),
(41, 'Space Science & Astronomy', 'space-science-astronomy', 'Neil Tyson', 'Explore the universe.', NULL, 44.99, 9, 27, 'Beginner', 'courses/space.jpg', 'https://www.youtube.com/embed/X9otDixAtFw', 0, 1, 'published', 'science', 'English', 'Lifetime', '2026-04-23 02:58:46', '2026-04-23 02:58:46'),
(42, 'Java DSA Bootcamp', 'java-dsa-bootcamp', 'Sarah Lee', 'Data structures using Java.', NULL, 79.99, 18, 54, 'Advanced', 'courses/dsa.jpg', 'https://www.youtube.com/embed/8hly31xKli0', 0, 1, 'published', 'technology', 'English', 'Lifetime', '2026-04-23 02:58:46', '2026-04-23 02:58:46'),
(43, 'Full Stack Development', 'full-stack-development', 'Alex Morgan', 'Frontend + backend complete.', NULL, 89.99, 20, 60, 'Intermediate', 'courses/fullstack.jpg', 'https://www.youtube.com/embed/nu_pCVPKzTk', 0, 1, 'published', 'technology', 'English', 'Lifetime', '2026-04-23 02:58:46', '2026-04-23 02:58:46'),
(44, 'ABBQA', 'abbqa', 'efewf', 'efefef', NULL, 44.00, 1, 2, 'beginner', 'http://127.0.0.1:8000/storage/courses/thumbnails/FsGU60r74vIZO1HNRFpS.jpeg', 'http://127.0.0.1:8000/storage/courses/videos/G4ldXJQpEAAlevbmU7uP.mp4', 0, 1, 'published', 'literature', 'English', 'Lifetime', '2026-04-23 06:28:05', '2026-04-23 06:43:14'),
(45, 'ZXX', 'zxx', 'ZX', 'dsfvsfw', NULL, 11.00, 1, 1, 'intermediate', 'http://localhost:8000/api/storage/courses/thumbnails/eQ645qtLUbAH5Jeif97n.jpg', 'http://127.0.0.1:8000/storage/courses/videos/CxlKNhG3Y7aYN5nSL8W0.mp4', 0, 1, 'published', 'language', 'English', 'Lifetime', '2026-04-27 10:49:59', '2026-04-27 22:39:39');

-- --------------------------------------------------------

--
-- Table structure for table `course_lessons`
--

CREATE TABLE `course_lessons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'video',
  `description` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `video_file` varchar(255) DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_free_preview` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_lessons`
--

INSERT INTO `course_lessons` (`id`, `section_id`, `title`, `type`, `description`, `video_url`, `video_file`, `duration_minutes`, `order`, `is_free_preview`, `created_at`, `updated_at`) VALUES
(1, 1, 'Understanding IELTS Listening Format', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 35, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(2, 1, 'Section 1: Everyday Conversations', 'video', NULL, NULL, NULL, 29, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(3, 1, 'Section 2: Monologues & Presentations', 'video', NULL, NULL, NULL, 22, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(4, 1, 'Section 3: Academic Discussions', 'video', NULL, NULL, NULL, 15, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(5, 1, 'Section 4: Academic Lectures', 'video', NULL, NULL, NULL, 45, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(6, 2, 'Skimming & Scanning Techniques', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 44, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(7, 2, 'True/False/Not Given Strategies', 'video', NULL, NULL, NULL, 32, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(8, 2, 'Matching Headings & Information', 'video', NULL, NULL, NULL, 27, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(9, 2, 'Summary Completion Practice', 'video', NULL, NULL, NULL, 40, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(10, 2, 'Time Management for Reading', 'video', NULL, NULL, NULL, 36, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(11, 3, 'Describing Graphs & Charts', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 42, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(12, 3, 'Process Diagrams', 'video', NULL, NULL, NULL, 40, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(13, 3, 'Maps & Plans', 'video', NULL, NULL, NULL, 39, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(14, 3, 'Comparative Data Analysis', 'video', NULL, NULL, NULL, 42, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(15, 3, 'Band 8+ Vocabulary for Task 1', 'video', NULL, NULL, NULL, 44, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(16, 4, 'Essay Structure & Planning', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 36, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(17, 4, 'Opinion Essays', 'video', NULL, NULL, NULL, 14, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(18, 4, 'Discussion Essays', 'video', NULL, NULL, NULL, 39, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(19, 4, 'Problem-Solution Essays', 'video', NULL, NULL, NULL, 36, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(20, 4, 'Advanced Cohesion & Coherence', 'video', NULL, NULL, NULL, 40, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(21, 5, 'Part 1: Introduction & Interview', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 33, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(22, 5, 'Part 2: Long Turn Strategy', 'video', NULL, NULL, NULL, 42, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(23, 5, 'Part 3: Discussion Skills', 'video', NULL, NULL, NULL, 23, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(24, 5, 'Pronunciation & Intonation', 'video', NULL, NULL, NULL, 18, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(25, 5, 'Fluency & Coherence Techniques', 'video', NULL, NULL, NULL, 26, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(26, 6, 'Choosing a Research Topic', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 38, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(27, 6, 'Literature Review Methods', 'video', NULL, NULL, NULL, 33, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(28, 6, 'Research Design & Methodology', 'video', NULL, NULL, NULL, 33, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(29, 6, 'Data Collection Techniques', 'video', NULL, NULL, NULL, 35, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(30, 6, 'Ethical Considerations', 'video', NULL, NULL, NULL, 24, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(31, 7, 'Thesis Statement Development', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 33, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(32, 7, 'Argumentative Essay Structure', 'video', NULL, NULL, NULL, 34, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(33, 7, 'Critical Analysis & Evaluation', 'video', NULL, NULL, NULL, 30, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(34, 7, 'Counterarguments & Rebuttals', 'video', NULL, NULL, NULL, 16, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(35, 7, 'Academic Tone & Style', 'video', NULL, NULL, NULL, 27, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(36, 8, 'Abstract & Introduction', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 25, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(37, 8, 'Methodology Section', 'video', NULL, NULL, NULL, 28, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(38, 8, 'Results & Discussion', 'video', NULL, NULL, NULL, 24, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(39, 8, 'Conclusion & Recommendations', 'video', NULL, NULL, NULL, 40, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(40, 8, 'Peer Review Process', 'video', NULL, NULL, NULL, 18, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(41, 9, 'APA Style Guide', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 11, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(42, 9, 'MLA Format Essentials', 'video', NULL, NULL, NULL, 45, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(43, 9, 'Chicago Manual of Style', 'video', NULL, NULL, NULL, 41, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(44, 9, 'Avoiding Plagiarism', 'video', NULL, NULL, NULL, 17, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(45, 9, 'Reference Management Tools', 'video', NULL, NULL, NULL, 43, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(46, 10, 'Proposal Development', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 34, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(47, 10, 'Chapter Organization', 'video', NULL, NULL, NULL, 22, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(48, 10, 'Literature Synthesis', 'video', NULL, NULL, NULL, 30, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(49, 10, 'Data Analysis Presentation', 'video', NULL, NULL, NULL, 17, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(50, 10, 'Defense Preparation', 'video', NULL, NULL, NULL, 38, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(51, 11, 'Email Structure & Etiquette', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 37, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(52, 11, 'Formal vs Informal Tone', 'video', NULL, NULL, NULL, 22, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(53, 11, 'Request & Follow-up Emails', 'video', NULL, NULL, NULL, 25, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(54, 11, 'Complaint & Resolution Emails', 'video', NULL, NULL, NULL, 22, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(55, 11, 'Email Templates Library', 'video', NULL, NULL, NULL, 10, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(56, 12, 'Agenda Setting & Preparation', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 38, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(57, 12, 'Leading Effective Meetings', 'video', NULL, NULL, NULL, 24, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(58, 12, 'Participating in Discussions', 'video', NULL, NULL, NULL, 15, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(59, 12, 'Taking Meeting Minutes', 'video', NULL, NULL, NULL, 29, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(60, 12, 'Virtual Meeting Best Practices', 'video', NULL, NULL, NULL, 22, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(61, 13, 'Structuring Your Presentation', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 41, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(62, 13, 'Visual Aids & Slides', 'video', NULL, NULL, NULL, 26, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(63, 13, 'Delivery & Body Language', 'video', NULL, NULL, NULL, 24, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(64, 13, 'Handling Q&A Sessions', 'video', NULL, NULL, NULL, 32, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(65, 13, 'Persuasive Presentations', 'video', NULL, NULL, NULL, 34, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(66, 14, 'Opening Negotiations', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 21, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(67, 14, 'Making Proposals & Counteroffers', 'video', NULL, NULL, NULL, 11, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(68, 14, 'Agreeing & Disagreeing Politely', 'video', NULL, NULL, NULL, 42, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(69, 14, 'Closing Deals Professionally', 'video', NULL, NULL, NULL, 31, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(70, 14, 'Cross-Cultural Negotiation', 'video', NULL, NULL, NULL, 18, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(71, 15, 'Executive Summaries', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 43, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(72, 15, 'Progress Reports', 'video', NULL, NULL, NULL, 12, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(73, 15, 'Financial Reports', 'video', NULL, NULL, NULL, 37, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(74, 15, 'Analytical Reports', 'video', NULL, NULL, NULL, 43, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(75, 15, 'Action Plans & Recommendations', 'video', NULL, NULL, NULL, 24, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(76, 16, 'Discovering Your Writing Style', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 13, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(77, 16, 'Daily Writing Habits', 'video', NULL, NULL, NULL, 35, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(78, 16, 'Overcoming Writer\'s Block', 'video', NULL, NULL, NULL, 34, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(79, 16, 'Reading Like a Writer', 'video', NULL, NULL, NULL, 33, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(80, 16, 'Journaling for Creativity', 'video', NULL, NULL, NULL, 30, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(81, 17, 'Creating Memorable Characters', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 14, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(82, 17, 'Character Arcs & Growth', 'video', NULL, NULL, NULL, 26, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(83, 17, 'Dialogue That Sounds Real', 'video', NULL, NULL, NULL, 35, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(84, 17, 'Character Relationships', 'video', NULL, NULL, NULL, 35, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(85, 17, 'Villains & Antagonists', 'video', NULL, NULL, NULL, 42, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(86, 18, 'Three-Act Structure', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 34, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(87, 18, 'Plot Points & Turning Points', 'video', NULL, NULL, NULL, 37, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(88, 18, 'Subplots & Weaving', 'video', NULL, NULL, NULL, 31, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(89, 18, 'Pacing & Tension', 'video', NULL, NULL, NULL, 23, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(90, 18, 'Endings That Satisfy', 'video', NULL, NULL, NULL, 24, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(91, 19, 'Sensory Details', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 43, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(92, 19, 'Creating Atmosphere', 'video', NULL, NULL, NULL, 38, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(93, 19, 'Historical Settings', 'video', NULL, NULL, NULL, 33, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(94, 19, 'Fantasy World Building', 'video', NULL, NULL, NULL, 29, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(95, 19, 'Show Don\'t Tell', 'video', NULL, NULL, NULL, 11, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(96, 20, 'Self-Editing Techniques', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 27, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(97, 20, 'Working with Editors', 'video', NULL, NULL, NULL, 25, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(98, 20, 'Query Letters & Proposals', 'video', NULL, NULL, NULL, 25, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(99, 20, 'Traditional vs Self Publishing', 'video', NULL, NULL, NULL, 23, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(100, 20, 'Marketing Your Book', 'video', NULL, NULL, NULL, 19, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(101, 21, 'Vowel Sounds Mastery', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 32, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(102, 21, 'Consonant Clusters', 'video', NULL, NULL, NULL, 17, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(103, 21, 'Word Stress Patterns', 'video', NULL, NULL, NULL, 42, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(104, 21, 'Sentence Intonation', 'video', NULL, NULL, NULL, 31, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(105, 21, 'Connected Speech', 'video', NULL, NULL, NULL, 17, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(106, 22, 'Greetings & Introductions', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 19, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(107, 22, 'Small Talk Topics', 'video', NULL, NULL, NULL, 44, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(108, 22, 'Asking for Directions', 'video', NULL, NULL, NULL, 39, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(109, 22, 'Shopping & Ordering', 'video', NULL, NULL, NULL, 10, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(110, 22, 'Making Appointments', 'video', NULL, NULL, NULL, 10, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(111, 23, 'Party Conversations', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 26, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(112, 23, 'Expressing Opinions', 'video', NULL, NULL, NULL, 35, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(113, 23, 'Agreeing & Disagreeing', 'video', NULL, NULL, NULL, 24, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(114, 23, 'Telling Stories', 'video', NULL, NULL, NULL, 15, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(115, 23, 'Humor & Idioms', 'video', NULL, NULL, NULL, 15, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(116, 24, 'Phone Conversations', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 19, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(117, 24, 'Interview Preparation', 'video', NULL, NULL, NULL, 16, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(118, 24, 'Networking Events', 'video', NULL, NULL, NULL, 23, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(119, 24, 'Giving Directions at Work', 'video', NULL, NULL, NULL, 40, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(120, 24, 'Handling Difficult Conversations', 'video', NULL, NULL, NULL, 18, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(121, 25, 'Thinking in English', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 16, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(122, 25, 'Reducing Native Language Interference', 'video', NULL, NULL, NULL, 18, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(123, 25, 'Accent Reduction Techniques', 'video', NULL, NULL, NULL, 21, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(124, 25, 'Public Speaking Basics', 'video', NULL, NULL, NULL, 41, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(125, 25, 'Debate & Discussion Skills', 'video', NULL, NULL, NULL, 29, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(126, 26, 'Understanding Task 1 Requirements', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 39, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(127, 26, 'Bar Chart Descriptions', 'video', NULL, NULL, NULL, 12, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(128, 26, 'Line Graph Analysis', 'video', NULL, NULL, NULL, 17, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(129, 26, 'Pie Chart Comparisons', 'video', NULL, NULL, NULL, 26, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(130, 26, 'Table Data Interpretation', 'video', NULL, NULL, NULL, 16, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(131, 27, 'Process Diagrams Step by Step', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 11, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(132, 27, 'Map Descriptions', 'video', NULL, NULL, NULL, 19, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(133, 27, 'Multiple Graph Combinations', 'video', NULL, NULL, NULL, 17, 3, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(134, 27, 'Overview Writing', 'video', NULL, NULL, NULL, 18, 4, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(135, 27, 'Band 7+ Vocabulary', 'video', NULL, NULL, NULL, 21, 5, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(136, 28, 'Opinion Essay Framework', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 42, 1, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(137, 28, 'Discussion Essay Structure', 'video', NULL, NULL, NULL, 24, 2, 0, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(138, 28, 'Advantage/Disadvantage Essays', 'video', NULL, NULL, NULL, 23, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(139, 28, 'Problem/Solution Essays', 'video', NULL, NULL, NULL, 30, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(140, 28, 'Two-Part Question Essays', 'video', NULL, NULL, NULL, 44, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(141, 29, 'Complex Sentence Structures', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 15, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(142, 29, 'Conditional Sentences', 'video', NULL, NULL, NULL, 24, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(143, 29, 'Relative Clauses', 'video', NULL, NULL, NULL, 44, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(144, 29, 'Passive Voice Usage', 'video', NULL, NULL, NULL, 32, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(145, 29, 'Cohesive Devices', 'video', NULL, NULL, NULL, 22, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(146, 30, 'Timed Writing Practice', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 18, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(147, 30, 'Self-Assessment Rubrics', 'video', NULL, NULL, NULL, 20, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(148, 30, 'Common Mistakes to Avoid', 'video', NULL, NULL, NULL, 43, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(149, 30, 'Band Score Improvement Tips', 'video', NULL, NULL, NULL, 15, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(150, 30, 'Mock Test Analysis', 'video', NULL, NULL, NULL, 10, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(151, 31, 'Nouns & Pronouns', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 25, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(152, 31, 'Verbs & Verb Forms', 'video', NULL, NULL, NULL, 16, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(153, 31, 'Adjectives & Adverbs', 'video', NULL, NULL, NULL, 32, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(154, 31, 'Prepositions & Conjunctions', 'video', NULL, NULL, NULL, 11, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(155, 31, 'Interjections & Articles', 'video', NULL, NULL, NULL, 13, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(156, 32, 'Present Tenses', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 26, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(157, 32, 'Past Tenses', 'video', NULL, NULL, NULL, 37, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(158, 32, 'Future Tenses', 'video', NULL, NULL, NULL, 33, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(159, 32, 'Perfect Tenses', 'video', NULL, NULL, NULL, 33, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(160, 32, 'Continuous Tenses', 'video', NULL, NULL, NULL, 20, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(161, 33, 'Simple Sentences', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 32, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(162, 33, 'Compound Sentences', 'video', NULL, NULL, NULL, 30, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(163, 33, 'Complex Sentences', 'video', NULL, NULL, NULL, 39, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(164, 33, 'Compound-Complex Sentences', 'video', NULL, NULL, NULL, 31, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(165, 33, 'Sentence Fragments & Run-ons', 'video', NULL, NULL, NULL, 36, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(166, 34, 'Conditionals & Wishes', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 23, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(167, 34, 'Reported Speech', 'video', NULL, NULL, NULL, 13, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(168, 34, 'Relative Clauses', 'video', NULL, NULL, NULL, 18, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(169, 34, 'Participles & Gerunds', 'video', NULL, NULL, NULL, 32, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(170, 34, 'Subjunctive Mood', 'video', NULL, NULL, NULL, 41, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(171, 35, 'Subject-Verb Agreement', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 35, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(172, 35, 'Pronoun Reference', 'video', NULL, NULL, NULL, 39, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(173, 35, 'Modifier Placement', 'video', NULL, NULL, NULL, 20, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(174, 35, 'Parallel Structure', 'video', NULL, NULL, NULL, 40, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(175, 35, 'Punctuation Rules', 'video', NULL, NULL, NULL, 35, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(176, 36, 'Audience Analysis', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 20, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(177, 36, 'Objective Setting', 'video', NULL, NULL, NULL, 18, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(178, 36, 'Content Organization', 'video', NULL, NULL, NULL, 40, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(179, 36, 'Story Structure', 'video', NULL, NULL, NULL, 34, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(180, 36, 'Visual Planning', 'video', NULL, NULL, NULL, 10, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(181, 37, 'PowerPoint Best Practices', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 12, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(182, 37, 'Visual Hierarchy', 'video', NULL, NULL, NULL, 24, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(183, 37, 'Color & Typography', 'video', NULL, NULL, NULL, 21, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(184, 37, 'Data Visualization', 'video', NULL, NULL, NULL, 14, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(185, 37, 'Minimal Design Principles', 'video', NULL, NULL, NULL, 37, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(186, 38, 'Voice & Projection', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 43, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(187, 38, 'Body Language', 'video', NULL, NULL, NULL, 38, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(188, 38, 'Eye Contact', 'video', NULL, NULL, NULL, 44, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(189, 38, 'Managing Nerves', 'video', NULL, NULL, NULL, 22, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(190, 38, 'Using Props & Demos', 'video', NULL, NULL, NULL, 18, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(191, 39, 'Opening Hooks', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 26, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(192, 39, 'Interactive Elements', 'video', NULL, NULL, NULL, 29, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(193, 39, 'Storytelling Techniques', 'video', NULL, NULL, NULL, 27, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(194, 39, 'Handling Interruptions', 'video', NULL, NULL, NULL, 14, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(195, 39, 'Closing Impact', 'video', NULL, NULL, NULL, 43, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(196, 40, 'Preparing for Questions', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 44, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(197, 40, 'Difficult Question Handling', 'video', NULL, NULL, NULL, 33, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(198, 40, 'Panel Presentations', 'video', NULL, NULL, NULL, 42, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(199, 40, 'Follow-up Communication', 'video', NULL, NULL, NULL, 15, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(200, 40, 'Feedback Collection', 'video', NULL, NULL, NULL, 35, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(201, 41, 'What Makes a Great Short Story', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 14, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(202, 41, 'Finding Story Ideas', 'video', NULL, NULL, NULL, 39, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(203, 41, 'Point of View Selection', 'video', NULL, NULL, NULL, 22, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(204, 41, 'Setting the Scene', 'video', NULL, NULL, NULL, 30, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(205, 41, 'Theme & Subtext', 'video', NULL, NULL, NULL, 28, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(206, 42, 'Quick Character Sketches', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 15, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(207, 42, 'Showing vs Telling', 'video', NULL, NULL, NULL, 28, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(208, 42, 'Dialogue-Driven Character', 'video', NULL, NULL, NULL, 31, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(209, 42, 'Character Motivation', 'video', NULL, NULL, NULL, 37, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(210, 42, 'Supporting Characters', 'video', NULL, NULL, NULL, 30, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(211, 43, 'Single Scene Stories', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 34, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(212, 43, 'Multiple Scene Structure', 'video', NULL, NULL, NULL, 16, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(213, 43, 'Flash Fiction Techniques', 'video', NULL, NULL, NULL, 42, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(214, 43, 'Twist Endings', 'video', NULL, NULL, NULL, 12, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(215, 43, 'Open Endings', 'video', NULL, NULL, NULL, 22, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(216, 44, 'Finding Your Voice', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 13, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(217, 44, 'Descriptive Writing', 'video', NULL, NULL, NULL, 25, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(218, 44, 'Metaphor & Simile', 'video', NULL, NULL, NULL, 22, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(219, 44, 'Rhythm & Pacing', 'video', NULL, NULL, NULL, 18, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(220, 44, 'Revision Strategies', 'video', NULL, NULL, NULL, 35, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(221, 45, 'Self-Editing Checklist', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 14, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(222, 45, 'Beta Reader Feedback', 'video', NULL, NULL, NULL, 37, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(223, 45, 'Literary Magazine Submissions', 'video', NULL, NULL, NULL, 27, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(224, 45, 'Online Publishing Platforms', 'video', NULL, NULL, NULL, 22, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(225, 45, 'Building a Portfolio', 'video', NULL, NULL, NULL, 19, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(226, 46, 'Booking Flights', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 13, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(227, 46, 'Check-in Procedures', 'video', NULL, NULL, NULL, 35, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(228, 46, 'Security & Customs', 'video', NULL, NULL, NULL, 13, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(229, 46, 'Flight Announcements', 'video', NULL, NULL, NULL, 25, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(230, 46, 'Handling Delays & Issues', 'video', NULL, NULL, NULL, 45, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(231, 47, 'Making Reservations', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 35, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(232, 47, 'Check-in & Check-out', 'video', NULL, NULL, NULL, 42, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(233, 47, 'Room Service Requests', 'video', NULL, NULL, NULL, 14, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(234, 47, 'Complaints & Requests', 'video', NULL, NULL, NULL, 33, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(235, 47, 'Hotel Facilities', 'video', NULL, NULL, NULL, 21, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(236, 48, 'Making Reservations', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 21, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(237, 48, 'Reading Menus', 'video', NULL, NULL, NULL, 30, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(238, 48, 'Ordering Food', 'video', NULL, NULL, NULL, 30, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(239, 48, 'Special Dietary Requests', 'video', NULL, NULL, NULL, 40, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(240, 48, 'Paying the Bill', 'video', NULL, NULL, NULL, 21, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(241, 49, 'Asking for Directions', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 25, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(242, 49, 'Buying Tickets', 'video', NULL, NULL, NULL, 39, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(243, 49, 'Guided Tours', 'video', NULL, NULL, NULL, 21, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(244, 49, 'Shopping & Bargaining', 'video', NULL, NULL, NULL, 12, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(245, 49, 'Emergency Situations', 'video', NULL, NULL, NULL, 12, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(246, 50, 'Tour Guide Communication', 'video', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 39, 1, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(247, 50, 'Customer Service Skills', 'video', NULL, NULL, NULL, 37, 2, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(248, 50, 'Handling Complaints', 'video', NULL, NULL, NULL, 23, 3, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(249, 50, 'Cultural Sensitivity', 'video', NULL, NULL, NULL, 44, 4, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(250, 50, 'Professional Etiquette', 'video', NULL, NULL, NULL, 38, 5, 0, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(251, 51, 'Lesson 1', 'video', NULL, NULL, NULL, 0, 0, 0, '2026-04-06 04:49:32', '2026-04-06 04:49:32'),
(252, 53, 'Lesson 1', 'video', NULL, NULL, NULL, 30, 0, 0, '2026-04-06 05:22:05', '2026-04-06 05:22:05'),
(253, 53, 'Lesson 2', 'video', NULL, NULL, NULL, 30, 1, 0, '2026-04-06 05:22:05', '2026-04-06 05:22:05'),
(254, 56, 'dvdvdv', 'video', 'dvddv', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', NULL, 0, 0, 0, '2026-04-06 05:41:31', '2026-04-06 05:41:31'),
(255, 56, 'scsvcdv', 'video', 's', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', NULL, 0, 1, 0, '2026-04-06 05:41:31', '2026-04-06 05:41:31'),
(256, 56, 's', 'video', 's', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', NULL, 0, 2, 0, '2026-04-06 05:41:31', '2026-04-06 05:41:31'),
(257, 57, 'rrr', 'video', 'rrr', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', NULL, 0, 0, 0, '2026-04-06 06:31:45', '2026-04-06 06:31:45'),
(274, 65, 'rvrv', 'video', 'vrrr', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', NULL, 0, 0, 0, '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(275, 66, 'fvfvf', 'video', 'vfvfv', 'https://youtu.be/kZhAj8--t8w?si=3weAK0DDDqC3jbXo', NULL, 0, 0, 1, '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(276, 67, 'Basic English Grammar Lesson 1', 'video', 'Overview of what you will learn', 'https://www.youtube.com/embed/EngW7tLk6R8', NULL, 15, 0, 1, '2026-04-06 08:15:56', '2026-04-06 09:50:36'),
(277, 67, 'English Pronunciation Tips', 'video', 'Tools and software needed', 'https://www.youtube.com/watch?v=8JYP_wU1JTU&list=PLSQl0a2vh4HDERCw_ddanXbsDpFWcpL-S&index=2', NULL, 30, 1, 0, '2026-04-06 08:15:56', '2026-04-06 09:50:36'),
(278, 67, 'Vocabulary Building Techniques', 'document', 'Downloadable resources', 'https://www.youtube.com/watch?v=iy-fhpbTH9E&list=PLSQl0a2vh4HDERCw_ddanXbsDpFWcpL-S&index=3', NULL, 10, 2, 0, '2026-04-06 08:15:56', '2026-04-06 09:50:36'),
(279, 68, 'Speaking Practice Session', 'video', 'Deep dive into core principles', 'https://www.youtube.com/watch?v=-IvwoqPh1_I&list=PLSQl0a2vh4HDERCw_ddanXbsDpFWcpL-S&index=4', NULL, 45, 0, 0, '2026-04-06 08:15:56', '2026-04-06 09:50:36'),
(280, 68, 'Writing Skills Workshop', 'video', 'Hands-on practice', 'https://www.youtube.com/embed/6avHGTu2rIU', NULL, 60, 1, 0, '2026-04-06 08:15:56', '2026-04-06 09:50:36'),
(281, 69, 'Advanced Listening Comprehension', 'video', 'Pro-level techniques', 'https://www.youtube.com/embed/3fumBcKCfFE', NULL, 50, 0, 0, '2026-04-06 08:15:56', '2026-04-06 09:50:36'),
(282, 69, 'Real-World Projects', 'video', 'Apply what you learned', 'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL, 90, 1, 1, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(283, 70, 'L1', 'video', 'L1', 'http://localhost:8000/storage/courses/videos/hNyX7BiPanPPGcvztcri.mp4', NULL, 0, 0, 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56'),
(284, 70, 'rfrfrfrfrf', 'video', 'rfrfrfrf', 'http://localhost:8000/storage/courses/videos/UwYqeO0QtpHahkN8wBJs.mp4', NULL, 0, 1, 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56'),
(285, 71, 'rfr', 'video', 'frfrf', 'http://localhost:8000/storage/courses/videos/RMCMz0s5R9rGCbHDcqKl.mp4', NULL, 0, 0, 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56'),
(286, 72, 'Introduction to HTML', 'video', 'Learn what HTML is and why it matters for web development.', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', NULL, 15, 0, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(287, 72, 'HTML Elements and Attributes', 'video', 'Understanding HTML elements, tags, and attributes.', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', NULL, 20, 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(288, 73, 'CSS Selectors and Properties', 'video', 'Learn how to select and style HTML elements with CSS.', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', NULL, 25, 0, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(289, 73, 'Flexbox and Grid Layout', 'video', 'Master modern CSS layout techniques with Flexbox and Grid.', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', NULL, 30, 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(290, 74, 'Variables and Data Types', 'video', 'Learn about JavaScript variables, constants, and data types.', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', NULL, 20, 0, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(291, 74, 'Functions and Scope', 'video', 'Understanding functions, parameters, and variable scope in JavaScript.', 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', NULL, 25, 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(292, 75, '111', 'video', '111', 'http://localhost:8000/storage/courses/videos/D5JrXstFjo8B8JywwndT.mp4', NULL, 0, 0, 0, '2026-04-07 10:30:04', '2026-04-07 10:30:04'),
(296, 75, 'rvrvrv', 'video', 'rvrv', 'http://localhost:8000/storage/courses/videos/77FmJBeLm3SgokxuReYC.mp4', NULL, 0, 1, 0, '2026-04-07 10:35:02', '2026-04-07 10:35:02'),
(297, 76, 'a', 'video', 'a', 'http://localhost:8000/storage/courses/videos/jytwBBmL8SXS6fP7Y950.mp4', NULL, 0, 0, 0, '2026-04-07 10:47:06', '2026-04-07 10:47:06'),
(298, 77, 'fbfbfbfbb', 'video', 'bfbfbbfbfbfb', 'http://localhost:8000/storage/courses/videos/tgHMI3IrXHwK820ocJ4R.mp4', NULL, 0, 0, 0, '2026-04-09 07:35:28', '2026-04-09 07:35:28'),
(299, 78, 'efefe', 'video', 'efewfwe', 'http://localhost:8000/storage/courses/videos/eyia3uDbHcfT7JwvZWO0.mp4', NULL, 0, 0, 0, '2026-04-09 08:51:39', '2026-04-09 08:51:39'),
(300, 78, 'feefef', 'video', 'efefef', 'http://localhost:8000/storage/courses/videos/SASRfuOG9WaggQMP3Ugc.mp4', NULL, 0, 1, 1, '2026-04-09 08:51:39', '2026-04-09 08:51:39'),
(301, 79, 'fsfdsfdfsdfdsvsd', 'video', 'dcvdvsdvdsv', 'http://localhost:8000/storage/courses/videos/XGTaNbOb5wCVe5pzGmB9.mp4', NULL, 6, 0, 1, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(302, 79, 'zcdssdcds', 'video', 'csdcsddcsdccdsc', 'http://localhost:8000/storage/courses/videos/YbzFdFw3AWiJXIIaVzuz.mp4', NULL, 0, 1, 0, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(303, 80, 'asdasdas', 'video', 'fdsfsdfsf', 'http://localhost:8000/storage/courses/videos/pLTfG5PGPAOrzf5sQxFq.mp4', NULL, 0, 0, 0, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(304, 81, 'dvdvdv', 'video', 'dvdv', NULL, NULL, 0, 0, 0, '2026-04-18 10:12:00', '2026-04-18 10:12:00'),
(305, 82, 'zxcxczx', 'video', 'zczx', 'http://localhost:8000/storage/courses/videos/2gfIiBpREVWic9w1dNzR.mp4', NULL, 0, 0, 1, '2026-04-20 11:16:14', '2026-04-20 11:16:14'),
(306, 83, 'vffvf', 'video', 'fvfvfv', 'http://localhost:8000/storage/courses/videos/sA08VjcAhJpR393SXqAB.mp4', NULL, 0, 0, 0, '2026-04-20 11:20:19', '2026-04-20 11:20:19'),
(307, 84, 'z', 'video', 'z', 'http://127.0.0.1:8000/storage/courses/videos/UuV4vP6QUJR78QVf8F8z.mp4', NULL, 0, 0, 0, '2026-04-21 05:58:31', '2026-04-21 05:58:31'),
(308, 85, '2e2e', 'video', 'e2e2e', 'http://127.0.0.1:8000/storage/courses/videos/LsevIi0r2J9UQ6BWJyVg.mp4', NULL, 7, 0, 0, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(309, 86, '2eee2e', 'video', '2e2ee2', 'http://127.0.0.1:8000/storage/courses/videos/htGashekz9p0DH76UrDB.mp4', NULL, 7, 0, 1, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(310, 87, 'efefef', 'video', 'efefe', 'http://127.0.0.1:8000/storage/courses/videos/arzqmIqUt7caafPFaNyC.mp4', NULL, 7, 0, 0, '2026-04-23 06:28:05', '2026-04-23 06:28:05'),
(311, 87, 'dwdwdwd', 'video', 'dwdwdwdwd', 'http://127.0.0.1:8000/storage/courses/videos/K9ITyftsNEu7vSJHEBwC.mp4', NULL, 7, 1, 0, '2026-04-23 06:28:05', '2026-04-23 06:28:05'),
(312, 88, 'wefwef', 'video', 'wefwefewf', 'http://127.0.0.1:8000/storage/courses/videos/Fj353W2hznxxK3PIOBYv.mp4', NULL, 7, 0, 0, '2026-04-27 10:49:59', '2026-04-27 10:49:59');

-- --------------------------------------------------------

--
-- Table structure for table `course_levels`
--

CREATE TABLE `course_levels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_levels`
--

INSERT INTO `course_levels` (`id`, `name`, `slug`, `description`, `order`, `created_at`, `updated_at`) VALUES
(2, 'Pro', 'pro', NULL, 0, '2026-04-11 06:25:09', '2026-04-11 06:25:09'),
(3, 'Beginner', 'beginner', NULL, 0, '2026-04-11 06:26:03', '2026-04-11 06:26:03'),
(4, 'Intermediate', 'intermediate', NULL, 0, '2026-04-11 06:26:11', '2026-04-11 06:26:11'),
(5, 'Advanced', 'advanced', NULL, 0, '2026-04-11 06:26:14', '2026-04-11 06:26:14'),
(7, 'Titan', 'titan', NULL, 0, '2026-04-11 06:29:24', '2026-04-11 06:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `course_progress`
--

CREATE TABLE `course_progress` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quiz_id` bigint(20) UNSIGNED DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `watched` tinyint(1) NOT NULL DEFAULT 0,
  `video_seconds` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_progress`
--

INSERT INTO `course_progress` (`id`, `user_id`, `course_id`, `lesson_id`, `quiz_id`, `completed`, `watched`, `video_seconds`, `score`, `created_at`, `updated_at`) VALUES
(1, 13, 26, 283, NULL, 1, 1, NULL, NULL, '2026-04-19 06:07:22', '2026-04-19 06:07:22'),
(2, 13, 26, 284, NULL, 1, 1, NULL, NULL, '2026-04-19 06:07:37', '2026-04-19 06:07:37'),
(3, 12, 26, 283, NULL, 1, 1, NULL, NULL, '2026-04-19 06:08:21', '2026-04-19 06:08:24'),
(4, 13, 26, 285, NULL, 1, 1, NULL, NULL, '2026-04-19 06:09:11', '2026-04-19 06:09:11'),
(5, 13, 26, NULL, 174, 1, 0, NULL, 100, '2026-04-19 06:09:16', '2026-04-19 06:09:16'),
(6, 13, 26, NULL, 173, 1, 0, NULL, 100, '2026-04-19 06:09:23', '2026-04-19 06:09:23'),
(7, 13, 26, NULL, 175, 1, 0, NULL, 100, '2026-04-19 06:09:31', '2026-04-19 06:09:31'),
(8, 13, 26, NULL, 176, 1, 0, NULL, 100, '2026-04-19 06:09:38', '2026-04-19 06:09:38'),
(9, 27, 28, 292, NULL, 1, 1, NULL, NULL, '2026-04-23 03:52:20', '2026-04-23 03:52:20'),
(10, 27, 28, 296, NULL, 1, 1, NULL, NULL, '2026-04-23 03:55:23', '2026-04-23 03:57:13'),
(11, 27, 28, 297, NULL, 1, 1, NULL, NULL, '2026-04-23 03:57:27', '2026-04-23 03:57:27'),
(12, 27, 28, NULL, 185, 1, 0, NULL, 100, '2026-04-23 03:57:39', '2026-04-23 03:57:39'),
(13, 27, 28, NULL, 186, 1, 0, NULL, 100, '2026-04-23 03:57:44', '2026-04-23 03:57:44'),
(14, 13, 44, 310, NULL, 1, 1, NULL, NULL, '2026-04-23 07:32:58', '2026-04-23 07:32:58'),
(15, 13, 44, 311, NULL, 1, 1, NULL, NULL, '2026-04-23 07:33:15', '2026-04-23 07:33:15'),
(16, 13, 44, NULL, 205, 1, 0, NULL, 100, '2026-04-23 07:33:34', '2026-04-23 07:33:35'),
(17, 13, 44, NULL, 206, 1, 0, NULL, 100, '2026-04-23 07:34:06', '2026-04-23 07:34:11');

-- --------------------------------------------------------

--
-- Table structure for table `course_questions`
--

CREATE TABLE `course_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `is_answered` tinyint(1) NOT NULL DEFAULT 0,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_questions`
--

INSERT INTO `course_questions` (`id`, `course_id`, `user_id`, `user_name`, `user_email`, `question`, `answer`, `is_answered`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 26, NULL, 'Null', 'N@gmail.com', 'hihi', 'byby', 1, 1, '2026-04-09 06:54:13', '2026-04-09 06:54:57'),
(2, 1, 1, 'Admin User', 'admin@luminabooks.com', 'Are the practice tests updated to reflect the 2026 IELTS format?', 'Yes, all materials follow the current official Cambridge standards.', 1, 1, '2026-04-06 04:00:00', '2026-04-06 04:00:00'),
(3, 1, 2, 'John Doe', 'john@example.com', 'Do I get lifetime access to the video lessons?', 'Absolutely. Once enrolled, you can revisit the content forever.', 1, 1, '2026-04-06 04:05:00', '2026-04-06 04:05:00'),
(4, 1, 4, 'HI', 'HW@gmail.com', 'Is there a mobile app to practice on the go?', 'Our platform is fully responsive, but a dedicated app is in beta testing.', 1, 1, '2026-04-06 04:10:00', '2026-04-06 04:10:00'),
(5, 1, 5, 'Updated Name', 'testuser@test.com', 'Can I get a refund if I don\'t improve my score?', 'We offer a 30-day satisfaction guarantee, no questions asked.', 1, 1, '2026-04-06 04:15:00', '2026-04-06 04:15:00'),
(6, 1, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 'How many hours of video content are included?', 'There are over 40 hours of high-definition video tutorials.', 1, 1, '2026-04-06 04:20:00', '2026-04-06 04:20:00'),
(7, 1, 7, 'Fatima Khan', 'fatima.khan@email.com', 'Are the writing assignments graded by humans or AI?', 'All essays are personally reviewed by certified IELTS examiners.', 1, 1, '2026-04-06 04:25:00', '2026-04-06 04:25:00'),
(8, 1, 8, 'Karim Hassan', 'karim.hassan@email.com', 'What internet speed is required for streaming?', 'A stable 5 Mbps connection is recommended for HD playback.', 1, 1, '2026-04-06 04:30:00', '2026-04-06 04:30:00'),
(9, 1, 9, 'Nadia Islam', 'nadia.islam@email.com', 'Can I download the PDF workbooks for offline study?', 'Yes, all supplementary materials are downloadable in PDF format.', 1, 1, '2026-04-06 04:35:00', '2026-04-06 04:35:00'),
(10, 1, 10, 'Tariq Ali', 'tariq.ali@email.com', 'Is there a community forum to practice speaking with peers?', 'Yes, we have an active Discord server for all enrolled students.', 1, 1, '2026-04-06 04:40:00', '2026-04-06 04:40:00'),
(11, 1, 11, 'Jack', 'J@gmail.com', 'Do you offer corporate or group discounts?', 'Yes, please email our enterprise team for bulk enrollment pricing.', 1, 1, '2026-04-06 04:45:00', '2026-04-06 04:45:00'),
(12, 2, 1, 'Admin User', 'admin@luminabooks.com', 'Does this course cover Harvard citation style?', 'Currently, we focus on APA, MLA, and Chicago. Harvard is planned for Q3.', 1, 1, '2026-04-06 05:00:00', '2026-04-06 05:00:00'),
(13, 2, 2, 'John Doe', 'john@example.com', 'Will I learn how to use Zotero or Mendeley?', 'Yes, Module 4 includes a complete tutorial on both reference managers.', 1, 1, '2026-04-06 05:05:00', '2026-04-06 05:05:00'),
(14, 2, 4, 'HI', 'HW@gmail.com', 'Is this suitable for Master\'s level dissertations?', 'Absolutely, the advanced research design modules cater to post-grads.', 1, 1, '2026-04-06 05:10:00', '2026-04-06 05:10:00'),
(15, 2, 5, 'Updated Name', 'testuser@test.com', 'How long does instructor feedback usually take?', 'You will typically receive detailed comments within 48 hours.', 1, 1, '2026-04-06 05:15:00', '2026-04-06 05:15:00'),
(16, 2, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 'Can I submit multiple drafts for review?', 'You are allowed two rounds of revision per major assignment.', 1, 1, '2026-04-06 05:20:00', '2026-04-06 05:20:00'),
(17, 2, 7, 'Fatima Khan', 'fatima.khan@email.com', 'Are there live Q&A sessions with the professor?', 'Yes, bi-weekly Zoom office hours are included in your enrollment.', 1, 1, '2026-04-06 05:25:00', '2026-04-06 05:25:00'),
(18, 2, 8, 'Karim Hassan', 'karim.hassan@email.com', 'Do I need prior experience in statistical analysis?', 'No, the quantitative methods section starts from absolute basics.', 1, 1, '2026-04-06 05:30:00', '2026-04-06 05:30:00'),
(19, 2, 9, 'Nadia Islam', 'nadia.islam@email.com', 'What software do I need for the data visualization module?', 'Free versions of Excel and RStudio are sufficient for all exercises.', 1, 1, '2026-04-06 05:35:00', '2026-04-06 05:35:00'),
(20, 2, 10, 'Tariq Ali', 'tariq.ali@email.com', 'Is there a certificate of completion?', 'Yes, a verified digital badge and PDF certificate are issued automatically.', 1, 1, '2026-04-06 05:40:00', '2026-04-06 05:40:00'),
(21, 2, 11, 'Jack', 'J@gmail.com', 'Can I switch to a different academic track mid-course?', 'Track switching is possible during the first 7 days without penalty.', 1, 1, '2026-04-06 05:45:00', '2026-04-06 05:45:00'),
(22, 29, NULL, 'Null', 'N@gmail.com', 'fsdvsdv    dsvsdvssv', 'dvdvd', 1, 1, '2026-04-15 05:14:15', '2026-04-15 05:14:36'),
(23, 28, NULL, 'Null', 'N@gmail.com', 'hhhhhhhh', NULL, 0, 1, '2026-04-15 05:17:07', '2026-04-15 05:17:07'),
(24, 2, NULL, 'Null', 'N@gmail.com', 'can i join for free', 'no', 1, 1, '2026-04-17 04:14:18', '2026-04-17 04:14:52'),
(25, 19, NULL, 'Zacky', 'Z@gmailcom', 'asaaf', NULL, 0, 1, '2026-04-18 06:25:43', '2026-04-18 06:25:43'),
(26, 28, NULL, 'Zacky', 'Z@gmailcom', 'rsbfdbfff', NULL, 0, 1, '2026-04-18 06:47:18', '2026-04-18 06:47:18');

-- --------------------------------------------------------

--
-- Table structure for table `course_quizzes`
--

CREATE TABLE `course_quizzes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `lesson_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_quizzes`
--

INSERT INTO `course_quizzes` (`id`, `course_id`, `title`, `order`, `created_at`, `updated_at`, `lesson_id`) VALUES
(1, 1, 'Quiz: Listening Mastery', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(2, 1, 'Quiz: Listening Mastery', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(3, 1, 'Quiz: Listening Mastery', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(4, 1, 'Quiz: Reading Excellence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(5, 1, 'Quiz: Reading Excellence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(6, 1, 'Quiz: Reading Excellence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(7, 1, 'Quiz: Writing Task 1', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(8, 1, 'Quiz: Writing Task 1', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(9, 1, 'Quiz: Writing Task 1', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(10, 1, 'Quiz: Writing Task 2', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(11, 1, 'Quiz: Writing Task 2', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(12, 1, 'Quiz: Writing Task 2', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(13, 1, 'Quiz: Speaking Confidence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(14, 1, 'Quiz: Speaking Confidence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(15, 1, 'Quiz: Speaking Confidence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(16, 2, 'Quiz: Research Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(17, 2, 'Quiz: Research Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(18, 2, 'Quiz: Research Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(19, 2, 'Quiz: Essay Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(20, 2, 'Quiz: Essay Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(21, 2, 'Quiz: Essay Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(22, 2, 'Quiz: Research Paper Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(23, 2, 'Quiz: Research Paper Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(24, 2, 'Quiz: Research Paper Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(25, 2, 'Quiz: Citation & Referencing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(26, 2, 'Quiz: Citation & Referencing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(27, 2, 'Quiz: Citation & Referencing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(28, 2, 'Quiz: Dissertation Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(29, 2, 'Quiz: Dissertation Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(30, 2, 'Quiz: Dissertation Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(31, 3, 'Quiz: Professional Email Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(32, 3, 'Quiz: Professional Email Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(33, 3, 'Quiz: Professional Email Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(34, 3, 'Quiz: Meeting Communication', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(35, 3, 'Quiz: Meeting Communication', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(36, 3, 'Quiz: Meeting Communication', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(37, 3, 'Quiz: Presentation Skills', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(38, 3, 'Quiz: Presentation Skills', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(39, 3, 'Quiz: Presentation Skills', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(40, 3, 'Quiz: Negotiation Language', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(41, 3, 'Quiz: Negotiation Language', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(42, 3, 'Quiz: Negotiation Language', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(43, 3, 'Quiz: Report Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(44, 3, 'Quiz: Report Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(45, 3, 'Quiz: Report Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(46, 4, 'Quiz: Finding Your Voice', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(47, 4, 'Quiz: Finding Your Voice', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(48, 4, 'Quiz: Finding Your Voice', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(49, 4, 'Quiz: Character Development', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(50, 4, 'Quiz: Character Development', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(51, 4, 'Quiz: Character Development', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(52, 4, 'Quiz: Plot & Structure', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(53, 4, 'Quiz: Plot & Structure', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(54, 4, 'Quiz: Plot & Structure', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(55, 4, 'Quiz: Setting & World Building', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(56, 4, 'Quiz: Setting & World Building', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(57, 4, 'Quiz: Setting & World Building', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(58, 4, 'Quiz: Editing & Publishing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(59, 4, 'Quiz: Editing & Publishing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(60, 4, 'Quiz: Editing & Publishing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(61, 5, 'Quiz: Pronunciation Basics', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(62, 5, 'Quiz: Pronunciation Basics', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(63, 5, 'Quiz: Pronunciation Basics', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(64, 5, 'Quiz: Daily Conversations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(65, 5, 'Quiz: Daily Conversations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(66, 5, 'Quiz: Daily Conversations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(67, 5, 'Quiz: Social Situations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(68, 5, 'Quiz: Social Situations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(69, 5, 'Quiz: Social Situations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(70, 5, 'Quiz: Professional Speaking', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(71, 5, 'Quiz: Professional Speaking', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(72, 5, 'Quiz: Professional Speaking', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(73, 5, 'Quiz: Advanced Fluency', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(74, 5, 'Quiz: Advanced Fluency', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(75, 5, 'Quiz: Advanced Fluency', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(76, 6, 'Quiz: Task 1 Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(77, 6, 'Quiz: Task 1 Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(78, 6, 'Quiz: Task 1 Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(79, 6, 'Quiz: Task 1 Advanced', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(80, 6, 'Quiz: Task 1 Advanced', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(81, 6, 'Quiz: Task 1 Advanced', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(82, 6, 'Quiz: Task 2 Essay Types', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09', NULL),
(83, 6, 'Quiz: Task 2 Essay Types', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(84, 6, 'Quiz: Task 2 Essay Types', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(85, 6, 'Quiz: Grammar for Writing', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(86, 6, 'Quiz: Grammar for Writing', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(87, 6, 'Quiz: Grammar for Writing', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(88, 6, 'Quiz: Practice & Assessment', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(89, 6, 'Quiz: Practice & Assessment', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(90, 6, 'Quiz: Practice & Assessment', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(91, 7, 'Quiz: Parts of Speech', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(92, 7, 'Quiz: Parts of Speech', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(93, 7, 'Quiz: Parts of Speech', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(94, 7, 'Quiz: Tenses Mastery', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(95, 7, 'Quiz: Tenses Mastery', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(96, 7, 'Quiz: Tenses Mastery', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(97, 7, 'Quiz: Sentence Structure', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(98, 7, 'Quiz: Sentence Structure', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(99, 7, 'Quiz: Sentence Structure', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(100, 7, 'Quiz: Advanced Grammar', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(101, 7, 'Quiz: Advanced Grammar', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(102, 7, 'Quiz: Advanced Grammar', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(103, 7, 'Quiz: Common Errors', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(104, 7, 'Quiz: Common Errors', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(105, 7, 'Quiz: Common Errors', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(106, 8, 'Quiz: Presentation Planning', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(107, 8, 'Quiz: Presentation Planning', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(108, 8, 'Quiz: Presentation Planning', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(109, 8, 'Quiz: Slide Design', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(110, 8, 'Quiz: Slide Design', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(111, 8, 'Quiz: Slide Design', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(112, 8, 'Quiz: Delivery Techniques', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(113, 8, 'Quiz: Delivery Techniques', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(114, 8, 'Quiz: Delivery Techniques', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(115, 8, 'Quiz: Engagement Strategies', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(116, 8, 'Quiz: Engagement Strategies', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(117, 8, 'Quiz: Engagement Strategies', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(118, 8, 'Quiz: Q&A & Follow-up', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(119, 8, 'Quiz: Q&A & Follow-up', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(120, 8, 'Quiz: Q&A & Follow-up', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(121, 9, 'Quiz: Story Foundations', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(122, 9, 'Quiz: Story Foundations', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(123, 9, 'Quiz: Story Foundations', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(124, 9, 'Quiz: Character in Short Form', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(125, 9, 'Quiz: Character in Short Form', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(126, 9, 'Quiz: Character in Short Form', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(127, 9, 'Quiz: Plot in Miniature', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(128, 9, 'Quiz: Plot in Miniature', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(129, 9, 'Quiz: Plot in Miniature', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(130, 9, 'Quiz: Style & Voice', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(131, 9, 'Quiz: Style & Voice', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(132, 9, 'Quiz: Style & Voice', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(133, 9, 'Quiz: Publication Ready', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(134, 9, 'Quiz: Publication Ready', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(135, 9, 'Quiz: Publication Ready', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(136, 10, 'Quiz: Airport English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(137, 10, 'Quiz: Airport English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(138, 10, 'Quiz: Airport English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(139, 10, 'Quiz: Hotel English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(140, 10, 'Quiz: Hotel English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(141, 10, 'Quiz: Hotel English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(142, 10, 'Quiz: Restaurant English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(143, 10, 'Quiz: Restaurant English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(144, 10, 'Quiz: Restaurant English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(145, 10, 'Quiz: Tourist English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(146, 10, 'Quiz: Tourist English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(147, 10, 'Quiz: Tourist English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(148, 10, 'Quiz: Travel Industry English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(149, 10, 'Quiz: Travel Industry English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(150, 10, 'Quiz: Travel Industry English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10', NULL),
(153, 13, 'efef', 0, '2026-04-06 04:38:11', '2026-04-06 04:38:11', NULL),
(154, 15, 'effe', 0, '2026-04-06 05:20:21', '2026-04-06 05:20:21', NULL),
(155, 20, '555', 0, '2026-04-06 06:31:45', '2026-04-06 06:31:45', 257),
(166, 24, 'fvfvfvfvfv', 0, '2026-04-06 07:26:27', '2026-04-06 07:26:27', 274),
(167, 25, 'Introduction Quiz', 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56', 276),
(168, 25, 'Core Concepts Quiz', 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56', 279),
(169, 25, 'Exercise Quiz', 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56', 280),
(170, 25, 'Advanced Quiz', 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56', 281),
(171, 25, 'Project Assessment', 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56', 282),
(173, 26, 'rfr', 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56', 284),
(174, 26, 'frfrf', 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56', 285),
(175, 26, 'Final', 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56', NULL),
(176, 26, 'Final 2', 1, '2026-04-07 01:11:56', '2026-04-07 01:11:56', NULL),
(177, 27, 'HTML Basics Quiz', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', 286),
(178, 27, 'Elements & Attributes Quiz', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', 287),
(179, 27, 'CSS Selectors Quiz', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', 288),
(180, 27, 'Flexbox & Grid Quiz', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', 289),
(181, 27, 'Variables & Types Quiz', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', 290),
(182, 27, 'Functions Quiz', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', 291),
(183, 27, 'Final Assessment: HTML & CSS', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09', NULL),
(184, 27, 'Final Assessment: JavaScript', 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09', NULL),
(185, 28, 'AAAAAAAAAAA', 0, '2026-04-07 10:30:04', '2026-04-07 10:30:04', 292),
(186, 28, 'final', 0, '2026-04-07 10:30:04', '2026-04-07 10:30:04', NULL),
(187, 29, 'fbfbbffbfbfbb', 0, '2026-04-09 07:35:28', '2026-04-09 07:35:28', 298),
(188, 29, 'f f f f', 0, '2026-04-09 07:35:28', '2026-04-09 07:35:28', NULL),
(189, 30, 'vvevev', 0, '2026-04-09 08:51:39', '2026-04-09 08:51:39', 299),
(190, 30, 'fvfvfv', 1, '2026-04-09 08:51:39', '2026-04-09 08:51:39', 299),
(191, 30, 'fvfv', 2, '2026-04-09 08:51:39', '2026-04-09 08:51:39', 299),
(192, 30, 'dvdvvv', 0, '2026-04-09 08:51:39', '2026-04-09 08:51:39', 300),
(193, 30, 'efwefwef', 0, '2026-04-09 08:51:39', '2026-04-09 08:51:39', NULL),
(194, 30, 'wefewfwe', 1, '2026-04-09 08:51:39', '2026-04-09 08:51:39', NULL),
(195, 30, 'wwfwefw', 2, '2026-04-09 08:51:39', '2026-04-09 08:51:39', NULL),
(196, 31, 'dsfdssdsdgdsg', 0, '2026-04-18 10:08:06', '2026-04-18 10:08:06', 301),
(197, 32, 'vdv', 0, '2026-04-18 10:12:00', '2026-04-18 10:12:00', 304),
(198, 32, 'vdvdvv', 0, '2026-04-18 10:12:00', '2026-04-18 10:12:00', NULL),
(199, 33, 'zxc', 0, '2026-04-20 11:16:14', '2026-04-20 11:16:14', NULL),
(200, 34, 'dcdcdc', 0, '2026-04-20 11:20:19', '2026-04-20 11:20:19', NULL),
(201, 36, 'zz', 0, '2026-04-21 05:58:31', '2026-04-21 05:58:31', 307),
(202, 36, 'zzz', 0, '2026-04-21 05:58:31', '2026-04-21 05:58:31', NULL),
(203, 37, '2e2e', 0, '2026-04-21 10:17:40', '2026-04-21 10:17:40', 308),
(204, 37, 'dcdc', 0, '2026-04-21 10:17:40', '2026-04-21 10:17:40', NULL),
(205, 44, 'wdwd', 0, '2026-04-23 06:28:05', '2026-04-23 06:28:05', 310),
(206, 44, 'wdwd', 0, '2026-04-23 06:28:05', '2026-04-23 06:28:05', NULL),
(207, 45, 'wefwef', 0, '2026-04-27 10:49:59', '2026-04-27 10:49:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course_quiz_questions`
--

CREATE TABLE `course_quiz_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quiz_id` bigint(20) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `correct_answer` int(11) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_quiz_questions`
--

INSERT INTO `course_quiz_questions` (`id`, `quiz_id`, `question`, `options`, `correct_answer`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(2, 1, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(3, 1, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(4, 1, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(5, 1, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(6, 1, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(7, 2, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(8, 2, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(9, 2, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(10, 2, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(11, 2, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(12, 2, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(13, 3, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(14, 3, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(15, 3, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(16, 4, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(17, 4, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(18, 4, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(19, 4, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(20, 4, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(21, 4, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(22, 5, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(23, 5, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(24, 5, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(25, 5, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(26, 5, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(27, 5, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(28, 6, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(29, 6, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(30, 6, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(31, 7, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(32, 7, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(33, 7, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(34, 7, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(35, 7, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(36, 7, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(37, 8, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(38, 8, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(39, 8, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(40, 8, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(41, 8, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(42, 8, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(43, 9, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(44, 9, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(45, 9, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(46, 10, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(47, 10, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(48, 10, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(49, 10, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(50, 10, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(51, 10, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(52, 11, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(53, 11, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(54, 11, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(55, 11, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(56, 11, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(57, 11, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(58, 12, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(59, 12, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(60, 12, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(61, 13, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(62, 13, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(63, 13, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(64, 13, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(65, 13, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(66, 13, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(67, 14, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(68, 14, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(69, 14, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(70, 14, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(71, 14, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(72, 14, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(73, 15, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(74, 15, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(75, 15, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(76, 16, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(77, 16, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(78, 16, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(79, 16, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(80, 16, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(81, 16, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(82, 17, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(83, 17, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(84, 17, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(85, 17, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(86, 17, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(87, 17, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(88, 18, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(89, 18, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(90, 18, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(91, 19, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(92, 19, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(93, 19, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(94, 19, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(95, 19, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(96, 19, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(97, 20, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(98, 20, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(99, 20, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(100, 20, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(101, 20, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(102, 20, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(103, 21, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(104, 21, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(105, 21, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(106, 22, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(107, 22, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(108, 22, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(109, 22, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(110, 22, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(111, 22, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(112, 23, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(113, 23, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(114, 23, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(115, 23, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(116, 23, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(117, 23, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(118, 24, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(119, 24, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(120, 24, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(121, 25, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(122, 25, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(123, 25, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(124, 25, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(125, 25, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(126, 25, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(127, 26, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(128, 26, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(129, 26, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(130, 26, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(131, 26, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(132, 26, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(133, 27, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(134, 27, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(135, 27, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(136, 28, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(137, 28, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(138, 28, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(139, 28, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(140, 28, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(141, 28, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(142, 29, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(143, 29, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(144, 29, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(145, 29, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(146, 29, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(147, 29, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(148, 30, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(149, 30, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(150, 30, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(151, 31, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(152, 31, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(153, 31, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(154, 31, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(155, 31, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(156, 31, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(157, 32, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(158, 32, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(159, 32, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(160, 32, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(161, 32, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(162, 32, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(163, 33, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(164, 33, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(165, 33, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(166, 34, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(167, 34, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(168, 34, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(169, 34, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(170, 34, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(171, 34, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(172, 35, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(173, 35, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(174, 35, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(175, 35, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(176, 35, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(177, 35, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(178, 36, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(179, 36, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(180, 36, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(181, 37, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(182, 37, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(183, 37, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(184, 37, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(185, 37, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(186, 37, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(187, 38, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(188, 38, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(189, 38, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(190, 38, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(191, 38, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(192, 38, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(193, 39, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(194, 39, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(195, 39, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(196, 40, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(197, 40, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(198, 40, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(199, 40, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(200, 40, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(201, 40, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(202, 41, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(203, 41, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(204, 41, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(205, 41, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(206, 41, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(207, 41, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(208, 42, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(209, 42, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(210, 42, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(211, 43, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(212, 43, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(213, 43, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(214, 43, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(215, 43, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(216, 43, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(217, 44, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(218, 44, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09');
INSERT INTO `course_quiz_questions` (`id`, `quiz_id`, `question`, `options`, `correct_answer`, `order`, `created_at`, `updated_at`) VALUES
(219, 44, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(220, 44, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(221, 44, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(222, 44, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(223, 45, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(224, 45, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(225, 45, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(226, 46, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(227, 46, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(228, 46, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(229, 46, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(230, 46, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(231, 46, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(232, 47, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(233, 47, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(234, 47, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(235, 47, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(236, 47, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(237, 47, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(238, 48, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(239, 48, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(240, 48, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(241, 49, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(242, 49, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(243, 49, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(244, 49, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(245, 49, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(246, 49, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(247, 50, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(248, 50, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(249, 50, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(250, 50, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(251, 50, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(252, 50, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(253, 51, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(254, 51, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(255, 51, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(256, 52, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(257, 52, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(258, 52, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(259, 52, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(260, 52, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(261, 52, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(262, 53, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(263, 53, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(264, 53, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(265, 53, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(266, 53, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(267, 53, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(268, 54, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(269, 54, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(270, 54, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(271, 55, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(272, 55, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(273, 55, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(274, 55, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(275, 55, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(276, 55, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(277, 56, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(278, 56, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(279, 56, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(280, 56, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(281, 56, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(282, 56, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(283, 57, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(284, 57, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(285, 57, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(286, 58, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(287, 58, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(288, 58, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(289, 58, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(290, 58, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(291, 58, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(292, 59, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(293, 59, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(294, 59, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(295, 59, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(296, 59, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(297, 59, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(298, 60, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(299, 60, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(300, 60, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(301, 61, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(302, 61, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(303, 61, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(304, 61, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(305, 61, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(306, 61, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(307, 62, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(308, 62, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(309, 62, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(310, 62, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(311, 62, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(312, 62, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(313, 63, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(314, 63, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(315, 63, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(316, 64, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(317, 64, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(318, 64, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(319, 64, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(320, 64, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(321, 64, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(322, 65, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(323, 65, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(324, 65, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(325, 65, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(326, 65, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(327, 65, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(328, 66, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(329, 66, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(330, 66, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(331, 67, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(332, 67, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(333, 67, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(334, 67, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(335, 67, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(336, 67, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(337, 68, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(338, 68, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(339, 68, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(340, 68, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(341, 68, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(342, 68, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(343, 69, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(344, 69, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(345, 69, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(346, 70, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(347, 70, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(348, 70, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(349, 70, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(350, 70, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(351, 70, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(352, 71, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(353, 71, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(354, 71, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(355, 71, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(356, 71, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(357, 71, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(358, 72, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(359, 72, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(360, 72, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(361, 73, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(362, 73, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(363, 73, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(364, 73, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(365, 73, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(366, 73, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(367, 74, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(368, 74, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(369, 74, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(370, 74, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(371, 74, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(372, 74, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(373, 75, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(374, 75, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(375, 75, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(376, 76, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(377, 76, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(378, 76, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(379, 76, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(380, 76, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(381, 76, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(382, 77, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(383, 77, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(384, 77, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(385, 77, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(386, 77, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(387, 77, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(388, 78, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(389, 78, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(390, 78, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(391, 79, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(392, 79, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(393, 79, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(394, 79, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(395, 79, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(396, 79, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(397, 80, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(398, 80, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(399, 80, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(400, 80, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(401, 80, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(402, 80, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(403, 81, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(404, 81, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(405, 81, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(406, 82, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(407, 82, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(408, 82, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(409, 82, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(410, 82, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(411, 82, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(412, 83, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(413, 83, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(414, 83, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(415, 83, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(416, 83, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(417, 83, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(418, 84, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(419, 84, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(420, 84, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(421, 85, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(422, 85, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(423, 85, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(424, 85, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(425, 85, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(426, 85, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(427, 86, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(428, 86, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(429, 86, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(430, 86, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(431, 86, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(432, 86, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(433, 87, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(434, 87, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(435, 87, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10');
INSERT INTO `course_quiz_questions` (`id`, `quiz_id`, `question`, `options`, `correct_answer`, `order`, `created_at`, `updated_at`) VALUES
(436, 88, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(437, 88, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(438, 88, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(439, 88, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(440, 88, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(441, 88, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(442, 89, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(443, 89, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(444, 89, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(445, 89, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(446, 89, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(447, 89, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(448, 90, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(449, 90, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(450, 90, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(451, 91, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(452, 91, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(453, 91, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(454, 91, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(455, 91, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(456, 91, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(457, 92, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(458, 92, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(459, 92, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(460, 92, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(461, 92, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(462, 92, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(463, 93, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(464, 93, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(465, 93, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(466, 94, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(467, 94, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(468, 94, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(469, 94, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(470, 94, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(471, 94, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(472, 95, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(473, 95, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(474, 95, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(475, 95, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(476, 95, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(477, 95, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(478, 96, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(479, 96, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(480, 96, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(481, 97, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(482, 97, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(483, 97, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(484, 97, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(485, 97, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(486, 97, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(487, 98, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(488, 98, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(489, 98, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(490, 98, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(491, 98, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(492, 98, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(493, 99, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(494, 99, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(495, 99, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(496, 100, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(497, 100, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(498, 100, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(499, 100, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(500, 100, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(501, 100, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(502, 101, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(503, 101, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(504, 101, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(505, 101, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(506, 101, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(507, 101, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(508, 102, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(509, 102, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(510, 102, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(511, 103, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(512, 103, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(513, 103, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(514, 103, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(515, 103, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(516, 103, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(517, 104, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(518, 104, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(519, 104, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(520, 104, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(521, 104, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(522, 104, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(523, 105, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(524, 105, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(525, 105, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(526, 106, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(527, 106, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(528, 106, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(529, 106, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(530, 106, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(531, 106, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(532, 107, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(533, 107, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(534, 107, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(535, 107, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(536, 107, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(537, 107, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(538, 108, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(539, 108, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(540, 108, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(541, 109, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(542, 109, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(543, 109, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(544, 109, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(545, 109, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(546, 109, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(547, 110, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(548, 110, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(549, 110, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(550, 110, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(551, 110, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(552, 110, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(553, 111, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(554, 111, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(555, 111, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(556, 112, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(557, 112, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(558, 112, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(559, 112, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(560, 112, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(561, 112, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(562, 113, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(563, 113, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(564, 113, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(565, 113, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(566, 113, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(567, 113, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(568, 114, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(569, 114, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(570, 114, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(571, 115, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(572, 115, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(573, 115, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(574, 115, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(575, 115, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(576, 115, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(577, 116, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(578, 116, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(579, 116, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(580, 116, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(581, 116, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(582, 116, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(583, 117, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(584, 117, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(585, 117, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(586, 118, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(587, 118, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(588, 118, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(589, 118, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(590, 118, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(591, 118, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(592, 119, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(593, 119, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(594, 119, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(595, 119, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(596, 119, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(597, 119, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(598, 120, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(599, 120, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(600, 120, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(601, 121, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(602, 121, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(603, 121, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(604, 121, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(605, 121, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(606, 121, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(607, 122, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(608, 122, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(609, 122, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(610, 122, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(611, 122, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(612, 122, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(613, 123, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(614, 123, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(615, 123, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(616, 124, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(617, 124, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(618, 124, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(619, 124, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(620, 124, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(621, 124, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(622, 125, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(623, 125, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(624, 125, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(625, 125, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(626, 125, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(627, 125, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(628, 126, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(629, 126, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(630, 126, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(631, 127, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(632, 127, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(633, 127, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(634, 127, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(635, 127, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(636, 127, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(637, 128, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(638, 128, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(639, 128, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(640, 128, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(641, 128, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(642, 128, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(643, 129, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(644, 129, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(645, 129, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(646, 130, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(647, 130, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(648, 130, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(649, 130, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(650, 130, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(651, 130, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10');
INSERT INTO `course_quiz_questions` (`id`, `quiz_id`, `question`, `options`, `correct_answer`, `order`, `created_at`, `updated_at`) VALUES
(652, 131, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(653, 131, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(654, 131, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(655, 131, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(656, 131, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(657, 131, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(658, 132, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(659, 132, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(660, 132, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(661, 133, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(662, 133, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(663, 133, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(664, 133, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(665, 133, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(666, 133, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(667, 134, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(668, 134, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(669, 134, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(670, 134, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(671, 134, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(672, 134, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(673, 135, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(674, 135, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(675, 135, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(676, 136, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(677, 136, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(678, 136, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(679, 136, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(680, 136, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(681, 136, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(682, 137, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(683, 137, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(684, 137, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(685, 137, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(686, 137, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(687, 137, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(688, 138, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(689, 138, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(690, 138, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(691, 139, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(692, 139, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(693, 139, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(694, 139, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(695, 139, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(696, 139, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(697, 140, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(698, 140, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(699, 140, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(700, 140, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(701, 140, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(702, 140, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(703, 141, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(704, 141, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(705, 141, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(706, 142, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(707, 142, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(708, 142, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(709, 142, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(710, 142, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(711, 142, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(712, 143, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(713, 143, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(714, 143, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(715, 143, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(716, 143, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(717, 143, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(718, 144, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(719, 144, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(720, 144, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(721, 145, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(722, 145, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(723, 145, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(724, 145, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(725, 145, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(726, 145, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(727, 146, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(728, 146, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(729, 146, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(730, 146, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(731, 146, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(732, 146, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(733, 147, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(734, 147, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(735, 147, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(736, 148, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(737, 148, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(738, 148, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(739, 148, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(740, 148, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(741, 148, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(742, 149, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(743, 149, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(744, 149, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(745, 149, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(746, 149, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(747, 149, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(748, 150, 'What is the primary objective of this lesson?', '\"[\\\"To understand key concepts\\\",\\\"To memorize facts\\\",\\\"To skip practice\\\",\\\"To avoid assignments\\\"]\"', 0, 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(749, 150, 'Which technique is most effective for retention?', '\"[\\\"Active practice\\\",\\\"Passive reading\\\",\\\"Ignoring examples\\\",\\\"Skipping exercises\\\"]\"', 0, 2, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(750, 150, 'What should you do after completing this lesson?', '\"[\\\"Review and practice\\\",\\\"Move on without review\\\",\\\"Forget the material\\\",\\\"Skip the quiz\\\"]\"', 0, 3, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(751, 153, 'effefe', '\"[\\\"fef\\\",\\\"fef\\\",\\\"efef\\\",\\\"efef\\\"]\"', 0, 0, '2026-04-06 04:38:11', '2026-04-06 04:38:11'),
(752, 154, 'efef', '\"[\\\"efef\\\",\\\"efef\\\",\\\"efef\\\",\\\"efef\\\"]\"', 0, 0, '2026-04-06 05:20:21', '2026-04-06 05:20:21'),
(779, 167, 'What is the main goal of this course?', '[\"Learn basics\",\"Master advanced topics\",\"Get certified\",\"All of the above\"]', 3, 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(780, 167, 'How many modules are there?', '[\"3\",\"5\",\"7\",\"10\"]', 1, 1, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(781, 168, 'What is the first principle?', '\"[\\\"Option A\\\", \\\"Option B\\\", \\\"Option C\\\", \\\"Option D\\\"]\"', 0, 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(782, 168, 'Which tool is recommended?', '\"[\\\"Tool X\\\", \\\"Tool Y\\\", \\\"Tool Z\\\", \\\"None\\\"]\"', 1, 1, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(783, 168, 'How long does it take to master?', '\"[\\\"1 week\\\", \\\"1 month\\\", \\\"6 months\\\", \\\"1 year\\\"]\"', 2, 2, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(784, 169, 'Did you complete the exercise?', '\"[\\\"Yes\\\", \\\"No\\\", \\\"Partially\\\", \\\"Not sure\\\"]\"', 0, 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(785, 170, 'What is the key to mastery?', '\"[\\\"Practice\\\", \\\"Theory\\\", \\\"Both\\\", \\\"Neither\\\"]\"', 2, 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(786, 170, 'How many hours of practice?', '\"[\\\"100\\\", \\\"500\\\", \\\"1000\\\", \\\"10000\\\"]\"', 2, 1, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(787, 170, 'Is this course enough?', '\"[\\\"Yes\\\", \\\"No\\\", \\\"Maybe\\\", \\\"Depends\\\"]\"', 0, 2, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(788, 170, 'Would you recommend it?', '\"[\\\"Yes\\\", \\\"No\\\", \\\"Maybe\\\", \\\"Depends\\\"]\"', 0, 3, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(789, 170, 'Final question?', '\"[\\\"A\\\", \\\"B\\\", \\\"C\\\", \\\"D\\\"]\"', 3, 4, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(790, 171, 'Did you finish the project?', '\"[\\\"Yes\\\", \\\"No\\\", \\\"In progress\\\", \\\"Not started\\\"]\"', 0, 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(791, 171, 'Rate your confidence', '\"[\\\"1\\\", \\\"2\\\", \\\"3\\\", \\\"4\\\"]\"', 3, 1, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(792, 173, 'frf', '[\"rfrf\",\"rfrfrfr\",\"frfrf\",\"rfrf\"]', 0, 0, '2026-04-07 01:11:56', '2026-04-07 08:08:23'),
(793, 174, 'frfrf', '[\"rrfrf\",\"rfrf\",\"rfrf\",\"rfrf\"]', 0, 0, '2026-04-07 01:11:56', '2026-04-07 08:08:23'),
(794, 175, 'fvvvvvv', '[\"fvvvvvvvvvvvvvv\",\"vfv\",\"vffv\",\"fvfv\"]', 0, 0, '2026-04-07 01:11:56', '2026-04-07 08:08:23'),
(795, 175, 'vfv', '[\"fvfv\",\"fvfv\",\"vfv\",\"fvfv\"]', 0, 1, '2026-04-07 01:11:56', '2026-04-07 08:08:23'),
(796, 176, 'fvvff', '[\"fvfv\",\"fvfv\",\"fvfv\",\"fvfv\"]', 0, 0, '2026-04-07 01:11:56', '2026-04-07 08:08:23'),
(797, 177, 'What does HTML stand for?', '\"[\\\"Hyper Text Markup Language\\\",\\\"High Tech Modern Language\\\",\\\"Home Tool Markup Language\\\",\\\"Hyperlinks and Text Markup Language\\\"]\"', 0, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(798, 177, 'Which tag is used for the largest heading?', '\"[\\\"<heading>\\\",\\\"<h6>\\\",\\\"<h1>\\\",\\\"<head>\\\"]\"', 2, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(799, 177, 'Which HTML element is used for paragraphs?', '\"[\\\"<para>\\\",\\\"<paragraph>\\\",\\\"<text>\\\",\\\"<p>\\\"]\"', 3, 2, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(800, 178, 'Which attribute specifies the URL for a link?', '\"[\\\"src\\\",\\\"link\\\",\\\"href\\\",\\\"url\\\"]\"', 2, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(801, 178, 'Which tag is used to create a hyperlink?', '\"[\\\"<link>\\\",\\\"<a>\\\",\\\"<href>\\\",\\\"<url>\\\"]\"', 1, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(802, 179, 'Which CSS property changes text color?', '\"[\\\"text-color\\\",\\\"font-color\\\",\\\"color\\\",\\\"text-style\\\"]\"', 2, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(803, 179, 'Which selector targets elements by their class?', '\"[\\\"#classname\\\",\\\".classname\\\",\\\"*classname\\\",\\\"@classname\\\"]\"', 1, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(804, 180, 'Which property creates a flex container?', '\"[\\\"display: block\\\",\\\"display: flex\\\",\\\"display: grid\\\",\\\"display: inline\\\"]\"', 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(805, 180, 'Which property aligns items along the main axis in flexbox?', '\"[\\\"align-items\\\",\\\"justify-content\\\",\\\"flex-direction\\\",\\\"align-content\\\"]\"', 1, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(806, 181, 'Which keyword declares a block-scoped variable?', '\"[\\\"var\\\",\\\"let\\\",\\\"define\\\",\\\"variable\\\"]\"', 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(807, 181, 'What is the output of typeof null?', '\"[\\\"null\\\",\\\"undefined\\\",\\\"object\\\",\\\"number\\\"]\"', 2, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(808, 181, 'Which is NOT a JavaScript primitive type?', '\"[\\\"string\\\",\\\"boolean\\\",\\\"array\\\",\\\"symbol\\\"]\"', 2, 2, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(809, 182, 'What is a closure in JavaScript?', '\"[\\\"A way to close the browser\\\",\\\"A function with access to its outer scope\\\",\\\"A method to end a loop\\\",\\\"A type of variable\\\"]\"', 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(810, 182, 'Which is an arrow function syntax?', '\"[\\\"function => ()\\\",\\\"() -> {}\\\",\\\"() => {}\\\",\\\"=> function()\\\"]\"', 2, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(811, 183, 'Which HTML5 element is used for navigation links?', '\"[\\\"<navigation>\\\",\\\"<nav>\\\",\\\"<menu>\\\",\\\"<links>\\\"]\"', 1, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(812, 183, 'Which CSS property creates space inside an element?', '\"[\\\"margin\\\",\\\"border\\\",\\\"padding\\\",\\\"spacing\\\"]\"', 2, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(813, 183, 'What does the z-index property control?', '\"[\\\"Text size\\\",\\\"Stacking order of elements\\\",\\\"Zoom level\\\",\\\"Element opacity\\\"]\"', 1, 2, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(814, 183, 'Which CSS unit is relative to the viewport width?', '\"[\\\"px\\\",\\\"em\\\",\\\"rem\\\",\\\"vw\\\"]\"', 3, 3, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(815, 184, 'What does JSON stand for?', '\"[\\\"JavaScript Object Notation\\\",\\\"Java Standard Output Network\\\",\\\"JavaScript Oriented Naming\\\",\\\"Java Serialized Object Network\\\"]\"', 0, 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(816, 184, 'Which method converts a JSON string to a JavaScript object?', '\"[\\\"JSON.stringify()\\\",\\\"JSON.parse()\\\",\\\"JSON.toObject()\\\",\\\"JSON.convert()\\\"]\"', 1, 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(817, 184, 'What is the purpose of the \"async\" keyword?', '\"[\\\"To make a function run faster\\\",\\\"To declare an asynchronous function that returns a Promise\\\",\\\"To run code in parallel\\\",\\\"To stop execution until a condition is met\\\"]\"', 1, 2, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(818, 184, 'Which array method creates a new array with elements that pass a test?', '\"[\\\"map()\\\",\\\"forEach()\\\",\\\"filter()\\\",\\\"reduce()\\\"]\"', 2, 3, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(819, 186, 'frfrfffffffffffffffffffff', '[\"rvrv\",\"rvrv\",\"rvv\",\"rv\"]', 0, 0, '2026-04-07 10:30:04', '2026-04-07 10:35:02'),
(820, 186, 'rvrvr', '[\"rvrvr\",\"rvrv\",\"vrrv\",\"rvr\"]', 0, 1, '2026-04-07 10:30:04', '2026-04-07 10:35:02'),
(827, 185, 'vrvrv', '[\"vrv\",\"rvrv\",\"vrv\",\"rvrv\"]', 0, 0, '2026-04-07 10:35:02', '2026-04-07 10:35:02'),
(828, 185, 'rvrvr', '[\"vrvvr\",\"vrr\",\"vrrv\",\"vrvr\"]', 0, 1, '2026-04-07 10:35:02', '2026-04-07 10:35:02'),
(829, 187, 'fbfbfbfbf', '\"[\\\"fbfb\\\",\\\"fb\\\",\\\"fbfbbfb\\\",\\\"fbfb\\\"]\"', 0, 0, '2026-04-09 07:35:28', '2026-04-09 07:35:28'),
(830, 188, 'f f fff f', '\"[\\\"bfb\\\",\\\"brb\\\",\\\"rbrb\\\",\\\"brbrb\\\"]\"', 0, 0, '2026-04-09 07:35:28', '2026-04-09 07:35:28'),
(831, 189, 'fvfvfvfvfv', '[\"vffvf\",\"vfvf\",\"fvfv\",\"fvfv\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(832, 190, 'vfvfv', '[\"fvfv\",\"fvfv\",\"fvfv\",\"fvfv\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(833, 191, 'fvfv', '[\"vfv\",\"vffv\",\"vfvf\",\"fvfvfv\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(834, 192, 'fvfvf', '[\"vdfv\",\"fvfv\",\"fvfvfvfv\",\"fvfvfv\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(835, 193, 'efef', '[\"ewfewf\",\"wefewf\",\"ewfwef\",\"wefewf\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(836, 193, 'wefewf', '[\"wefewf\",\"ewfewf\",\"wefwef\",\"wefwef\"]', 0, 1, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(837, 194, 'wefwef', '[\"wefwef\",\"wefewf\",\"wfwef\",\"wfewf\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(838, 195, 'wefewf', '[\"wefwef\",\"wefwef\",\"ewfewf\",\"wfwef\"]', 0, 0, '2026-04-09 08:51:39', '2026-04-15 10:58:02'),
(839, 196, 'fgdfgdfgfd', '\"[\\\"gfdgdfg\\\",\\\"fdgdfgdg\\\",\\\"dfgfdg\\\",\\\"dfgdfg\\\"]\"', 0, 0, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(840, 196, 'dfgdfgdf', '\"[\\\"dfgdfg\\\",\\\"dfgdfg\\\",\\\"dfgdfg\\\",\\\"dfgdfg\\\"]\"', 0, 1, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(841, 198, 'vdvd', '\"[\\\"vdvdv\\\",\\\"dvdv\\\",\\\"dvdvd\\\",\\\"vdv\\\"]\"', 0, 0, '2026-04-18 10:12:00', '2026-04-18 10:12:00'),
(842, 199, 'zcxzc', '\"[\\\"zxczc\\\",\\\"zxczxc\\\",\\\"zxczxc\\\",\\\"zczxc\\\"]\"', 0, 0, '2026-04-20 11:16:14', '2026-04-20 11:16:14'),
(843, 200, 'dcdc', '\"[\\\"c c\\\",\\\"c c\\\",\\\"c c\\\",\\\"c c\\\"]\"', 0, 0, '2026-04-20 11:20:19', '2026-04-20 11:20:19'),
(844, 202, 'zzz', '\"[\\\"zz\\\",\\\"zz\\\",\\\"zz\\\",\\\"zz\\\"]\"', 0, 0, '2026-04-21 05:58:31', '2026-04-21 05:58:31'),
(845, 203, '2ee2e', '\"[\\\"2e2e\\\",\\\"2e2e\\\",\\\"2ee\\\",\\\"2e2e\\\"]\"', 0, 0, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(846, 204, 'dccdc', '\"[\\\"dcc\\\",\\\"dcc\\\",\\\"dcdc\\\",\\\"dcdc\\\"]\"', 0, 0, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(847, 205, 'wdwd', '[\"wdw\",\"wdwd\",\"dwdwdwd\",\"wdwd\"]', 0, 0, '2026-04-23 06:28:05', '2026-04-23 06:43:14'),
(848, 206, 'wdwd', '[\"wdwdw\",\"dwdwd\",\"wdwdwd\",\"wdwdwdwd\"]', 0, 0, '2026-04-23 06:28:05', '2026-04-23 06:43:14'),
(849, 207, 'wefwef', '[\"wefwf\",\"wefwf\",\"wefwef\",\"wefwef\"]', 0, 0, '2026-04-27 10:49:59', '2026-04-27 10:50:29');

-- --------------------------------------------------------

--
-- Table structure for table `course_resources`
--

CREATE TABLE `course_resources` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lesson_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL DEFAULT 'document',
  `file_size` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_resources`
--

INSERT INTO `course_resources` (`id`, `lesson_id`, `course_id`, `title`, `file_path`, `file_type`, `file_size`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Listening Mastery - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 2784953, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(2, 1, 1, 'Listening Mastery - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 1087359, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(3, 1, 1, 'Listening Mastery - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 1919281, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(4, 2, 1, 'Listening Mastery - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 2117448, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(5, 2, 1, 'Listening Mastery - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 1533293, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(6, 2, 1, 'Listening Mastery - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 2690688, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(7, 3, 1, 'Listening Mastery - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 1643559, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(8, 3, 1, 'Listening Mastery - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 2880167, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(9, 3, 1, 'Listening Mastery - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2303175, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(10, 4, 1, 'Listening Mastery - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 224049, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(11, 4, 1, 'Listening Mastery - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 293656, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(12, 4, 1, 'Listening Mastery - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 447186, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(13, 5, 1, 'Listening Mastery - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2037687, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(14, 5, 1, 'Listening Mastery - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 2520831, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(15, 5, 1, 'Listening Mastery - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 2689084, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(16, 6, 1, 'Reading Excellence - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 790682, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(17, 6, 1, 'Reading Excellence - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 739777, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(18, 6, 1, 'Reading Excellence - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 728648, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(19, 7, 1, 'Reading Excellence - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 1720211, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(20, 7, 1, 'Reading Excellence - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 509941, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(21, 7, 1, 'Reading Excellence - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 311699, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(22, 8, 1, 'Reading Excellence - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 867814, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(23, 8, 1, 'Reading Excellence - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 2922491, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(24, 8, 1, 'Reading Excellence - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 1494107, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(25, 9, 1, 'Reading Excellence - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 967964, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(26, 9, 1, 'Reading Excellence - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2516446, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(27, 9, 1, 'Reading Excellence - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 796795, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(28, 10, 1, 'Reading Excellence - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 1011207, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(29, 10, 1, 'Reading Excellence - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 2355417, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(30, 10, 1, 'Reading Excellence - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 725443, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(31, 11, 1, 'Writing Task 1 - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 2514407, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(32, 11, 1, 'Writing Task 1 - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 2342588, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(33, 11, 1, 'Writing Task 1 - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 419073, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(34, 12, 1, 'Writing Task 1 - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 2289111, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(35, 12, 1, 'Writing Task 1 - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 2360579, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(36, 12, 1, 'Writing Task 1 - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 1546917, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(37, 13, 1, 'Writing Task 1 - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 1637395, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(38, 13, 1, 'Writing Task 1 - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 1387900, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(39, 13, 1, 'Writing Task 1 - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2380653, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(40, 14, 1, 'Writing Task 1 - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 365316, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(41, 14, 1, 'Writing Task 1 - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2990711, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(42, 14, 1, 'Writing Task 1 - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 2040525, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(43, 15, 1, 'Writing Task 1 - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2568724, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(44, 15, 1, 'Writing Task 1 - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 2827519, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(45, 15, 1, 'Writing Task 1 - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 788372, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(46, 16, 1, 'Writing Task 2 - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 1408446, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(47, 16, 1, 'Writing Task 2 - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 1730100, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(48, 16, 1, 'Writing Task 2 - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 324190, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(49, 17, 1, 'Writing Task 2 - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 1140022, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(50, 17, 1, 'Writing Task 2 - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 964524, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(51, 17, 1, 'Writing Task 2 - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 735709, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(52, 18, 1, 'Writing Task 2 - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 2688778, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(53, 18, 1, 'Writing Task 2 - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 808913, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(54, 18, 1, 'Writing Task 2 - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2442227, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(55, 19, 1, 'Writing Task 2 - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 1914990, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(56, 19, 1, 'Writing Task 2 - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2624226, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(57, 19, 1, 'Writing Task 2 - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 2452689, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(58, 20, 1, 'Writing Task 2 - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 701750, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(59, 20, 1, 'Writing Task 2 - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 1564561, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(60, 20, 1, 'Writing Task 2 - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 683362, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(61, 21, 1, 'Speaking Confidence - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 2130120, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(62, 21, 1, 'Speaking Confidence - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 1634855, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(63, 21, 1, 'Speaking Confidence - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 1513422, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(64, 22, 1, 'Speaking Confidence - Study Notes.pdf', 'course-docs/ielts-band-8-complete/Study Notes.pdf', 'pdf', 2090837, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(65, 22, 1, 'Speaking Confidence - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 316756, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(66, 22, 1, 'Speaking Confidence - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 1296653, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(67, 23, 1, 'Speaking Confidence - Practice Exercises.pdf', 'course-docs/ielts-band-8-complete/Practice Exercises.pdf', 'pdf', 746249, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(68, 23, 1, 'Speaking Confidence - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 1296030, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(69, 23, 1, 'Speaking Confidence - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 512483, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(70, 24, 1, 'Speaking Confidence - Reference Material.pdf', 'course-docs/ielts-band-8-complete/Reference Material.pdf', 'pdf', 628217, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(71, 24, 1, 'Speaking Confidence - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 2927203, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(72, 24, 1, 'Speaking Confidence - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 2313760, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(73, 25, 1, 'Speaking Confidence - Worksheets.pdf', 'course-docs/ielts-band-8-complete/Worksheets.pdf', 'pdf', 960024, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(74, 25, 1, 'Speaking Confidence - Summary Sheet.pdf', 'course-docs/ielts-band-8-complete/Summary Sheet.pdf', 'pdf', 228409, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(75, 25, 1, 'Speaking Confidence - Course Guide.pdf', 'course-docs/ielts-band-8-complete/Course Guide.pdf', 'pdf', 2201303, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(76, 26, 2, 'Research Fundamentals - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 1536727, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(77, 26, 2, 'Research Fundamentals - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 2815276, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(78, 26, 2, 'Research Fundamentals - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1274879, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(79, 27, 2, 'Research Fundamentals - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 2228108, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(80, 27, 2, 'Research Fundamentals - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 521192, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(81, 27, 2, 'Research Fundamentals - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1851583, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(82, 28, 2, 'Research Fundamentals - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 900868, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(83, 28, 2, 'Research Fundamentals - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1831521, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(84, 28, 2, 'Research Fundamentals - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1978230, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(85, 29, 2, 'Research Fundamentals - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 2484153, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(86, 29, 2, 'Research Fundamentals - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1552184, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(87, 29, 2, 'Research Fundamentals - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 493807, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(88, 30, 2, 'Research Fundamentals - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1343367, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(89, 30, 2, 'Research Fundamentals - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 1901035, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(90, 30, 2, 'Research Fundamentals - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 2627464, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(91, 31, 2, 'Essay Writing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 2111684, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(92, 31, 2, 'Essay Writing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 1770638, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(93, 31, 2, 'Essay Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1997206, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(94, 32, 2, 'Essay Writing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 2900509, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(95, 32, 2, 'Essay Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1109749, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(96, 32, 2, 'Essay Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1847120, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(97, 33, 2, 'Essay Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1956702, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(98, 33, 2, 'Essay Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 619037, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(99, 33, 2, 'Essay Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 906074, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(100, 34, 2, 'Essay Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1515610, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(101, 34, 2, 'Essay Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1552186, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(102, 34, 2, 'Essay Writing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 1749793, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(103, 35, 2, 'Essay Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 289918, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(104, 35, 2, 'Essay Writing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 841286, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(105, 35, 2, 'Essay Writing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 2155473, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(106, 36, 2, 'Research Paper Writing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 976548, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(107, 36, 2, 'Research Paper Writing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 1449822, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(108, 36, 2, 'Research Paper Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1468831, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(109, 37, 2, 'Research Paper Writing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 2968055, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(110, 37, 2, 'Research Paper Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 2527958, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(111, 37, 2, 'Research Paper Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 2161924, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(112, 38, 2, 'Research Paper Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1303829, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(113, 38, 2, 'Research Paper Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1693211, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(114, 38, 2, 'Research Paper Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1052298, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(115, 39, 2, 'Research Paper Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 2778248, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(116, 39, 2, 'Research Paper Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1389668, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(117, 39, 2, 'Research Paper Writing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 2894716, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(118, 40, 2, 'Research Paper Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 733541, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(119, 40, 2, 'Research Paper Writing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 985677, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(120, 40, 2, 'Research Paper Writing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 2318550, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(121, 41, 2, 'Citation & Referencing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 1224284, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(122, 41, 2, 'Citation & Referencing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 1548934, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(123, 41, 2, 'Citation & Referencing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 928988, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(124, 42, 2, 'Citation & Referencing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 1073488, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(125, 42, 2, 'Citation & Referencing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1770457, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(126, 42, 2, 'Citation & Referencing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 779898, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(127, 43, 2, 'Citation & Referencing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1343674, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(128, 43, 2, 'Citation & Referencing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1653737, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(129, 43, 2, 'Citation & Referencing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 2951454, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(130, 44, 2, 'Citation & Referencing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 452914, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(131, 44, 2, 'Citation & Referencing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1311217, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(132, 44, 2, 'Citation & Referencing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 1069470, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(133, 45, 2, 'Citation & Referencing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 2721231, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(134, 45, 2, 'Citation & Referencing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 1537261, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(135, 45, 2, 'Citation & Referencing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 2667131, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(136, 46, 2, 'Dissertation Writing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 1172400, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(137, 46, 2, 'Dissertation Writing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 1544058, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(138, 46, 2, 'Dissertation Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1098460, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(139, 47, 2, 'Dissertation Writing - Study Notes.pdf', 'course-docs/academic-writing-university/Study Notes.pdf', 'pdf', 1524322, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(140, 47, 2, 'Dissertation Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1279380, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(141, 47, 2, 'Dissertation Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 1974157, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(142, 48, 2, 'Dissertation Writing - Practice Exercises.pdf', 'course-docs/academic-writing-university/Practice Exercises.pdf', 'pdf', 1699979, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(143, 48, 2, 'Dissertation Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 2575656, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(144, 48, 2, 'Dissertation Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 1319435, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(145, 49, 2, 'Dissertation Writing - Reference Material.pdf', 'course-docs/academic-writing-university/Reference Material.pdf', 'pdf', 730356, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(146, 49, 2, 'Dissertation Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 2176141, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(147, 49, 2, 'Dissertation Writing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 2211173, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(148, 50, 2, 'Dissertation Writing - Worksheets.pdf', 'course-docs/academic-writing-university/Worksheets.pdf', 'pdf', 2553967, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(149, 50, 2, 'Dissertation Writing - Summary Sheet.pdf', 'course-docs/academic-writing-university/Summary Sheet.pdf', 'pdf', 1200921, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(150, 50, 2, 'Dissertation Writing - Course Guide.pdf', 'course-docs/academic-writing-university/Course Guide.pdf', 'pdf', 1161870, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(151, 51, 3, 'Professional Email Writing - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 624241, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(152, 51, 3, 'Professional Email Writing - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 1067585, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(153, 51, 3, 'Professional Email Writing - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1822866, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(154, 52, 3, 'Professional Email Writing - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 1928606, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(155, 52, 3, 'Professional Email Writing - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1116150, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(156, 52, 3, 'Professional Email Writing - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1336378, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(157, 53, 3, 'Professional Email Writing - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2641472, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(158, 53, 3, 'Professional Email Writing - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 2714247, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(159, 53, 3, 'Professional Email Writing - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1791280, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(160, 54, 3, 'Professional Email Writing - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1605775, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(161, 54, 3, 'Professional Email Writing - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1227202, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(162, 54, 3, 'Professional Email Writing - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 245307, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(163, 55, 3, 'Professional Email Writing - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 2361666, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(164, 55, 3, 'Professional Email Writing - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 1217318, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(165, 55, 3, 'Professional Email Writing - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 2384320, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(166, 56, 3, 'Meeting Communication - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 923289, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(167, 56, 3, 'Meeting Communication - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 2492844, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(168, 56, 3, 'Meeting Communication - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1077496, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(169, 57, 3, 'Meeting Communication - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 2346494, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(170, 57, 3, 'Meeting Communication - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2033366, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(171, 57, 3, 'Meeting Communication - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1306858, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(172, 58, 3, 'Meeting Communication - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2587283, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(173, 58, 3, 'Meeting Communication - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1870204, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(174, 58, 3, 'Meeting Communication - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1605310, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(175, 59, 3, 'Meeting Communication - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 2147315, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(176, 59, 3, 'Meeting Communication - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1647662, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(177, 59, 3, 'Meeting Communication - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 1122286, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(178, 60, 3, 'Meeting Communication - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 577812, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(179, 60, 3, 'Meeting Communication - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 1924499, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(180, 60, 3, 'Meeting Communication - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 442994, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(181, 61, 3, 'Presentation Skills - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 1838936, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(182, 61, 3, 'Presentation Skills - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 1336837, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(183, 61, 3, 'Presentation Skills - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 817803, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(184, 62, 3, 'Presentation Skills - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 652194, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(185, 62, 3, 'Presentation Skills - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2790298, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(186, 62, 3, 'Presentation Skills - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1616578, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(187, 63, 3, 'Presentation Skills - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1667710, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(188, 63, 3, 'Presentation Skills - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 739889, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(189, 63, 3, 'Presentation Skills - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 481190, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(190, 64, 3, 'Presentation Skills - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1189648, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(191, 64, 3, 'Presentation Skills - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1698418, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(192, 64, 3, 'Presentation Skills - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 2012189, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(193, 65, 3, 'Presentation Skills - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1382503, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(194, 65, 3, 'Presentation Skills - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 734298, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(195, 65, 3, 'Presentation Skills - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 1685881, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(196, 66, 3, 'Negotiation Language - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 1833963, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(197, 66, 3, 'Negotiation Language - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 1282582, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(198, 66, 3, 'Negotiation Language - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2392077, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(199, 67, 3, 'Negotiation Language - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 2671912, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(200, 67, 3, 'Negotiation Language - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1114582, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(201, 67, 3, 'Negotiation Language - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 839449, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(202, 68, 3, 'Negotiation Language - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1087388, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(203, 68, 3, 'Negotiation Language - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 1815854, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(204, 68, 3, 'Negotiation Language - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1558728, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(205, 69, 3, 'Negotiation Language - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 2005183, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(206, 69, 3, 'Negotiation Language - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1225158, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(207, 69, 3, 'Negotiation Language - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 977322, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(208, 70, 3, 'Negotiation Language - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 608211, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(209, 70, 3, 'Negotiation Language - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 2525623, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(210, 70, 3, 'Negotiation Language - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 1090224, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(211, 71, 3, 'Report Writing - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 2682702, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(212, 71, 3, 'Report Writing - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 2970250, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(213, 71, 3, 'Report Writing - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2746608, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(214, 72, 3, 'Report Writing - Study Notes.pdf', 'course-docs/business-english-corporate/Study Notes.pdf', 'pdf', 2996296, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(215, 72, 3, 'Report Writing - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 2682536, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(216, 72, 3, 'Report Writing - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 2499722, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(217, 73, 3, 'Report Writing - Practice Exercises.pdf', 'course-docs/business-english-corporate/Practice Exercises.pdf', 'pdf', 1687141, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(218, 73, 3, 'Report Writing - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 2684816, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(219, 73, 3, 'Report Writing - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 1490511, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(220, 74, 3, 'Report Writing - Reference Material.pdf', 'course-docs/business-english-corporate/Reference Material.pdf', 'pdf', 2282245, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(221, 74, 3, 'Report Writing - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 513504, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(222, 74, 3, 'Report Writing - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 1196868, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(223, 75, 3, 'Report Writing - Worksheets.pdf', 'course-docs/business-english-corporate/Worksheets.pdf', 'pdf', 2656116, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(224, 75, 3, 'Report Writing - Summary Sheet.pdf', 'course-docs/business-english-corporate/Summary Sheet.pdf', 'pdf', 1414988, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(225, 75, 3, 'Report Writing - Course Guide.pdf', 'course-docs/business-english-corporate/Course Guide.pdf', 'pdf', 918080, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(226, 76, 4, 'Finding Your Voice - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 1638256, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(227, 76, 4, 'Finding Your Voice - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 2471158, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(228, 76, 4, 'Finding Your Voice - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 1106281, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(229, 77, 4, 'Finding Your Voice - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 1674048, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(230, 77, 4, 'Finding Your Voice - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 840185, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(231, 77, 4, 'Finding Your Voice - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 468084, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(232, 78, 4, 'Finding Your Voice - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 2294059, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(233, 78, 4, 'Finding Your Voice - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 518318, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(234, 78, 4, 'Finding Your Voice - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 2946613, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(235, 79, 4, 'Finding Your Voice - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 2193073, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(236, 79, 4, 'Finding Your Voice - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 892376, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(237, 79, 4, 'Finding Your Voice - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 442623, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(238, 80, 4, 'Finding Your Voice - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 2729029, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(239, 80, 4, 'Finding Your Voice - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 1712427, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(240, 80, 4, 'Finding Your Voice - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 1424469, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(241, 81, 4, 'Character Development - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 2863755, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(242, 81, 4, 'Character Development - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 1908861, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(243, 81, 4, 'Character Development - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 2945650, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(244, 82, 4, 'Character Development - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 877333, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(245, 82, 4, 'Character Development - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 462109, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(246, 82, 4, 'Character Development - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 1710682, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(247, 83, 4, 'Character Development - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 2420527, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(248, 83, 4, 'Character Development - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 2645029, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(249, 83, 4, 'Character Development - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 276672, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(250, 84, 4, 'Character Development - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 1528532, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(251, 84, 4, 'Character Development - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 2609208, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(252, 84, 4, 'Character Development - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 1506483, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(253, 85, 4, 'Character Development - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 1699841, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(254, 85, 4, 'Character Development - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 865856, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(255, 85, 4, 'Character Development - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 952594, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(256, 86, 4, 'Plot & Structure - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 1569577, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(257, 86, 4, 'Plot & Structure - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 663608, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(258, 86, 4, 'Plot & Structure - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 610009, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(259, 87, 4, 'Plot & Structure - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 2540261, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(260, 87, 4, 'Plot & Structure - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 730433, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(261, 87, 4, 'Plot & Structure - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 391125, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(262, 88, 4, 'Plot & Structure - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 2689040, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(263, 88, 4, 'Plot & Structure - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 1117575, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(264, 88, 4, 'Plot & Structure - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 1995065, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(265, 89, 4, 'Plot & Structure - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 2124994, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(266, 89, 4, 'Plot & Structure - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 1722304, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(267, 89, 4, 'Plot & Structure - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 1933185, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(268, 90, 4, 'Plot & Structure - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 2565604, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(269, 90, 4, 'Plot & Structure - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 1636433, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(270, 90, 4, 'Plot & Structure - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 1257145, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(271, 91, 4, 'Setting & World Building - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 576155, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(272, 91, 4, 'Setting & World Building - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 1486269, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(273, 91, 4, 'Setting & World Building - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 1413616, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(274, 92, 4, 'Setting & World Building - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 478148, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(275, 92, 4, 'Setting & World Building - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 931012, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(276, 92, 4, 'Setting & World Building - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 2286219, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(277, 93, 4, 'Setting & World Building - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 859703, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(278, 93, 4, 'Setting & World Building - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 1178865, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(279, 93, 4, 'Setting & World Building - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 801361, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(280, 94, 4, 'Setting & World Building - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 1915173, '2026-04-06 02:56:09', '2026-04-06 02:56:09');
INSERT INTO `course_resources` (`id`, `lesson_id`, `course_id`, `title`, `file_path`, `file_type`, `file_size`, `created_at`, `updated_at`) VALUES
(281, 94, 4, 'Setting & World Building - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 681329, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(282, 94, 4, 'Setting & World Building - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 795681, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(283, 95, 4, 'Setting & World Building - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 2429017, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(284, 95, 4, 'Setting & World Building - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 1058738, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(285, 95, 4, 'Setting & World Building - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 372467, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(286, 96, 4, 'Editing & Publishing - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 2492013, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(287, 96, 4, 'Editing & Publishing - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 962856, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(288, 96, 4, 'Editing & Publishing - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 1717500, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(289, 97, 4, 'Editing & Publishing - Study Notes.pdf', 'course-docs/creative-writing-publication/Study Notes.pdf', 'pdf', 1849987, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(290, 97, 4, 'Editing & Publishing - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 1590348, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(291, 97, 4, 'Editing & Publishing - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 2997608, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(292, 98, 4, 'Editing & Publishing - Practice Exercises.pdf', 'course-docs/creative-writing-publication/Practice Exercises.pdf', 'pdf', 1491238, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(293, 98, 4, 'Editing & Publishing - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 1837573, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(294, 98, 4, 'Editing & Publishing - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 2334176, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(295, 99, 4, 'Editing & Publishing - Reference Material.pdf', 'course-docs/creative-writing-publication/Reference Material.pdf', 'pdf', 2852277, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(296, 99, 4, 'Editing & Publishing - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 1460048, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(297, 99, 4, 'Editing & Publishing - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 2008301, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(298, 100, 4, 'Editing & Publishing - Worksheets.pdf', 'course-docs/creative-writing-publication/Worksheets.pdf', 'pdf', 1001128, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(299, 100, 4, 'Editing & Publishing - Summary Sheet.pdf', 'course-docs/creative-writing-publication/Summary Sheet.pdf', 'pdf', 1547083, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(300, 100, 4, 'Editing & Publishing - Course Guide.pdf', 'course-docs/creative-writing-publication/Course Guide.pdf', 'pdf', 2997704, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(301, 101, 5, 'Pronunciation Basics - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 297104, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(302, 101, 5, 'Pronunciation Basics - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 1936527, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(303, 101, 5, 'Pronunciation Basics - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2308726, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(304, 102, 5, 'Pronunciation Basics - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 2615968, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(305, 102, 5, 'Pronunciation Basics - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2735546, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(306, 102, 5, 'Pronunciation Basics - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 510326, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(307, 103, 5, 'Pronunciation Basics - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 1272857, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(308, 103, 5, 'Pronunciation Basics - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 220685, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(309, 103, 5, 'Pronunciation Basics - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 685196, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(310, 104, 5, 'Pronunciation Basics - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 531040, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(311, 104, 5, 'Pronunciation Basics - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 453017, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(312, 104, 5, 'Pronunciation Basics - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 505490, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(313, 105, 5, 'Pronunciation Basics - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 2020364, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(314, 105, 5, 'Pronunciation Basics - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 647978, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(315, 105, 5, 'Pronunciation Basics - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 1590681, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(316, 106, 5, 'Daily Conversations - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 2723795, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(317, 106, 5, 'Daily Conversations - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 1585864, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(318, 106, 5, 'Daily Conversations - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2491583, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(319, 107, 5, 'Daily Conversations - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 2752363, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(320, 107, 5, 'Daily Conversations - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 784732, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(321, 107, 5, 'Daily Conversations - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 1865420, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(322, 108, 5, 'Daily Conversations - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2605553, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(323, 108, 5, 'Daily Conversations - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 2434135, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(324, 108, 5, 'Daily Conversations - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 263636, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(325, 109, 5, 'Daily Conversations - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 1530424, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(326, 109, 5, 'Daily Conversations - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 1513165, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(327, 109, 5, 'Daily Conversations - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 2268642, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(328, 110, 5, 'Daily Conversations - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 2657138, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(329, 110, 5, 'Daily Conversations - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 229011, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(330, 110, 5, 'Daily Conversations - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 884995, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(331, 111, 5, 'Social Situations - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 446067, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(332, 111, 5, 'Social Situations - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 796376, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(333, 111, 5, 'Social Situations - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2140623, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(334, 112, 5, 'Social Situations - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 1561983, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(335, 112, 5, 'Social Situations - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 1774431, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(336, 112, 5, 'Social Situations - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 1987796, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(337, 113, 5, 'Social Situations - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 1159824, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(338, 113, 5, 'Social Situations - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 2975515, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(339, 113, 5, 'Social Situations - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 1777976, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(340, 114, 5, 'Social Situations - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 1775442, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(341, 114, 5, 'Social Situations - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 1960636, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(342, 114, 5, 'Social Situations - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 1581527, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(343, 115, 5, 'Social Situations - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 2030180, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(344, 115, 5, 'Social Situations - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 1977098, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(345, 115, 5, 'Social Situations - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 1032809, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(346, 116, 5, 'Professional Speaking - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 652349, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(347, 116, 5, 'Professional Speaking - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 1041039, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(348, 116, 5, 'Professional Speaking - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 1868791, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(349, 117, 5, 'Professional Speaking - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 903484, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(350, 117, 5, 'Professional Speaking - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 1753693, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(351, 117, 5, 'Professional Speaking - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 2155142, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(352, 118, 5, 'Professional Speaking - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2267090, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(353, 118, 5, 'Professional Speaking - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 2928467, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(354, 118, 5, 'Professional Speaking - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 1286894, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(355, 119, 5, 'Professional Speaking - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 2829316, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(356, 119, 5, 'Professional Speaking - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 2998116, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(357, 119, 5, 'Professional Speaking - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 1909582, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(358, 120, 5, 'Professional Speaking - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 789302, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(359, 120, 5, 'Professional Speaking - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 1802839, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(360, 120, 5, 'Professional Speaking - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 368878, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(361, 121, 5, 'Advanced Fluency - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 2820397, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(362, 121, 5, 'Advanced Fluency - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 2525377, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(363, 121, 5, 'Advanced Fluency - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 1921854, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(364, 122, 5, 'Advanced Fluency - Study Notes.pdf', 'course-docs/spoken-english-fluency/Study Notes.pdf', 'pdf', 470080, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(365, 122, 5, 'Advanced Fluency - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2444637, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(366, 122, 5, 'Advanced Fluency - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 1593385, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(367, 123, 5, 'Advanced Fluency - Practice Exercises.pdf', 'course-docs/spoken-english-fluency/Practice Exercises.pdf', 'pdf', 2533209, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(368, 123, 5, 'Advanced Fluency - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 573722, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(369, 123, 5, 'Advanced Fluency - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 2689517, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(370, 124, 5, 'Advanced Fluency - Reference Material.pdf', 'course-docs/spoken-english-fluency/Reference Material.pdf', 'pdf', 425237, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(371, 124, 5, 'Advanced Fluency - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 1323464, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(372, 124, 5, 'Advanced Fluency - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 987322, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(373, 125, 5, 'Advanced Fluency - Worksheets.pdf', 'course-docs/spoken-english-fluency/Worksheets.pdf', 'pdf', 955150, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(374, 125, 5, 'Advanced Fluency - Summary Sheet.pdf', 'course-docs/spoken-english-fluency/Summary Sheet.pdf', 'pdf', 2917839, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(375, 125, 5, 'Advanced Fluency - Course Guide.pdf', 'course-docs/spoken-english-fluency/Course Guide.pdf', 'pdf', 1141440, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(376, 126, 6, 'Task 1 Fundamentals - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 1608091, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(377, 126, 6, 'Task 1 Fundamentals - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 520471, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(378, 126, 6, 'Task 1 Fundamentals - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 1521183, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(379, 127, 6, 'Task 1 Fundamentals - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 2464481, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(380, 127, 6, 'Task 1 Fundamentals - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 685760, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(381, 127, 6, 'Task 1 Fundamentals - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 2354806, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(382, 128, 6, 'Task 1 Fundamentals - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 832203, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(383, 128, 6, 'Task 1 Fundamentals - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 2718487, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(384, 128, 6, 'Task 1 Fundamentals - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1571414, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(385, 129, 6, 'Task 1 Fundamentals - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1493297, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(386, 129, 6, 'Task 1 Fundamentals - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 2290878, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(387, 129, 6, 'Task 1 Fundamentals - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 1543329, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(388, 130, 6, 'Task 1 Fundamentals - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 2285254, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(389, 130, 6, 'Task 1 Fundamentals - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 355429, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(390, 130, 6, 'Task 1 Fundamentals - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 766733, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(391, 131, 6, 'Task 1 Advanced - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 1627695, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(392, 131, 6, 'Task 1 Advanced - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 449682, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(393, 131, 6, 'Task 1 Advanced - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 2589583, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(394, 132, 6, 'Task 1 Advanced - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 2381337, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(395, 132, 6, 'Task 1 Advanced - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 1043693, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(396, 132, 6, 'Task 1 Advanced - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1165800, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(397, 133, 6, 'Task 1 Advanced - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 2683302, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(398, 133, 6, 'Task 1 Advanced - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1279088, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(399, 133, 6, 'Task 1 Advanced - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 2276368, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(400, 134, 6, 'Task 1 Advanced - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1335296, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(401, 134, 6, 'Task 1 Advanced - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 2726321, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(402, 134, 6, 'Task 1 Advanced - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 1655388, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(403, 135, 6, 'Task 1 Advanced - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1540224, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(404, 135, 6, 'Task 1 Advanced - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 224717, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(405, 135, 6, 'Task 1 Advanced - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 2158170, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(406, 136, 6, 'Task 2 Essay Types - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 1341527, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(407, 136, 6, 'Task 2 Essay Types - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 1277058, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(408, 136, 6, 'Task 2 Essay Types - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 1967225, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(409, 137, 6, 'Task 2 Essay Types - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 1885993, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(410, 137, 6, 'Task 2 Essay Types - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 399385, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(411, 137, 6, 'Task 2 Essay Types - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1028063, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(412, 138, 6, 'Task 2 Essay Types - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 1097643, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(413, 138, 6, 'Task 2 Essay Types - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 456859, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(414, 138, 6, 'Task 2 Essay Types - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1631061, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(415, 139, 6, 'Task 2 Essay Types - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 259537, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(416, 139, 6, 'Task 2 Essay Types - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1151250, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(417, 139, 6, 'Task 2 Essay Types - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 1799824, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(418, 140, 6, 'Task 2 Essay Types - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1958423, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(419, 140, 6, 'Task 2 Essay Types - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 1393889, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(420, 140, 6, 'Task 2 Essay Types - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 1565139, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(421, 141, 6, 'Grammar for Writing - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 904653, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(422, 141, 6, 'Grammar for Writing - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 1791388, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(423, 141, 6, 'Grammar for Writing - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 2503349, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(424, 142, 6, 'Grammar for Writing - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 1161175, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(425, 142, 6, 'Grammar for Writing - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 2349720, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(426, 142, 6, 'Grammar for Writing - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 648305, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(427, 143, 6, 'Grammar for Writing - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 449807, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(428, 143, 6, 'Grammar for Writing - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 660004, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(429, 143, 6, 'Grammar for Writing - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1998811, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(430, 144, 6, 'Grammar for Writing - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1862524, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(431, 144, 6, 'Grammar for Writing - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1984165, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(432, 144, 6, 'Grammar for Writing - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 801202, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(433, 145, 6, 'Grammar for Writing - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 554601, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(434, 145, 6, 'Grammar for Writing - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 804848, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(435, 145, 6, 'Grammar for Writing - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 1464816, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(436, 146, 6, 'Practice & Assessment - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 2217335, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(437, 146, 6, 'Practice & Assessment - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 584210, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(438, 146, 6, 'Practice & Assessment - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 1197643, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(439, 147, 6, 'Practice & Assessment - Study Notes.pdf', 'course-docs/ielts-writing-intensive/Study Notes.pdf', 'pdf', 2441031, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(440, 147, 6, 'Practice & Assessment - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 1299068, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(441, 147, 6, 'Practice & Assessment - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 1570381, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(442, 148, 6, 'Practice & Assessment - Practice Exercises.pdf', 'course-docs/ielts-writing-intensive/Practice Exercises.pdf', 'pdf', 229214, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(443, 148, 6, 'Practice & Assessment - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 2604243, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(444, 148, 6, 'Practice & Assessment - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1112106, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(445, 149, 6, 'Practice & Assessment - Reference Material.pdf', 'course-docs/ielts-writing-intensive/Reference Material.pdf', 'pdf', 988755, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(446, 149, 6, 'Practice & Assessment - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1647187, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(447, 149, 6, 'Practice & Assessment - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 969131, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(448, 150, 6, 'Practice & Assessment - Worksheets.pdf', 'course-docs/ielts-writing-intensive/Worksheets.pdf', 'pdf', 1623342, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(449, 150, 6, 'Practice & Assessment - Summary Sheet.pdf', 'course-docs/ielts-writing-intensive/Summary Sheet.pdf', 'pdf', 336875, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(450, 150, 6, 'Practice & Assessment - Course Guide.pdf', 'course-docs/ielts-writing-intensive/Course Guide.pdf', 'pdf', 1024456, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(451, 151, 7, 'Parts of Speech - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 994854, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(452, 151, 7, 'Parts of Speech - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 2760528, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(453, 151, 7, 'Parts of Speech - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 951630, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(454, 152, 7, 'Parts of Speech - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 1574595, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(455, 152, 7, 'Parts of Speech - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 803452, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(456, 152, 7, 'Parts of Speech - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 324646, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(457, 153, 7, 'Parts of Speech - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 1759080, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(458, 153, 7, 'Parts of Speech - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 451782, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(459, 153, 7, 'Parts of Speech - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 1755627, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(460, 154, 7, 'Parts of Speech - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 1568369, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(461, 154, 7, 'Parts of Speech - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 2082144, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(462, 154, 7, 'Parts of Speech - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 2854464, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(463, 155, 7, 'Parts of Speech - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 1216209, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(464, 155, 7, 'Parts of Speech - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 439254, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(465, 155, 7, 'Parts of Speech - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 2304283, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(466, 156, 7, 'Tenses Mastery - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 2571829, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(467, 156, 7, 'Tenses Mastery - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 2187720, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(468, 156, 7, 'Tenses Mastery - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 1502141, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(469, 157, 7, 'Tenses Mastery - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 2346172, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(470, 157, 7, 'Tenses Mastery - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 2040974, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(471, 157, 7, 'Tenses Mastery - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 960297, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(472, 158, 7, 'Tenses Mastery - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 2676558, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(473, 158, 7, 'Tenses Mastery - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 837611, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(474, 158, 7, 'Tenses Mastery - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 918189, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(475, 159, 7, 'Tenses Mastery - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 767315, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(476, 159, 7, 'Tenses Mastery - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 714174, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(477, 159, 7, 'Tenses Mastery - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 1067110, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(478, 160, 7, 'Tenses Mastery - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 2557780, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(479, 160, 7, 'Tenses Mastery - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 2868589, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(480, 160, 7, 'Tenses Mastery - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 1931546, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(481, 161, 7, 'Sentence Structure - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 2539761, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(482, 161, 7, 'Sentence Structure - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 2706783, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(483, 161, 7, 'Sentence Structure - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 1771125, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(484, 162, 7, 'Sentence Structure - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 2558479, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(485, 162, 7, 'Sentence Structure - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 2290080, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(486, 162, 7, 'Sentence Structure - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 1894525, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(487, 163, 7, 'Sentence Structure - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 1701386, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(488, 163, 7, 'Sentence Structure - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 1553453, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(489, 163, 7, 'Sentence Structure - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 2596741, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(490, 164, 7, 'Sentence Structure - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 234770, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(491, 164, 7, 'Sentence Structure - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 2082824, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(492, 164, 7, 'Sentence Structure - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 1485388, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(493, 165, 7, 'Sentence Structure - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 1198930, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(494, 165, 7, 'Sentence Structure - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 1128320, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(495, 165, 7, 'Sentence Structure - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 1436854, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(496, 166, 7, 'Advanced Grammar - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 865939, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(497, 166, 7, 'Advanced Grammar - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 2765217, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(498, 166, 7, 'Advanced Grammar - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 1722686, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(499, 167, 7, 'Advanced Grammar - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 807609, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(500, 167, 7, 'Advanced Grammar - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 2796145, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(501, 167, 7, 'Advanced Grammar - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 666822, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(502, 168, 7, 'Advanced Grammar - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 2805310, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(503, 168, 7, 'Advanced Grammar - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 1127962, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(504, 168, 7, 'Advanced Grammar - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 854695, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(505, 169, 7, 'Advanced Grammar - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 2371100, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(506, 169, 7, 'Advanced Grammar - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 1781639, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(507, 169, 7, 'Advanced Grammar - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 593350, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(508, 170, 7, 'Advanced Grammar - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 283104, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(509, 170, 7, 'Advanced Grammar - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 829239, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(510, 170, 7, 'Advanced Grammar - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 2110530, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(511, 171, 7, 'Common Errors - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 2630655, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(512, 171, 7, 'Common Errors - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 219236, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(513, 171, 7, 'Common Errors - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 1082099, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(514, 172, 7, 'Common Errors - Study Notes.pdf', 'course-docs/english-grammar-complete/Study Notes.pdf', 'pdf', 1004282, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(515, 172, 7, 'Common Errors - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 2463908, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(516, 172, 7, 'Common Errors - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 804255, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(517, 173, 7, 'Common Errors - Practice Exercises.pdf', 'course-docs/english-grammar-complete/Practice Exercises.pdf', 'pdf', 889006, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(518, 173, 7, 'Common Errors - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 1236097, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(519, 173, 7, 'Common Errors - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 643706, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(520, 174, 7, 'Common Errors - Reference Material.pdf', 'course-docs/english-grammar-complete/Reference Material.pdf', 'pdf', 1548315, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(521, 174, 7, 'Common Errors - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 1970555, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(522, 174, 7, 'Common Errors - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 1340397, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(523, 175, 7, 'Common Errors - Worksheets.pdf', 'course-docs/english-grammar-complete/Worksheets.pdf', 'pdf', 412388, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(524, 175, 7, 'Common Errors - Summary Sheet.pdf', 'course-docs/english-grammar-complete/Summary Sheet.pdf', 'pdf', 1998941, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(525, 175, 7, 'Common Errors - Course Guide.pdf', 'course-docs/english-grammar-complete/Course Guide.pdf', 'pdf', 641262, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(526, 176, 8, 'Presentation Planning - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 2321171, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(527, 176, 8, 'Presentation Planning - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 2027841, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(528, 176, 8, 'Presentation Planning - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1677372, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(529, 177, 8, 'Presentation Planning - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 2733333, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(530, 177, 8, 'Presentation Planning - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1495277, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(531, 177, 8, 'Presentation Planning - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 2753318, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(532, 178, 8, 'Presentation Planning - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 234290, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(533, 178, 8, 'Presentation Planning - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 2802007, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(534, 178, 8, 'Presentation Planning - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 595859, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(535, 179, 8, 'Presentation Planning - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 581188, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(536, 179, 8, 'Presentation Planning - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 1962802, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(537, 179, 8, 'Presentation Planning - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 2806974, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(538, 180, 8, 'Presentation Planning - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 859589, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(539, 180, 8, 'Presentation Planning - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 2245467, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(540, 180, 8, 'Presentation Planning - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 1110769, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(541, 181, 8, 'Slide Design - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 2493459, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(542, 181, 8, 'Slide Design - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 543692, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(543, 181, 8, 'Slide Design - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1692450, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(544, 182, 8, 'Slide Design - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 2972724, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(545, 182, 8, 'Slide Design - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1816957, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(546, 182, 8, 'Slide Design - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 432405, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(547, 183, 8, 'Slide Design - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 237155, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(548, 183, 8, 'Slide Design - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 453975, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(549, 183, 8, 'Slide Design - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 871778, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(550, 184, 8, 'Slide Design - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 1872078, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(551, 184, 8, 'Slide Design - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 1042795, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(552, 184, 8, 'Slide Design - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 2078711, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(553, 185, 8, 'Slide Design - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 2176322, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(554, 185, 8, 'Slide Design - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 1959872, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(555, 185, 8, 'Slide Design - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 2935706, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(556, 186, 8, 'Delivery Techniques - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 1673776, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(557, 186, 8, 'Delivery Techniques - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 2972845, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(558, 186, 8, 'Delivery Techniques - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1211508, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(559, 187, 8, 'Delivery Techniques - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 1123776, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(560, 187, 8, 'Delivery Techniques - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 2234836, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(561, 187, 8, 'Delivery Techniques - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 2485407, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(562, 188, 8, 'Delivery Techniques - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1575273, '2026-04-06 02:56:10', '2026-04-06 02:56:10');
INSERT INTO `course_resources` (`id`, `lesson_id`, `course_id`, `title`, `file_path`, `file_type`, `file_size`, `created_at`, `updated_at`) VALUES
(563, 188, 8, 'Delivery Techniques - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 1522323, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(564, 188, 8, 'Delivery Techniques - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 1230590, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(565, 189, 8, 'Delivery Techniques - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 2363056, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(566, 189, 8, 'Delivery Techniques - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 419542, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(567, 189, 8, 'Delivery Techniques - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 1899885, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(568, 190, 8, 'Delivery Techniques - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 2575671, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(569, 190, 8, 'Delivery Techniques - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 1597636, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(570, 190, 8, 'Delivery Techniques - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 1780127, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(571, 191, 8, 'Engagement Strategies - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 346979, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(572, 191, 8, 'Engagement Strategies - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 1297506, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(573, 191, 8, 'Engagement Strategies - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 879427, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(574, 192, 8, 'Engagement Strategies - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 2226798, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(575, 192, 8, 'Engagement Strategies - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 1741349, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(576, 192, 8, 'Engagement Strategies - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 585046, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(577, 193, 8, 'Engagement Strategies - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 399583, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(578, 193, 8, 'Engagement Strategies - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 352265, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(579, 193, 8, 'Engagement Strategies - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 927423, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(580, 194, 8, 'Engagement Strategies - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 2132208, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(581, 194, 8, 'Engagement Strategies - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 417223, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(582, 194, 8, 'Engagement Strategies - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 989197, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(583, 195, 8, 'Engagement Strategies - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 2303907, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(584, 195, 8, 'Engagement Strategies - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 2195784, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(585, 195, 8, 'Engagement Strategies - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 794248, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(586, 196, 8, 'Q&A & Follow-up - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 1221449, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(587, 196, 8, 'Q&A & Follow-up - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 811786, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(588, 196, 8, 'Q&A & Follow-up - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 535447, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(589, 197, 8, 'Q&A & Follow-up - Study Notes.pdf', 'course-docs/business-presentation-excellence/Study Notes.pdf', 'pdf', 2797020, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(590, 197, 8, 'Q&A & Follow-up - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 252553, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(591, 197, 8, 'Q&A & Follow-up - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 1130952, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(592, 198, 8, 'Q&A & Follow-up - Practice Exercises.pdf', 'course-docs/business-presentation-excellence/Practice Exercises.pdf', 'pdf', 2111200, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(593, 198, 8, 'Q&A & Follow-up - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 1934929, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(594, 198, 8, 'Q&A & Follow-up - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 2091586, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(595, 199, 8, 'Q&A & Follow-up - Reference Material.pdf', 'course-docs/business-presentation-excellence/Reference Material.pdf', 'pdf', 2402145, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(596, 199, 8, 'Q&A & Follow-up - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 351692, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(597, 199, 8, 'Q&A & Follow-up - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 233747, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(598, 200, 8, 'Q&A & Follow-up - Worksheets.pdf', 'course-docs/business-presentation-excellence/Worksheets.pdf', 'pdf', 2171811, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(599, 200, 8, 'Q&A & Follow-up - Summary Sheet.pdf', 'course-docs/business-presentation-excellence/Summary Sheet.pdf', 'pdf', 946503, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(600, 200, 8, 'Q&A & Follow-up - Course Guide.pdf', 'course-docs/business-presentation-excellence/Course Guide.pdf', 'pdf', 1077019, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(601, 201, 9, 'Story Foundations - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 2979112, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(602, 201, 9, 'Story Foundations - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 2504261, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(603, 201, 9, 'Story Foundations - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 1193632, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(604, 202, 9, 'Story Foundations - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 1451287, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(605, 202, 9, 'Story Foundations - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 1250889, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(606, 202, 9, 'Story Foundations - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 2557736, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(607, 203, 9, 'Story Foundations - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 1403122, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(608, 203, 9, 'Story Foundations - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 2286379, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(609, 203, 9, 'Story Foundations - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1225822, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(610, 204, 9, 'Story Foundations - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 513848, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(611, 204, 9, 'Story Foundations - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1969186, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(612, 204, 9, 'Story Foundations - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 2718410, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(613, 205, 9, 'Story Foundations - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 682055, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(614, 205, 9, 'Story Foundations - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 1489547, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(615, 205, 9, 'Story Foundations - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 664398, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(616, 206, 9, 'Character in Short Form - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 269754, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(617, 206, 9, 'Character in Short Form - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 685932, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(618, 206, 9, 'Character in Short Form - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 2946132, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(619, 207, 9, 'Character in Short Form - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 819445, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(620, 207, 9, 'Character in Short Form - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 394599, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(621, 207, 9, 'Character in Short Form - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 660480, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(622, 208, 9, 'Character in Short Form - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 2420232, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(623, 208, 9, 'Character in Short Form - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 2950741, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(624, 208, 9, 'Character in Short Form - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1045565, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(625, 209, 9, 'Character in Short Form - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 1754443, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(626, 209, 9, 'Character in Short Form - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 2633306, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(627, 209, 9, 'Character in Short Form - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 2615567, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(628, 210, 9, 'Character in Short Form - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 681734, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(629, 210, 9, 'Character in Short Form - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 604609, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(630, 210, 9, 'Character in Short Form - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 1358005, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(631, 211, 9, 'Plot in Miniature - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 2369773, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(632, 211, 9, 'Plot in Miniature - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 2235054, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(633, 211, 9, 'Plot in Miniature - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 2977708, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(634, 212, 9, 'Plot in Miniature - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 1913012, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(635, 212, 9, 'Plot in Miniature - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 2833784, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(636, 212, 9, 'Plot in Miniature - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 1543342, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(637, 213, 9, 'Plot in Miniature - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 952747, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(638, 213, 9, 'Plot in Miniature - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 1075078, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(639, 213, 9, 'Plot in Miniature - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 838794, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(640, 214, 9, 'Plot in Miniature - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 684148, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(641, 214, 9, 'Plot in Miniature - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1605597, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(642, 214, 9, 'Plot in Miniature - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 1454284, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(643, 215, 9, 'Plot in Miniature - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 2594676, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(644, 215, 9, 'Plot in Miniature - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 2078486, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(645, 215, 9, 'Plot in Miniature - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 1402761, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(646, 216, 9, 'Style & Voice - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 2814400, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(647, 216, 9, 'Style & Voice - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 269866, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(648, 216, 9, 'Style & Voice - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 1967147, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(649, 217, 9, 'Style & Voice - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 2314201, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(650, 217, 9, 'Style & Voice - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 1891675, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(651, 217, 9, 'Style & Voice - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 1454509, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(652, 218, 9, 'Style & Voice - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 2177110, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(653, 218, 9, 'Style & Voice - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 317227, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(654, 218, 9, 'Style & Voice - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 809709, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(655, 219, 9, 'Style & Voice - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 460600, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(656, 219, 9, 'Style & Voice - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1256775, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(657, 219, 9, 'Style & Voice - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 316140, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(658, 220, 9, 'Style & Voice - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1111754, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(659, 220, 9, 'Style & Voice - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 2756778, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(660, 220, 9, 'Style & Voice - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 1770897, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(661, 221, 9, 'Publication Ready - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 1800992, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(662, 221, 9, 'Publication Ready - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 214054, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(663, 221, 9, 'Publication Ready - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 1964809, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(664, 222, 9, 'Publication Ready - Study Notes.pdf', 'course-docs/short-story-writing/Study Notes.pdf', 'pdf', 2325264, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(665, 222, 9, 'Publication Ready - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 2556686, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(666, 222, 9, 'Publication Ready - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 1638291, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(667, 223, 9, 'Publication Ready - Practice Exercises.pdf', 'course-docs/short-story-writing/Practice Exercises.pdf', 'pdf', 382579, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(668, 223, 9, 'Publication Ready - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 649144, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(669, 223, 9, 'Publication Ready - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1134573, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(670, 224, 9, 'Publication Ready - Reference Material.pdf', 'course-docs/short-story-writing/Reference Material.pdf', 'pdf', 1695821, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(671, 224, 9, 'Publication Ready - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 1541263, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(672, 224, 9, 'Publication Ready - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 439969, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(673, 225, 9, 'Publication Ready - Worksheets.pdf', 'course-docs/short-story-writing/Worksheets.pdf', 'pdf', 2086043, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(674, 225, 9, 'Publication Ready - Summary Sheet.pdf', 'course-docs/short-story-writing/Summary Sheet.pdf', 'pdf', 2369841, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(675, 225, 9, 'Publication Ready - Course Guide.pdf', 'course-docs/short-story-writing/Course Guide.pdf', 'pdf', 2569122, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(676, 226, 10, 'Airport English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 1261909, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(677, 226, 10, 'Airport English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 1662030, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(678, 226, 10, 'Airport English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 1614290, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(679, 227, 10, 'Airport English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 1026538, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(680, 227, 10, 'Airport English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2917316, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(681, 227, 10, 'Airport English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1472870, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(682, 228, 10, 'Airport English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2397524, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(683, 228, 10, 'Airport English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 671084, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(684, 228, 10, 'Airport English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 1382830, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(685, 229, 10, 'Airport English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 2041529, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(686, 229, 10, 'Airport English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 2128827, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(687, 229, 10, 'Airport English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 2786185, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(688, 230, 10, 'Airport English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 422559, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(689, 230, 10, 'Airport English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 2803017, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(690, 230, 10, 'Airport English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 735524, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(691, 231, 10, 'Hotel English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 2028313, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(692, 231, 10, 'Hotel English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2896581, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(693, 231, 10, 'Hotel English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2335924, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(694, 232, 10, 'Hotel English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2774526, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(695, 232, 10, 'Hotel English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2472941, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(696, 232, 10, 'Hotel English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1134892, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(697, 233, 10, 'Hotel English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 1159329, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(698, 233, 10, 'Hotel English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1040756, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(699, 233, 10, 'Hotel English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 1511521, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(700, 234, 10, 'Hotel English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1762156, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(701, 234, 10, 'Hotel English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 683285, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(702, 234, 10, 'Hotel English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 1824916, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(703, 235, 10, 'Hotel English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 416111, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(704, 235, 10, 'Hotel English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 2681835, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(705, 235, 10, 'Hotel English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 1510597, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(706, 236, 10, 'Restaurant English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 1487998, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(707, 236, 10, 'Restaurant English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 717728, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(708, 236, 10, 'Restaurant English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2095691, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(709, 237, 10, 'Restaurant English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2337463, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(710, 237, 10, 'Restaurant English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 837950, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(711, 237, 10, 'Restaurant English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1547936, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(712, 238, 10, 'Restaurant English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2456766, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(713, 238, 10, 'Restaurant English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 994229, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(714, 238, 10, 'Restaurant English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 2324947, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(715, 239, 10, 'Restaurant English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1667307, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(716, 239, 10, 'Restaurant English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 1311545, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(717, 239, 10, 'Restaurant English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 2895761, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(718, 240, 10, 'Restaurant English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 1260534, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(719, 240, 10, 'Restaurant English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 1363249, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(720, 240, 10, 'Restaurant English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 2844125, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(721, 241, 10, 'Tourist English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 2929151, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(722, 241, 10, 'Tourist English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2886383, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(723, 241, 10, 'Tourist English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 1171812, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(724, 242, 10, 'Tourist English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2820594, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(725, 242, 10, 'Tourist English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2117677, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(726, 242, 10, 'Tourist English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 708871, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(727, 243, 10, 'Tourist English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 1897331, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(728, 243, 10, 'Tourist English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1155819, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(729, 243, 10, 'Tourist English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 364161, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(730, 244, 10, 'Tourist English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 790082, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(731, 244, 10, 'Tourist English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 382607, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(732, 244, 10, 'Tourist English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 1923567, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(733, 245, 10, 'Tourist English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 2280496, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(734, 245, 10, 'Tourist English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 431773, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(735, 245, 10, 'Tourist English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 750692, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(736, 246, 10, 'Travel Industry English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 359011, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(737, 246, 10, 'Travel Industry English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2253757, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(738, 246, 10, 'Travel Industry English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2475093, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(739, 247, 10, 'Travel Industry English - Study Notes.pdf', 'course-docs/english-travel-tourism/Study Notes.pdf', 'pdf', 2251870, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(740, 247, 10, 'Travel Industry English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 1293929, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(741, 247, 10, 'Travel Industry English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 1541351, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(742, 248, 10, 'Travel Industry English - Practice Exercises.pdf', 'course-docs/english-travel-tourism/Practice Exercises.pdf', 'pdf', 2316289, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(743, 248, 10, 'Travel Industry English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 206183, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(744, 248, 10, 'Travel Industry English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 1060318, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(745, 249, 10, 'Travel Industry English - Reference Material.pdf', 'course-docs/english-travel-tourism/Reference Material.pdf', 'pdf', 353352, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(746, 249, 10, 'Travel Industry English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 763486, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(747, 249, 10, 'Travel Industry English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 1687017, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(748, 250, 10, 'Travel Industry English - Worksheets.pdf', 'course-docs/english-travel-tourism/Worksheets.pdf', 'pdf', 978776, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(749, 250, 10, 'Travel Industry English - Summary Sheet.pdf', 'course-docs/english-travel-tourism/Summary Sheet.pdf', 'pdf', 463052, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(750, 250, 10, 'Travel Industry English - Course Guide.pdf', 'course-docs/english-travel-tourism/Course Guide.pdf', 'pdf', 1966578, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(751, 257, 20, 'ai_studio_code.html', 'courses/documents/RAxc7ty766PLhN0zfytbHdg8L6VBYg5rj2SGXDak.html', 'document', 12093, '2026-04-06 06:31:45', '2026-04-06 06:31:45'),
(764, 274, 24, 'ai_studio_code.html', 'courses/documents/bD5dQlOGrSvgvnwdVfbi.html', 'document', 12093, '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(765, 275, 24, 'ai_studio_code.html', 'courses/documents/174R6J4pIDMKU4lfPvaV.html', 'document', 12093, '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(766, 276, 25, 'Course Syllabus.pdf', 'courses/documents/syllabus.pdf', 'document', 45000, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(767, 276, 25, 'Welcome Guide.pdf', 'courses/documents/welcome.pdf', 'document', 12000, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(768, 279, 25, 'Cheat Sheet.pdf', 'courses/documents/cheatsheet.pdf', 'document', 25000, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(769, 279, 25, 'Reference Guide.pdf', 'courses/documents/reference.pdf', 'document', 80000, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(770, 279, 25, 'Sample Code.zip', 'courses/documents/sample.zip', 'document', 150000, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(771, 281, 25, 'Advanced Notes.pdf', 'courses/documents/advanced.pdf', 'document', 55000, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(772, 285, 26, 'F1.pdf', 'courses/documents/7SxyQ3lPIPQKq3AjlkHx.pdf', 'document', 16044474, '2026-04-07 01:11:56', '2026-04-07 01:11:56'),
(775, 300, 30, '5_triangle_area_formulas.pdf', 'courses/documents/yQnmo15lKtTZy7fW0ZeR.pdf', 'document', 2398, '2026-04-09 08:51:39', '2026-04-09 08:51:39'),
(776, 301, 31, 'test2-certificate (2).pdf', 'courses/documents/0zDaokCFhCgE4Hh0geqJ.pdf', 'document', 5763273, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(777, 307, 36, 'Uploader\'s Note.txt', 'courses/documents/0anlATJ2lgMvVnsVhB8S.txt', 'document', 685, '2026-04-21 05:58:31', '2026-04-21 05:58:31'),
(778, 308, 37, 'Uploader\'s Note.txt', 'courses/documents/bPRZLkyaGheDKwsC9MZS.txt', 'document', 685, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(779, 308, 37, 'Torrent requirements..txt', 'courses/documents/5syGTeage1tAMBxUgNMf.txt', 'document', 251, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(780, 310, 44, 'Uploader\'s Note.txt', 'courses/documents/LJQR6VVQafhLlk4nu3kC.txt', 'document', 685, '2026-04-23 06:28:05', '2026-04-23 06:28:05');

-- --------------------------------------------------------

--
-- Table structure for table `course_reviews`
--

CREATE TABLE `course_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_reviews`
--

INSERT INTO `course_reviews` (`id`, `course_id`, `user_id`, `user_name`, `user_email`, `rating`, `comment`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 26, NULL, 'Null', 'N@gmail.com', 4, 'svsdvsd', 1, '2026-04-09 05:59:53', '2026-04-09 06:45:43'),
(2, 1, NULL, 'Test User', 'test@example.com', 2, 'Updated via Next.js!', 1, '2026-04-09 06:06:50', '2026-04-09 06:27:54'),
(3, 1, 1, 'Admin User', 'admin@luminabooks.com', 5, 'Incredible depth in the listening module. Band 8 is definitely achievable.', 1, '2026-04-06 04:00:00', '2026-04-06 04:00:00'),
(4, 1, 2, 'John Doe', 'john@example.com', 4, 'Great strategies, though I wish there were more mock tests.', 1, '2026-04-06 04:05:00', '2026-04-06 04:05:00'),
(5, 1, 4, 'HI', 'HW@gmail.com', 5, 'The instructor breaks down complex questions perfectly.', 1, '2026-04-06 04:10:00', '2026-04-06 04:10:00'),
(6, 1, 5, 'Updated Name', 'testuser@test.com', 5, 'Transformed my IELTS score from 6.5 to 8.0 in two months!', 1, '2026-04-06 04:15:00', '2026-04-06 04:15:00'),
(7, 1, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 4, 'Excellent pacing and clear audio examples throughout.', 1, '2026-04-06 04:20:00', '2026-04-06 04:20:00'),
(8, 1, 7, 'Fatima Khan', 'fatima.khan@email.com', 5, 'Worth every penny. The feedback templates alone are gold.', 1, '2026-04-06 04:25:00', '2026-04-06 04:25:00'),
(9, 1, 8, 'Karim Hassan', 'karim.hassan@email.com', 3, 'Good content but could use better video quality.', 1, '2026-04-06 04:30:00', '2026-04-06 04:30:00'),
(10, 1, 9, 'Nadia Islam', 'nadia.islam@email.com', 5, 'Highly structured and easy to follow at my own pace.', 1, '2026-04-06 04:35:00', '2026-04-06 04:35:00'),
(11, 1, 10, 'Tariq Ali', 'tariq.ali@email.com', 4, 'The speaking tips helped me overcome my anxiety completely.', 1, '2026-04-06 04:40:00', '2026-04-06 04:40:00'),
(12, 1, 11, 'Jack', 'J@gmail.com', 5, 'Professional, comprehensive, and results-driven course.', 1, '2026-04-06 04:45:00', '2026-04-06 04:45:00'),
(13, 2, 1, 'Admin User', 'admin@luminabooks.com', 5, 'Perfect for university applicants. Saved me during thesis writing.', 1, '2026-04-06 05:00:00', '2026-04-06 05:00:00'),
(14, 2, 2, 'John Doe', 'john@example.com', 4, 'Detailed APA/MLA guidelines are incredibly helpful.', 1, '2026-04-06 05:05:00', '2026-04-06 05:05:00'),
(15, 2, 4, 'HI', 'HW@gmail.com', 5, 'Finally understood how to structure a literature review!', 1, '2026-04-06 05:10:00', '2026-04-06 05:10:00'),
(16, 2, 5, 'Updated Name', 'testuser@test.com', 5, 'Clear, academic tone that matches university standards.', 1, '2026-04-06 05:15:00', '2026-04-06 05:15:00'),
(17, 2, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 4, 'Great for non-native English speakers entering academia.', 1, '2026-04-06 05:20:00', '2026-04-06 05:20:00'),
(18, 2, 7, 'Fatima Khan', 'fatima.khan@email.com', 5, 'The plagiarism avoidance module is a lifesaver.', 1, '2026-04-06 05:25:00', '2026-04-06 05:25:00'),
(19, 2, 8, 'Karim Hassan', 'karim.hassan@email.com', 4, 'Solid advice on peer review processes and submissions.', 1, '2026-04-06 05:30:00', '2026-04-06 05:30:00'),
(20, 2, 9, 'Nadia Islam', 'nadia.islam@email.com', 5, 'Bridged the gap between high school and college writing.', 1, '2026-04-06 05:35:00', '2026-04-06 05:35:00'),
(21, 2, 10, 'Tariq Ali', 'tariq.ali@email.com', 4, 'I recommend this to all my undergraduate students.', 1, '2026-04-06 05:40:00', '2026-04-06 05:40:00'),
(22, 2, 11, 'Jack', 'J@gmail.com', 5, 'Practical examples make dry academic rules engaging.', 1, '2026-04-06 05:45:00', '2026-04-06 05:45:00'),
(23, 28, NULL, 'Null', 'N@gmail.com', 3, 'Great', 1, '2026-04-15 05:23:28', '2026-04-15 05:23:28'),
(24, 28, NULL, 'John Doe', 'john@example.com', 1, 'csdcsdvdsv', 1, '2026-04-15 05:25:00', '2026-04-16 02:07:53'),
(25, 44, NULL, 'Alex', 'A@gmail.com', 4, 'great', 1, '2026-04-23 07:31:53', '2026-04-23 07:31:53');

-- --------------------------------------------------------

--
-- Table structure for table `course_sections`
--

CREATE TABLE `course_sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `course_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_sections`
--

INSERT INTO `course_sections` (`id`, `course_id`, `title`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Listening Mastery', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(2, 1, 'Reading Excellence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(3, 1, 'Writing Task 1', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(4, 1, 'Writing Task 2', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(5, 1, 'Speaking Confidence', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(6, 2, 'Research Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(7, 2, 'Essay Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(8, 2, 'Research Paper Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(9, 2, 'Citation & Referencing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(10, 2, 'Dissertation Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(11, 3, 'Professional Email Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(12, 3, 'Meeting Communication', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(13, 3, 'Presentation Skills', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(14, 3, 'Negotiation Language', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(15, 3, 'Report Writing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(16, 4, 'Finding Your Voice', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(17, 4, 'Character Development', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(18, 4, 'Plot & Structure', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(19, 4, 'Setting & World Building', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(20, 4, 'Editing & Publishing', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(21, 5, 'Pronunciation Basics', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(22, 5, 'Daily Conversations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(23, 5, 'Social Situations', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(24, 5, 'Professional Speaking', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(25, 5, 'Advanced Fluency', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(26, 6, 'Task 1 Fundamentals', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(27, 6, 'Task 1 Advanced', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(28, 6, 'Task 2 Essay Types', 1, '2026-04-06 02:56:09', '2026-04-06 02:56:09'),
(29, 6, 'Grammar for Writing', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(30, 6, 'Practice & Assessment', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(31, 7, 'Parts of Speech', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(32, 7, 'Tenses Mastery', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(33, 7, 'Sentence Structure', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(34, 7, 'Advanced Grammar', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(35, 7, 'Common Errors', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(36, 8, 'Presentation Planning', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(37, 8, 'Slide Design', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(38, 8, 'Delivery Techniques', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(39, 8, 'Engagement Strategies', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(40, 8, 'Q&A & Follow-up', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(41, 9, 'Story Foundations', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(42, 9, 'Character in Short Form', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(43, 9, 'Plot in Miniature', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(44, 9, 'Style & Voice', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(45, 9, 'Publication Ready', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(46, 10, 'Airport English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(47, 10, 'Hotel English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(48, 10, 'Restaurant English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(49, 10, 'Tourist English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(50, 10, 'Travel Industry English', 1, '2026-04-06 02:56:10', '2026-04-06 02:56:10'),
(51, 14, 'Section 1', 0, '2026-04-06 04:49:32', '2026-04-06 04:49:32'),
(52, 15, 'effe', 0, '2026-04-06 05:20:21', '2026-04-06 05:20:21'),
(53, 16, 'Section 1', 0, '2026-04-06 05:22:05', '2026-04-06 05:22:05'),
(54, 18, 'efefe', 0, '2026-04-06 05:31:35', '2026-04-06 05:31:35'),
(55, 18, 'feefef', 1, '2026-04-06 05:31:35', '2026-04-06 05:31:35'),
(56, 19, 'dvdvdv', 0, '2026-04-06 05:41:31', '2026-04-06 05:41:31'),
(57, 20, 'yyy', 0, '2026-04-06 06:31:45', '2026-04-06 06:31:45'),
(65, 24, 'vrfr', 0, '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(66, 24, 'fvfv', 1, '2026-04-06 07:26:27', '2026-04-06 07:26:27'),
(67, 25, 'Module 1: Introduction', 0, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(68, 25, 'Module 2: Core Concepts', 1, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(69, 25, 'Module 3: Advanced Techniques', 2, '2026-04-06 08:15:56', '2026-04-06 08:15:56'),
(70, 26, 'S1', 0, '2026-04-07 01:11:56', '2026-04-07 01:11:56'),
(71, 26, 'S2', 1, '2026-04-07 01:11:56', '2026-04-07 01:11:56'),
(72, 27, 'HTML Fundamentals', 0, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(73, 27, 'CSS Styling', 1, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(74, 27, 'JavaScript Fundamentals', 2, '2026-04-07 08:51:09', '2026-04-07 08:51:09'),
(75, 28, 'S1', 0, '2026-04-07 10:30:04', '2026-04-07 10:30:04'),
(76, 28, 'aaaaaaaa', 1, '2026-04-07 10:47:06', '2026-04-07 10:47:06'),
(77, 29, 'bfbfbfbfbf', 0, '2026-04-09 07:35:28', '2026-04-09 07:35:28'),
(78, 30, 'efwefewf', 0, '2026-04-09 08:51:39', '2026-04-09 08:51:39'),
(79, 31, 'asddddddd', 0, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(80, 31, 'dsfdsfds', 1, '2026-04-18 10:08:06', '2026-04-18 10:08:06'),
(81, 32, 'cddvdv', 0, '2026-04-18 10:12:00', '2026-04-18 10:12:00'),
(82, 33, 'zxczxcz', 0, '2026-04-20 11:16:14', '2026-04-20 11:16:14'),
(83, 34, 'cddcdc', 0, '2026-04-20 11:20:19', '2026-04-20 11:20:19'),
(84, 36, 'z', 0, '2026-04-21 05:58:31', '2026-04-21 05:58:31'),
(85, 37, '2e2', 0, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(86, 37, '2e2e2e', 1, '2026-04-21 10:17:40', '2026-04-21 10:17:40'),
(87, 44, 'efef', 0, '2026-04-23 06:28:05', '2026-04-23 06:28:05'),
(88, 45, 'fsf', 0, '2026-04-27 10:49:59', '2026-04-27 10:49:59');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_photos`
--

CREATE TABLE `gallery_photos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gallery_photos`
--

INSERT INTO `gallery_photos` (`id`, `title`, `description`, `date`, `image_path`, `order`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 'DDDDDDDD', 'DDDDDDDDD', NULL, 'gallery/mrLVPpx4bhsAf9ufz5X3fJpAhsUoXwE5bTMNGHEy.jpg', 5, 1, '2026-04-18 08:41:02', '2026-04-19 11:02:57'),
(5, 'xaxaxdvdv', 'AXAx', NULL, 'gallery/12bEULi5jYbCaEz019s0AT4JkUD60meXSoXLc3x4.png', 10, 1, '2026-04-18 08:42:18', '2026-04-18 08:42:18'),
(7, 'wfddsff', 'sfsafsdf', '2020-12-28', 'gallery/69e50fbf093dc_1776619455.png', 1, 1, '2026-04-19 11:24:15', '2026-04-19 11:32:01');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_01_164645_create_personal_access_tokens_table', 1),
(5, '2026_04_01_164801_create_categories_table', 1),
(6, '2026_04_01_164802_create_books_table', 1),
(7, '2026_04_01_164805_create_orders_table', 1),
(8, '2026_04_01_164806_create_order_items_table', 1),
(9, '2026_04_01_172453_create_reviews_table', 1),
(10, '2026_04_01_172454_create_questions_table', 1),
(11, '2026_04_01_174942_create_wishlists_table', 2),
(12, '2026_04_02_054858_add_avatar_to_users_table', 3),
(13, '2026_04_02_060518_create_about_pages_table', 4),
(14, '2026_04_02_065040_add_preview_content_to_books_table', 5),
(15, '2026_04_02_070139_add_preview_images_to_books_table', 6),
(16, '2026_04_02_072138_add_status_to_books_table', 7),
(17, '2026_04_03_043020_update_book_statuses_to_draft_or_approved', 8),
(18, '2026_04_03_000000_add_indexes_to_books_table', 9),
(19, '2026_04_03_000001_add_indexes_to_questions_table', 9),
(20, '2026_04_05_095532_create_courses_table', 9),
(21, '2026_04_05_100953_add_preview_video_to_courses_table', 10),
(22, '2026_04_05_112021_add_documents_and_quiz_to_courses_table', 11),
(23, '2026_04_05_131354_add_lesson_structure_to_courses_table', 12),
(24, '2026_04_06_053346_add_type_to_categories_table', 13),
(25, '2026_04_06_083714_add_type_to_course_lessons_table', 14),
(26, '2026_04_06_085014_add_course_id_to_order_items_table', 15),
(27, '2026_04_06_085507_make_book_id_nullable_in_order_items', 16),
(28, '2026_04_06_100322_add_lesson_id_to_course_quizzes_table', 17),
(29, '2026_04_06_104825_remove_conflicting_columns_from_courses_table', 18),
(30, '2026_04_08_150409_create_gallery_photos_table', 19),
(31, '2026_04_09_050942_create_course_reviews_table', 20),
(32, '2026_04_09_050947_create_course_questions_table', 20),
(33, '2026_04_11_060422_add_payment_fields_to_orders_table', 21),
(34, '2026_04_11_061559_create_site_settings_table', 22),
(35, '2026_04_11_062115_add_discount_and_cod_charge_to_orders', 23),
(36, '2026_04_11_074453_add_city_and_zip_to_users', 24),
(37, '2026_04_11_000000_add_order_number_to_orders_table', 25),
(38, '2026_04_11_000001_add_isbn_and_tra_to_order_items_table', 26),
(39, '2026_04_11_000002_add_tracking_number_to_orders_table', 27),
(40, '2026_04_11_000003_create_course_levels_table', 28),
(42, '2026_04_15_103712_add_average_rating_to_books_table', 29),
(43, '2026_04_15_143306_create_course_progress_table', 30),
(44, '2026_04_19_072706_create_cart_items_table', 30),
(45, '2026_04_19_115601_add_watched_and_video_seconds_to_course_progress_table', 30),
(46, '2026_04_19_000000_add_stock_threshold_to_books_table', 31),
(47, '2026_04_20_000001_create_promo_codes_table', 32),
(48, '2026_04_20_000002_create_promo_code_usages_table', 32),
(49, '2026_04_19_172739_add_date_to_gallery_photos_table', 33),
(50, '2026_04_21_000000_add_status_to_courses_table', 34),
(51, '2026_04_21_000000_add_format_to_books_table', 35),
(52, '2026_04_21_000001_add_language_access_to_courses_table', 36);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(50) DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `tracking_number` varchar(100) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_mobile` varchar(20) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `cod_charge` decimal(10,2) DEFAULT 0.00,
  `shipping_address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `total`, `status`, `tracking_number`, `payment_method`, `payment_mobile`, `transaction_id`, `discount_amount`, `cod_charge`, `shipping_address`, `city`, `state`, `postal_code`, `phone`, `notes`, `created_at`, `updated_at`) VALUES
(1, NULL, 2, 135.96, 'delivered', NULL, 'paypal', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-16 10:57:14', '2026-04-02 10:57:14'),
(2, NULL, 2, 52.97, 'shipped', NULL, 'card', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-04-01 10:57:14', '2026-04-02 10:57:14'),
(3, NULL, 2, 151.91, 'pending', NULL, 'paypal', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-06 10:57:14', '2026-04-02 10:57:14'),
(4, NULL, 2, 57.96, 'processing', NULL, 'cod', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-27 10:57:14', '2026-04-02 10:57:14'),
(5, NULL, 2, 746.97, 'processing', NULL, 'paypal', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-10 10:57:14', '2026-04-02 10:57:14'),
(6, NULL, 2, 102.95, 'delivered', NULL, 'cod', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-28 10:57:14', '2026-04-02 10:57:14'),
(7, NULL, 2, 80.95, 'delivered', NULL, 'cod', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-08 10:57:14', '2026-04-02 10:57:14'),
(8, NULL, 2, 257.92, 'delivered', NULL, 'card', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-07 10:57:14', '2026-04-02 10:57:14'),
(9, NULL, 2, 159.96, 'pending', NULL, 'paypal', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-10 11:46:15', '2026-04-02 11:46:15'),
(10, NULL, 4, 160.90, 'delivered', NULL, 'card', NULL, NULL, 0.00, 0.00, '123 Example St', 'Sample City', NULL, NULL, '+10000000000', 'Seeded order', '2026-03-06 11:46:15', '2026-04-02 11:46:15'),
(11, NULL, 4, 56.97, 'delivered', NULL, 'paypal', NULL, NULL, 0.00, 0.00, '123 Example St', 'Sample City', NULL, NULL, '+10000000000', 'Seeded order', '2026-03-15 11:46:15', '2026-04-02 11:46:15'),
(12, NULL, 4, 129.92, 'pending', NULL, 'cod', NULL, NULL, 0.00, 0.00, '123 Example St', 'Sample City', NULL, NULL, '+10000000000', 'Seeded order', '2026-03-21 11:46:15', '2026-04-02 11:46:15'),
(13, NULL, 4, 140.95, 'delivered', NULL, 'paypal', NULL, NULL, 0.00, 0.00, '123 Example St', 'Sample City', NULL, NULL, '+10000000000', 'Seeded order', '2026-03-15 11:46:15', '2026-04-02 11:46:15'),
(14, NULL, 4, 68.97, 'delivered', NULL, 'cod', NULL, NULL, 0.00, 0.00, '123 Example St', 'Sample City', NULL, NULL, '+10000000000', 'Seeded order', '2026-03-03 11:46:15', '2026-04-02 11:46:15'),
(15, NULL, 2, 35.97, 'pending', NULL, 'cod', NULL, NULL, 0.00, 0.00, '123 Main St, New York, NY', 'Sample City', NULL, NULL, '+1987654321', 'Seeded order', '2026-03-21 11:46:15', '2026-04-02 11:46:15'),
(16, NULL, 4, 92.96, 'pending', NULL, 'card', NULL, NULL, 0.00, 0.00, '123 Example St', 'Sample City', NULL, NULL, '+10000000000', 'Seeded order', '2026-03-30 11:46:15', '2026-04-02 11:46:15'),
(17, NULL, 7, 29.99, 'shipped', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Fatima Khan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801306074049', NULL, '2026-04-06 02:50:10', '2026-04-06 02:50:10'),
(18, NULL, 7, 59.99, 'shipped', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'Fatima Khan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801974329194', NULL, '2026-04-06 02:51:55', '2026-04-06 02:51:55'),
(19, NULL, 9, 34.99, 'shipped', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'Nadia Islam, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801528664585', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(20, NULL, 6, 49.99, 'delivered', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Rahim Ahmed, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801875753208', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(21, NULL, 10, 54.99, 'processing', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'Tariq Ali, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801792736234', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(22, NULL, 9, 29.99, 'pending', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'Nadia Islam, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801399615282', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(23, NULL, 9, 29.99, 'shipped', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Nadia Islam, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801307254965', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(24, NULL, 10, 34.99, 'shipped', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Tariq Ali, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801775398988', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(25, NULL, 10, 49.99, 'pending', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Tariq Ali, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801827746011', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(26, NULL, 8, 69.99, 'processing', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Karim Hassan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801552914221', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(27, NULL, 6, 29.99, 'shipped', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Rahim Ahmed, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801961973293', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(28, NULL, 7, 59.99, 'processing', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Fatima Khan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801647170199', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(29, NULL, 8, 45.99, 'pending', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Karim Hassan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801763313080', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(30, NULL, 6, 49.99, 'shipped', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Rahim Ahmed, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801294778285', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(31, NULL, 8, 29.99, 'pending', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Karim Hassan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801611466802', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(32, NULL, 6, 54.99, 'delivered', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Rahim Ahmed, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801840507879', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(33, NULL, 10, 45.99, 'pending', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Tariq Ali, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801356791223', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(34, NULL, 7, 29.99, 'pending', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'Fatima Khan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801726705986', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(35, NULL, 8, 49.99, 'delivered', NULL, 'stripe', NULL, NULL, 0.00, 0.00, 'Karim Hassan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801871544197', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(36, NULL, 7, 29.99, 'processing', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Fatima Khan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801139213363', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(37, NULL, 6, 59.99, 'pending', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Rahim Ahmed, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801478582632', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(38, NULL, 8, 54.99, 'processing', NULL, 'bkash', NULL, NULL, 0.00, 0.00, 'Karim Hassan, Dhaka, Bangladesh', 'Dhaka', NULL, '1200', '+8801961916023', NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(39, NULL, 2, 189.97, 'completed', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'N/A - Course Only', 'N/A', NULL, NULL, '+1987654321', 'Course enrollment order', '2026-04-09 00:12:46', '2026-04-09 00:12:46'),
(40, NULL, 2, 189.97, 'completed', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'N/A - Course Only', 'N/A', NULL, NULL, '+1987654321', 'Course enrollment order', '2026-04-09 00:13:28', '2026-04-09 00:13:28'),
(45, NULL, 12, 55.00, 'completed', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'N/A - Course Enrollment', 'N/A', NULL, NULL, '0000000000', NULL, '2026-04-09 03:38:02', '2026-04-09 03:38:02'),
(46, NULL, 2, 55.00, 'completed', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'N/A - Course Enrollment', 'N/A', NULL, NULL, '0000000000', NULL, '2026-04-09 07:30:19', '2026-04-09 07:30:19'),
(47, NULL, 13, 55.00, 'completed', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'N/A - Course Enrollment', 'N/A', NULL, NULL, '0000000000', NULL, '2026-04-09 08:37:42', '2026-04-09 08:37:42'),
(48, NULL, 1, 100.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 0.00, 'test', 'test', NULL, '123', '01712345678', NULL, '2026-04-11 01:32:49', '2026-04-11 01:32:49'),
(49, NULL, 2, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'cac', 'cdc', NULL, 'scs', '23454325435', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 01:36:44', '2026-04-11 01:36:44'),
(50, NULL, 2, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'sdfsdfsdf', 'sdfdsf', NULL, 'sdfdsf', '32423423432', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 01:37:37', '2026-04-11 01:37:37'),
(51, NULL, 2, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'sdvsvdsv', 'sdvdsv', NULL, 'dsvdsv', '23423423423', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 01:40:27', '2026-04-11 01:40:27'),
(52, NULL, 2, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, '123 Main St, New York, NY', 'dfsdfsdfs', NULL, 'dfsdf', '35434534534', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 01:47:16', '2026-04-11 01:47:16'),
(53, NULL, 13, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'sdasd', 'asdadad', NULL, 'dsadads', '54353453543', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 03:52:45', '2026-04-11 03:52:45'),
(54, 'ORD-7E2XUGLFW3', 13, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'ffdfsvv', 'vfvf', NULL, 'fvfvfv', '23423423432', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 03:59:40', '2026-04-11 03:59:40'),
(55, 'ORD-45BXZOGVFU', 13, 4234.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'ffdfsvv', 'vfvf', NULL, 'fvfvfv', '23423423432', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 04:05:37', '2026-04-11 04:05:37'),
(56, 'ORD-CGOV0LD2UA', 13, 13.99, 'processing', 'TRK-QU1VTVZHAX', 'cod', NULL, NULL, 0.00, 111.00, 'ffdfsvv', 'vfvf', NULL, 'fvfvfv', '23423423432', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 04:23:08', '2026-04-11 05:38:09'),
(57, 'ORD-G3PIUDNRT9', 13, 21170.00, 'processing', 'TRK-B11794F2JF', 'cod', NULL, NULL, 0.00, 111.00, 'ffdfsvv', 'vfvf', NULL, 'fvfvfv', '23423423432', 'Discount: ৳0.00, COD Charge: ৳111.00', '2026-04-11 05:53:12', '2026-04-11 05:58:34'),
(58, 'ORD-KPX4RASEOD', 2, 4292.98, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, '123 Main St, New York, NY', 'dfsdfsdfs', NULL, 'dfsdfsdf', '35434534534', NULL, '2026-04-12 04:20:58', '2026-04-12 04:20:58'),
(59, 'ORD-P7M0EFUKBH', 12, 99.00, 'processing', 'TRK-H84Z5ZKMZ9', 'cod', NULL, NULL, 0.00, 111.00, '34534534543ferg', 'sdvsdv', NULL, 'sdvsdv', '34534534534', NULL, '2026-04-12 04:56:32', '2026-04-17 03:19:01'),
(60, 'ORD-08FDZJK9XL', 2, 32423.00, 'delivered', 'TRK-RF9ZLEUOJI', 'nagad', '24333333', '24234234', 324.23, 0.00, '123 Main St, New York, NY', 'dfsdfsdfs', NULL, 'dfsdfsdf', '35434534534', NULL, '2026-04-15 04:12:05', '2026-04-15 04:19:29'),
(61, 'ORD-F1GVQ2PE79', 12, 32423.00, 'delivered', 'TRK-26KEKE5OOZ', 'cod', NULL, NULL, 0.00, 111.00, '34534534543ferg', 'sdvsdv', NULL, 'sdvsdv', '34534534534', NULL, '2026-04-15 04:33:17', '2026-04-15 04:34:10'),
(62, 'ORD-MPYJ14BKI2', 12, 5.00, 'completed', NULL, 'bkash', '2433333333333', '234e23r23r3', 0.05, 0.00, 'N/A', 'N/A', NULL, NULL, '34534534534', NULL, '2026-04-15 04:58:48', '2026-04-15 04:58:48'),
(63, 'ORD-ZD1R3UC2S8', 2, 5.00, 'completed', 'TRK-1I6MRY0QXA', 'bkash', '3423532rwe', 'ewrwerwer', 0.05, 0.00, 'N/A', 'N/A', NULL, NULL, '35434534534', NULL, '2026-04-15 05:24:39', '2026-04-17 04:39:13'),
(64, 'ORD-XW061GOQDJ', 25, 132740.99, 'delivered', 'TRK-0CX8OOZF0C', 'cod', NULL, NULL, 0.00, 111.00, 'vwegwegweg', 'bfdbdberberb', NULL, 'dfbveberberb', '45333333333', NULL, '2026-04-18 06:35:57', '2026-04-18 08:47:19'),
(65, 'ORD-9XOVBK3C6Y', 25, 55.00, 'pending', 'TRK-7L92PGG5QE', 'bkash', '324234235325egerg', 'gbfbg', 0.55, 0.00, 'N/A', 'N/A', NULL, NULL, '45333333333', NULL, '2026-04-18 06:51:21', '2026-04-18 08:44:06'),
(66, 'ORD-Z48X3HWQ6D', 13, 114880.00, 'pending', NULL, 'cod', NULL, NULL, 0.00, 111.00, 'ffdfsvv111111', 'vfvf', NULL, 'fvfvfv', '23423423432', NULL, '2026-04-19 04:13:17', '2026-04-19 04:13:17'),
(67, 'ORD-UKMBE9VG60', 13, 70345.00, 'pending', NULL, 'bkash', '23423423458', '34t34t3', 703.45, 0.00, 'ffdfsvv111111', 'vfvf', NULL, 'fvfvfv', '23423423432', NULL, '2026-04-19 04:45:37', '2026-04-19 04:45:37'),
(68, 'ORD-2QEJTI4CHD', 26, 45454.00, 'completed', NULL, 'bkash', '24323423423', 'wfqegweg', 454.54, 0.00, 'N/A', 'N/A', NULL, NULL, '24323423423', NULL, '2026-04-19 06:20:27', '2026-04-19 06:20:27'),
(69, 'ORD-1NFWV9Z8C6', 13, 347130.00, 'shipped', 'TRK-FVH5T6S5WU', 'cod', NULL, NULL, 0.00, 111.00, 'ffdfsvv111111', 'vfvf', NULL, 'fvfvfv', '23423423432', NULL, '2026-04-19 08:54:12', '2026-04-20 06:10:43'),
(70, 'ORD-DSUGVFOBK5', 2, 3133.00, 'delivered', 'TRK-2H16ZSSVSA', 'bkash', '35434534534', 'ascac', 30.70, 0.00, '123 Main St, New York, NY', 'dfsdfsdfs', NULL, 'dfsdfsdf', '35434534534', NULL, '2026-04-20 02:10:10', '2026-04-20 03:43:53'),
(71, 'ORD-BX9704R8Q1', 27, 38.49, 'delivered', 'TRK-68O688A3TL', 'bkash', '34534534534', '3253434r3r34t', 0.38, 0.00, 'fefwfwf', 'wfwefwef', NULL, 'wfwfwef', '34534534534', NULL, '2026-04-23 03:49:20', '2026-04-23 04:18:53'),
(72, 'ORD-LZ3TVM69FJ', 13, 311.00, 'delivered', 'TRK-K5LI8OYMB6', 'bkash', '23423423432', 'ewfwefwefewf', 3.05, 0.00, 'ffdfsvv111111', 'vfvf', NULL, 'fvfvfv', '23423423432', NULL, '2026-04-23 07:22:52', '2026-04-23 07:30:03');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED DEFAULT NULL,
  `course_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `tra_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `course_id`, `quantity`, `price`, `isbn`, `tra_number`, `created_at`, `updated_at`) VALUES
(1, 1, 7, NULL, 2, 44.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(2, 1, 9, NULL, 2, 22.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(3, 2, 12, NULL, 1, 17.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(4, 2, 14, NULL, 1, 13.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(9, 3, 24, NULL, 3, 11.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(10, 4, 1, NULL, 1, 12.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(11, 4, 15, NULL, 3, 14.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(12, 5, 2, NULL, 3, 14.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(13, 5, 19, NULL, 1, 234.00, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(14, 5, 23, NULL, 2, 234.00, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(15, 6, 10, NULL, 2, 19.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(17, 7, 11, NULL, 3, 16.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(18, 7, 15, NULL, 2, 14.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(19, 8, 2, NULL, 1, 14.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(20, 8, 6, NULL, 2, 39.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(21, 8, 7, NULL, 3, 44.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(22, 8, 14, NULL, 2, 13.99, NULL, NULL, '2026-04-02 10:57:14', '2026-04-02 10:57:14'),
(23, 9, 8, NULL, 2, 42.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(24, 9, 36, NULL, 2, 36.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(25, 10, 2, NULL, 3, 14.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(27, 10, 26, NULL, 2, 11.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(30, 11, 51, NULL, 2, 17.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(31, 12, 12, NULL, 3, 17.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(32, 12, 15, NULL, 2, 14.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(33, 12, 24, NULL, 2, 11.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(34, 12, 42, NULL, 1, 21.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(36, 13, 7, NULL, 2, 44.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(37, 14, 9, NULL, 3, 22.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(38, 15, 26, NULL, 3, 11.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(39, 16, 2, NULL, 1, 14.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(40, 16, 37, NULL, 2, 29.99, NULL, NULL, '2026-04-02 11:46:15', '2026-04-02 11:46:15'),
(42, 19, NULL, 7, 1, 34.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(43, 20, NULL, 4, 1, 49.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(44, 21, NULL, 8, 1, 54.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(45, 22, NULL, 9, 1, 29.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(46, 23, NULL, 9, 1, 29.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(47, 24, NULL, 7, 1, 34.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(48, 25, NULL, 4, 1, 49.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(49, 26, NULL, 3, 1, 69.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(50, 27, NULL, 9, 1, 29.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(51, 28, NULL, 2, 1, 59.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(52, 29, NULL, 6, 1, 45.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(53, 30, NULL, 4, 1, 49.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(54, 31, NULL, 9, 1, 29.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(55, 32, NULL, 8, 1, 54.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(56, 33, NULL, 6, 1, 45.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(57, 34, NULL, 9, 1, 29.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(58, 35, NULL, 4, 1, 49.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(59, 36, NULL, 9, 1, 29.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(60, 37, NULL, 2, 1, 59.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(61, 38, NULL, 8, 1, 54.99, NULL, NULL, '2026-04-06 02:56:11', '2026-04-06 02:56:11'),
(62, 39, NULL, 1, 1, 79.99, NULL, NULL, '2026-04-09 00:12:46', '2026-04-09 00:12:46'),
(63, 39, NULL, 2, 1, 59.99, NULL, NULL, '2026-04-09 00:12:46', '2026-04-09 00:12:46'),
(64, 39, NULL, 4, 1, 49.99, NULL, NULL, '2026-04-09 00:12:46', '2026-04-09 00:12:46'),
(65, 40, NULL, 1, 1, 79.99, NULL, NULL, '2026-04-09 00:13:28', '2026-04-09 00:13:28'),
(66, 40, NULL, 2, 1, 59.99, NULL, NULL, '2026-04-09 00:13:28', '2026-04-09 00:13:28'),
(67, 40, NULL, 4, 1, 49.99, NULL, NULL, '2026-04-09 00:13:28', '2026-04-09 00:13:28'),
(72, 45, NULL, 26, 1, 55.00, NULL, NULL, '2026-04-09 03:38:02', '2026-04-09 03:38:02'),
(73, 46, NULL, 26, 1, 55.00, NULL, NULL, '2026-04-09 07:30:19', '2026-04-09 07:30:19'),
(74, 47, NULL, 26, 1, 55.00, NULL, NULL, '2026-04-09 08:37:42', '2026-04-09 08:37:42'),
(75, 48, 1, NULL, 1, 100.00, NULL, NULL, '2026-04-11 01:32:49', '2026-04-11 01:32:49'),
(76, 49, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 01:36:44', '2026-04-11 01:36:44'),
(77, 50, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 01:37:37', '2026-04-11 01:37:37'),
(78, 51, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 01:40:27', '2026-04-11 01:40:27'),
(79, 52, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 01:47:16', '2026-04-11 01:47:16'),
(80, 53, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 03:52:45', '2026-04-11 03:52:45'),
(81, 54, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 03:59:40', '2026-04-11 03:59:40'),
(82, 55, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-11 04:05:37', '2026-04-11 04:05:37'),
(83, 56, 25, NULL, 1, 13.99, '34534534535', NULL, '2026-04-11 04:23:08', '2026-04-11 05:37:27'),
(84, 57, 79, NULL, 5, 4234.00, '35345346456', NULL, '2026-04-11 05:53:12', '2026-04-11 05:58:34'),
(86, 58, 79, NULL, 1, 4234.00, NULL, NULL, '2026-04-12 04:20:58', '2026-04-12 04:20:58'),
(87, 58, 25, NULL, 1, 13.99, NULL, NULL, '2026-04-12 04:20:58', '2026-04-12 04:20:58'),
(88, 58, 26, NULL, 1, 11.99, NULL, NULL, '2026-04-12 04:20:58', '2026-04-12 04:20:58'),
(90, 60, 97, NULL, 1, 32423.00, '2434243234234', NULL, '2026-04-15 04:12:05', '2026-04-15 04:13:12'),
(91, 61, 97, NULL, 1, 32423.00, '2342352353245', NULL, '2026-04-15 04:33:17', '2026-04-15 04:34:08'),
(92, 62, NULL, 28, 1, 5.00, NULL, NULL, '2026-04-15 04:58:48', '2026-04-15 04:58:48'),
(93, 63, NULL, 28, 1, 5.00, '524tt', NULL, '2026-04-15 05:24:39', '2026-04-17 04:39:24'),
(94, 64, 97, NULL, 4, 32423.00, '7658765t678t68', NULL, '2026-04-18 06:35:57', '2026-04-18 08:47:08'),
(95, 64, NULL, 4, 1, 49.99, '8o7y8y87y', NULL, '2026-04-18 06:35:57', '2026-04-18 08:47:12'),
(96, 64, NULL, 27, 1, 2999.00, '9y7uy8y', NULL, '2026-04-18 06:35:57', '2026-04-18 08:47:16'),
(97, 65, NULL, 26, 1, 55.00, '89y9y7', NULL, '2026-04-18 06:51:21', '2026-04-18 08:45:16'),
(98, 66, NULL, 31, 1, 45454.00, NULL, NULL, '2026-04-19 04:13:17', '2026-04-19 04:13:17'),
(99, 66, 96, NULL, 3, 23142.00, NULL, NULL, '2026-04-19 04:13:17', '2026-04-19 04:13:17'),
(100, 67, 97, NULL, 2, 32423.00, NULL, NULL, '2026-04-19 04:45:37', '2026-04-19 04:45:37'),
(101, 67, 91, NULL, 2, 1250.00, NULL, NULL, '2026-04-19 04:45:37', '2026-04-19 04:45:37'),
(102, 67, NULL, 27, 1, 2999.00, NULL, NULL, '2026-04-19 04:45:37', '2026-04-19 04:45:37'),
(103, 68, NULL, 31, 1, 45454.00, NULL, NULL, '2026-04-19 06:20:27', '2026-04-19 06:20:27'),
(104, 69, 96, NULL, 15, 23142.00, '34253t434t', NULL, '2026-04-19 08:54:12', '2026-04-20 06:10:24'),
(105, 70, NULL, 29, 1, 0.00, NULL, NULL, '2026-04-20 02:10:10', '2026-04-20 02:10:10'),
(106, 70, 101, NULL, 2, 67.00, '2314321443221', NULL, '2026-04-20 02:10:10', '2026-04-20 03:43:49'),
(107, 70, NULL, 27, 1, 2999.00, NULL, NULL, '2026-04-20 02:10:10', '2026-04-20 02:10:10'),
(108, 71, 20, NULL, 1, 13.50, '3452rt3t54t54t', NULL, '2026-04-23 03:49:20', '2026-04-23 04:14:48'),
(110, 71, NULL, 28, 1, 5.00, NULL, NULL, '2026-04-23 03:49:20', '2026-04-23 03:49:20'),
(111, 71, 112, NULL, 1, 1.00, 'rg5g4545y4', NULL, '2026-04-23 03:49:20', '2026-04-23 04:14:59'),
(112, 72, 110, NULL, 1, 33.00, '3t443t43t34t', NULL, '2026-04-23 07:22:52', '2026-04-23 07:26:19'),
(113, 72, 113, NULL, 1, 234.00, '34t34t34t34t', NULL, '2026-04-23 07:22:52', '2026-04-23 07:26:23'),
(114, 72, NULL, 44, 1, 44.00, NULL, NULL, '2026-04-23 07:22:52', '2026-04-23 07:22:52');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth-token', 'a86c3666fff17d7999d3362e1eb6d53a1d380761d57859e34ec6a29f8488c0cd', '[\"*\"]', '2026-04-01 11:56:54', NULL, '2026-04-01 11:40:25', '2026-04-01 11:56:54'),
(2, 'App\\Models\\User', 2, 'auth-token', '005a2852f0a0d87cb0ce40d432bccc263d87000871327f70069fcfe11ee647de', '[\"*\"]', '2026-04-01 11:58:17', NULL, '2026-04-01 11:58:08', '2026-04-01 11:58:17'),
(3, 'App\\Models\\User', 2, 'auth-token', 'f5910264d0259379a891999d8902e145224eebc8f28a395b1ec875f5ba0409af', '[\"*\"]', '2026-04-01 12:05:34', NULL, '2026-04-01 12:04:11', '2026-04-01 12:05:34'),
(4, 'App\\Models\\User', 2, 'auth-token', 'ffd1f45135b88130dfa207dea67d5cd27d04f2ac7649fdf96b4f14b17f161861', '[\"*\"]', '2026-04-01 12:39:55', NULL, '2026-04-01 12:12:07', '2026-04-01 12:39:55'),
(5, 'App\\Models\\User', 2, 'auth-token', '09dddde2bcf8748f463a782e0591d6f92d815ef691e400e001504624fcee5d04', '[\"*\"]', '2026-04-01 12:37:13', NULL, '2026-04-01 12:37:06', '2026-04-01 12:37:13'),
(30, 'App\\Models\\User', 2, 'auth-token', '68a6634520222ac8852edc053cc6a4208fb1c3fded93662d3d9404d41162866e', '[\"*\"]', '2026-04-02 11:47:56', NULL, '2026-04-02 11:38:35', '2026-04-02 11:47:56'),
(32, 'App\\Models\\User', 5, 'auth-token', 'b1f7bb5a4ec9279d4f51879063718f7d96d170a3b09a18fbc365e22dcca21689', '[\"*\"]', '2026-04-02 12:15:43', NULL, '2026-04-02 12:13:39', '2026-04-02 12:15:43'),
(33, 'App\\Models\\User', 1, 'auth-token', '9b93ec032368eddafe4787f63dd9a3f40f1d23ef59fd36266352c03b00c09b1d', '[\"*\"]', '2026-04-02 12:16:53', NULL, '2026-04-02 12:15:56', '2026-04-02 12:16:53'),
(37, 'App\\Models\\User', 1, 'auth-token', 'a5cdfba5ac5ce7988e33d4c575c2fefbfd9f042bf134547174743c7f85cb1a4c', '[\"*\"]', '2026-04-03 02:47:17', NULL, '2026-04-02 23:36:57', '2026-04-03 02:47:17'),
(62, 'App\\Models\\User', 1, 'auth-token', '94f56f99f7be6f9590283f2f5efc3683c2392efac5567fc8d3cb51596501060a', '[\"*\"]', '2026-04-07 01:22:04', NULL, '2026-04-06 04:46:49', '2026-04-07 01:22:04'),
(64, 'App\\Models\\User', 2, 'auth-token', 'c237175f5d51c2b4515973401342b8fe404aa264e75495116a4827d5bff4c830', '[\"*\"]', '2026-04-08 05:01:16', NULL, '2026-04-08 04:57:33', '2026-04-08 05:01:16'),
(87, 'App\\Models\\User', 12, 'auth-token', '9f319da166a6988abdb2e3194c48f8bcb49af53f8561ee6ebc5cdc09958b84aa', '[\"*\"]', '2026-04-09 04:58:02', NULL, '2026-04-09 04:22:30', '2026-04-09 04:58:02'),
(97, 'App\\Models\\User', 1, 'auth-token', '38c3bc7f3d7f35204fbab938dd64577566d8346362b87e349527dc7c51d00a80', '[\"*\"]', '2026-04-09 09:31:13', NULL, '2026-04-09 08:43:27', '2026-04-09 09:31:13'),
(103, 'App\\Models\\User', 1, 'test', '9b18818f11f095a4c963676943cfb3df5d11b37f45565ea205ea87424144cc0e', '[\"*\"]', '2026-04-11 01:49:04', NULL, '2026-04-11 00:38:49', '2026-04-11 01:49:04'),
(107, 'App\\Models\\User', 14, 'auth-token', '00062ec1b44b6c1806fe7f0bf27e36fc2c06ac0a2026ff9297a4101234dc0a41', '[\"*\"]', NULL, NULL, '2026-04-11 01:24:51', '2026-04-11 01:24:51'),
(118, 'App\\Models\\User', 2, 'auth-token', 'c39f43a309ffcc43c604f15f39caca4c043dfbf2e1e8a59021e4ba9b9a975244', '[\"*\"]', '2026-04-12 03:06:33', NULL, '2026-04-12 02:17:56', '2026-04-12 03:06:33'),
(126, 'App\\Models\\User', 2, 'auth-token', 'b9714726091150b736a955348fb0ff7dcb99b0e8aa696ab084f37e79ebe365f6', '[\"*\"]', '2026-04-15 03:55:34', NULL, '2026-04-15 03:31:05', '2026-04-15 03:55:34'),
(154, 'App\\Models\\User', 2, 'auth-token', '5aaccec213d055162747de184064def5e200456f17eaf412af89f675240012a4', '[\"*\"]', '2026-04-15 05:39:23', NULL, '2026-04-15 05:23:53', '2026-04-15 05:39:23'),
(158, 'App\\Models\\User', 1, 'auth-token', 'a083e99beae2f15a8642180e98cd9efb0b5fce74a7180d6e17964535786a3528', '[\"*\"]', '2026-04-17 02:39:49', NULL, '2026-04-16 02:20:52', '2026-04-17 02:39:49'),
(162, 'App\\Models\\User', 1, 'auth-token', '7d5ec4c213034e913305dcbc4a7e0bac7d73af246ca3a50863827a9bbd31122f', '[\"*\"]', '2026-04-17 04:43:03', NULL, '2026-04-17 04:14:24', '2026-04-17 04:43:03'),
(178, 'App\\Models\\User', 2, 'auth-token', 'a365459d3bed5e84ace17d17feaa175dd1c54e7a4755f722c0281cfc09ae16bf', '[\"*\"]', NULL, NULL, '2026-04-19 01:34:49', '2026-04-19 01:34:49'),
(179, 'App\\Models\\User', 2, 'auth-token', 'ed60d70260984421ae72554eed6068029c466c90e1a6bf76796dde096a8e3178', '[\"*\"]', '2026-04-19 01:34:55', NULL, '2026-04-19 01:34:55', '2026-04-19 01:34:55'),
(180, 'App\\Models\\User', 2, 'auth-token', '63239400c0153ffc580c7b53db01f47728ba45cdb91f4e70e68cf020e61a1358', '[\"*\"]', '2026-04-19 01:35:02', NULL, '2026-04-19 01:35:01', '2026-04-19 01:35:02'),
(181, 'App\\Models\\User', 2, 'auth-token', 'e4ec6e5309f64cf90a559b8534cb9c0f15c0ec9e96dc45040ea0b750c5c5c92e', '[\"*\"]', '2026-04-19 01:35:07', NULL, '2026-04-19 01:35:07', '2026-04-19 01:35:07'),
(184, 'App\\Models\\User', 2, 'auth-token', 'dc19dbf0ad73a7ec588eb302f9561f227679ec9eecfb80fec780f9f3aeb0883a', '[\"*\"]', '2026-04-19 04:08:40', NULL, '2026-04-19 04:08:39', '2026-04-19 04:08:40'),
(185, 'App\\Models\\User', 2, 'auth-token', '283fc235a95bbeeee60b10363e11315bc5d1adf26b29116d6eba4c0691a7e232', '[\"*\"]', NULL, NULL, '2026-04-19 04:08:39', '2026-04-19 04:08:39'),
(188, 'App\\Models\\User', 2, 'auth-token', '307740c437a8616cf9ab994493137c2e36b1e319dd15d4db81c30f9f4984ab56', '[\"*\"]', '2026-04-19 06:01:44', NULL, '2026-04-19 06:01:43', '2026-04-19 06:01:44'),
(189, 'App\\Models\\User', 2, 'auth-token', '2f664c85e9d717835fcc5d1573ce304d7e020e125b2f8ed0666181481e3c019b', '[\"*\"]', '2026-04-19 06:02:14', NULL, '2026-04-19 06:02:14', '2026-04-19 06:02:14'),
(196, 'App\\Models\\User', 1, 'auth-token', '71bdd04b58970c2bfc9329583f00a7357a9670c9e8eb9681a530575d5c2a840a', '[\"*\"]', '2026-04-19 11:10:53', NULL, '2026-04-19 08:54:58', '2026-04-19 11:10:53'),
(207, 'App\\Models\\User', 1, 'auth-token', '66b3a09922156499d5b9cb7728423d6786ef481a1c8c30808642dd7e4c747d7a', '[\"*\"]', '2026-04-21 03:36:44', NULL, '2026-04-20 06:21:38', '2026-04-21 03:36:44'),
(238, 'App\\Models\\User', 1, 'auth-token', '6079a74fbe79742c6dbba688ce4932fed00e74284d546a5481da95e115285d86', '[\"*\"]', '2026-04-27 10:35:58', NULL, '2026-04-27 10:30:50', '2026-04-27 10:35:58'),
(239, 'App\\Models\\User', 1, 'auth-token', '39b11995435ffbf483a44194b84ca581cf1d01dbc78a275bb0ae29a7e5591804', '[\"*\"]', '2026-04-28 02:55:19', NULL, '2026-04-27 10:36:01', '2026-04-28 02:55:19'),
(240, 'App\\Models\\User', 1, 'test', '68236f1a5ace06fcf79aee4c791a901dd65cf21652790df14cc0d2d8191a07f3', '[\"*\"]', '2026-04-27 13:02:50', NULL, '2026-04-27 13:02:32', '2026-04-27 13:02:50');

-- --------------------------------------------------------

--
-- Table structure for table `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `usage_limit` int(11) NOT NULL DEFAULT 1,
  `usage_count` int(11) NOT NULL DEFAULT 0,
  `per_user_limit` int(11) NOT NULL DEFAULT 1,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `valid_from` datetime DEFAULT NULL,
  `valid_until` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promo_codes`
--

INSERT INTO `promo_codes` (`id`, `code`, `discount_type`, `discount_value`, `usage_limit`, `usage_count`, `per_user_limit`, `min_order_amount`, `valid_from`, `valid_until`, `is_active`, `description`, `created_at`, `updated_at`) VALUES
(1, 'RRR', 'percentage', 2.00, 90, 2, 1, 100.00, '2026-04-19 00:00:00', '2026-04-30 00:00:00', 1, 'Hi', '2026-04-19 10:50:40', '2026-04-23 07:22:52');

-- --------------------------------------------------------

--
-- Table structure for table `promo_code_usages`
--

CREATE TABLE `promo_code_usages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `promo_code_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `discount_given` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promo_code_usages`
--

INSERT INTO `promo_code_usages` (`id`, `promo_code_id`, `user_id`, `order_id`, `discount_given`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 70, 62.66, '2026-04-20 02:10:10', '2026-04-20 02:10:10'),
(2, 1, 13, 72, 6.22, '2026-04-23 07:22:52', '2026-04-23 07:22:52');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `is_answered` tinyint(1) NOT NULL DEFAULT 0,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `book_id`, `user_id`, `user_name`, `user_email`, `question`, `answer`, `is_answered`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 'Is this the original unabridged version or a shortened edition? I want the complete text.', 'yo', 1, 1, '2026-02-21 11:26:29', '2026-04-02 22:25:10'),
(2, 1, NULL, 'James Wilson', 'james@email.com', 'Does this edition include any study guides or annotations?', 'This is the standard edition without additional study materials. Check our \"Annotated Classics\" section for editions with guides.', 1, 1, '2026-03-06 11:26:29', '2026-04-01 11:26:29'),
(3, 2, NULL, 'Emily Chen', 'emily@email.com', 'Is this appropriate for a 13-year-old reader?', 'Yes, it\'s commonly assigned in middle school curricula. Some themes are mature but handled thoughtfully.', 1, 1, '2026-03-28 11:26:29', '2026-04-01 11:26:29'),
(4, 2, NULL, 'Michael Brown', 'michael@email.com', 'How does this compare to the movie adaptation?', 'The book offers much deeper character development and internal monologue that the films can\'t capture. Always read the book first!', 1, 1, '2026-02-07 11:26:29', '2026-04-01 11:26:29'),
(6, 6, NULL, 'David Kim', 'david@email.com', 'Is this the 2nd edition? I heard it has updated examples.', 'This is the original edition. The 2nd edition is available separately with updated code examples in modern languages.', 1, 1, '2026-03-01 11:26:29', '2026-04-01 11:26:29'),
(7, 6, NULL, 'Rachel Green', 'rachel@email.com', 'Are the code examples in Java or can they be applied to other languages?', 'The examples are primarily in Java but the principles are language-agnostic and apply to any object-oriented language.', 1, 1, '2026-02-10 11:26:29', '2026-04-01 11:26:29'),
(8, 9, NULL, 'Tom Harris', 'tom@email.com', 'How does this compare to \"Guns, Germs, and Steel\" by the same author?', 'Sapiens covers the entire span of human history while GGS focuses on why certain civilizations dominated. They complement each other well.', 1, 1, '2026-03-06 11:26:29', '2026-04-01 11:26:29'),
(9, 11, NULL, 'Anna Lee', 'anna@email.com', 'Does this book include worksheets or practical exercises?', 'Yes! The book includes practical exercises at the end of each chapter plus access to free downloadable worksheets on the author\'s website.', 1, 1, '2026-02-01 11:26:29', '2026-04-01 11:26:29'),
(10, 15, NULL, 'Chris Taylor', 'chris@email.com', 'Is this the illustrated edition or text only?', 'This is the standard text-only edition. The illustrated edition with artwork by Pablo Picasso is available separately.', 1, 1, '2026-02-05 11:26:29', '2026-04-01 11:26:29'),
(11, 2, NULL, 'John Doe', 'john@example.com', 'hi', 'yo', 1, 1, '2026-04-01 23:36:58', '2026-04-02 05:14:34'),
(12, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 'Is this the original unabridged version or a shortened edition? I want the complete text.', 'This is the complete, unabridged version of The Great Gatsby as originally published by Scribner.', 1, 1, '2026-03-30 10:57:14', '2026-04-02 10:57:14'),
(13, 1, NULL, 'James Wilson', 'james@email.com', 'Does this edition include any study guides or annotations?', 'This is the standard edition without additional study materials. Check our \"Annotated Classics\" section for editions with guides.', 1, 1, '2026-03-03 10:57:14', '2026-04-02 10:57:14'),
(14, 2, NULL, 'Emily Chen', 'emily@email.com', 'Is this appropriate for a 13-year-old reader?', 'Yes, it\'s commonly assigned in middle school curricula. Some themes are mature but handled thoughtfully.', 1, 1, '2026-03-06 10:57:14', '2026-04-02 10:57:14'),
(15, 2, NULL, 'Michael Brown', 'michael@email.com', 'How does this compare to the movie adaptation?', 'The book offers much deeper character development and internal monologue that the films can\'t capture. Always read the book first!', 1, 1, '2026-03-29 10:57:14', '2026-04-02 10:57:14'),
(16, 24, NULL, 'Lisa Anderson', 'lisa@email.com', 'Which edition/translation is this? Some versions have different appendices.', 'This is the standard Signet Classic edition which includes the original text. It does not include additional essays or appendices.', 1, 1, '2026-03-26 10:57:14', '2026-04-02 10:57:14'),
(17, 6, NULL, 'David Kim', 'david@email.com', 'Is this the 2nd edition? I heard it has updated examples.', 'This is the original edition. The 2nd edition is available separately with updated code examples in modern languages.', 1, 1, '2026-02-27 10:57:14', '2026-04-02 10:57:14'),
(18, 6, NULL, 'Rachel Green', 'rachel@email.com', 'Are the code examples in Java or can they be applied to other languages?', 'The examples are primarily in Java but the principles are language-agnostic and apply to any object-oriented language.', 1, 1, '2026-03-27 10:57:14', '2026-04-02 10:57:14'),
(19, 9, NULL, 'Tom Harris', 'tom@email.com', 'How does this compare to \"Guns, Germs, and Steel\" by the same author?', 'Sapiens covers the entire span of human history while GGS focuses on why certain civilizations dominated. They complement each other well.', 1, 1, '2026-02-26 10:57:14', '2026-04-02 10:57:14'),
(20, 11, NULL, 'Anna Lee', 'anna@email.com', 'Does this book include worksheets or practical exercises?', 'Yes! The book includes practical exercises at the end of each chapter plus access to free downloadable worksheets on the author\'s website.', 1, 1, '2026-02-26 10:57:14', '2026-04-02 10:57:14'),
(21, 15, NULL, 'Chris Taylor', 'chris@email.com', 'Is this the illustrated edition or text only?', 'This is the standard text-only edition. The illustrated edition with artwork by Pablo Picasso is available separately.', 1, 1, '2026-03-07 10:57:14', '2026-04-02 10:57:14'),
(22, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 'Is this the original unabridged version or a shortened edition? I want the complete text.', 'This is the complete, unabridged version of The Great Gatsby as originally published by Scribner.', 1, 1, '2026-03-03 11:46:15', '2026-04-02 11:46:15'),
(23, 1, NULL, 'James Wilson', 'james@email.com', 'Does this edition include any study guides or annotations?', 'This is the standard edition without additional study materials. Check our \"Annotated Classics\" section for editions with guides.', 1, 1, '2026-03-18 11:46:15', '2026-04-02 11:46:15'),
(24, 2, NULL, 'Emily Chen', 'emily@email.com', 'Is this appropriate for a 13-year-old reader?', 'Yes, it\'s commonly assigned in middle school curricula. Some themes are mature but handled thoughtfully.', 1, 1, '2026-02-16 11:46:15', '2026-04-02 11:46:15'),
(25, 2, NULL, 'Michael Brown', 'michael@email.com', 'How does this compare to the movie adaptation?', 'The book offers much deeper character development and internal monologue that the films can\'t capture. Always read the book first!', 1, 1, '2026-02-16 11:46:15', '2026-04-02 11:46:15'),
(26, 24, NULL, 'Lisa Anderson', 'lisa@email.com', 'Which edition/translation is this? Some versions have different appendices.', 'This is the standard Signet Classic edition which includes the original text. It does not include additional essays or appendices.', 1, 1, '2026-03-19 11:46:15', '2026-04-02 11:46:15'),
(27, 6, NULL, 'David Kim', 'david@email.com', 'Is this the 2nd edition? I heard it has updated examples.', 'This is the original edition. The 2nd edition is available separately with updated code examples in modern languages.', 1, 1, '2026-03-24 11:46:15', '2026-04-02 11:46:15'),
(28, 6, NULL, 'Rachel Green', 'rachel@email.com', 'Are the code examples in Java or can they be applied to other languages?', 'The examples are primarily in Java but the principles are language-agnostic and apply to any object-oriented language.', 1, 1, '2026-02-06 11:46:15', '2026-04-02 11:46:15'),
(29, 9, NULL, 'Tom Harris', 'tom@email.com', 'How does this compare to \"Guns, Germs, and Steel\" by the same author?', 'Sapiens covers the entire span of human history while GGS focuses on why certain civilizations dominated. They complement each other well.', 1, 1, '2026-03-05 11:46:15', '2026-04-02 11:46:15'),
(30, 11, NULL, 'Anna Lee', 'anna@email.com', 'Does this book include worksheets or practical exercises?', 'Yes! The book includes practical exercises at the end of each chapter plus access to free downloadable worksheets on the author\'s website.', 1, 1, '2026-03-17 11:46:15', '2026-04-02 11:46:15'),
(31, 15, NULL, 'Chris Taylor', 'chris@taylor.com', 'Is this the illustrated edition or text only?', 'This is the standard text-only edition. The illustrated edition with artwork by Pablo Picasso is available separately.', 1, 1, '2026-02-11 11:46:15', '2026-04-02 11:46:15'),
(32, 1, NULL, 'Anonymous', NULL, 'Is this book good for beginners?', 'Yes, this book is great for beginners!', 1, 1, '2026-04-02 12:14:48', '2026-04-02 12:16:49'),
(33, 26, NULL, 'John Doe', 'john@example.com', 'hi', NULL, 0, 1, '2026-04-03 08:31:43', '2026-04-03 08:31:43'),
(34, 25, NULL, 'John Doe', 'john@example.com', 'hi', NULL, 0, 1, '2026-04-12 02:27:38', '2026-04-12 02:27:38'),
(35, 81, 15, 'Elena Rodriguez', 'elena.r@email.com', 'Is this book part of a series or a standalone novel?', 'This is a standalone novel, though it is set in the same universe as \"The Angel\'s Game\".', 1, 1, '2026-04-12 10:30:00', '2026-04-12 10:35:00'),
(37, 83, 17, 'Sarah Jenkins', 'sarah.jenkins@email.com', 'Are there any trigger warnings for this book?', 'Yes, there are themes related to addiction and abusive relationships handled within the narrative.', 1, 1, '2026-04-12 11:00:00', '2026-04-12 11:05:00'),
(38, 84, 18, 'David Okonkwo', 'david.okonkwo@email.com', 'Is this book focused on a specific programming language?', 'No, \"Clean Architecture\" is language-agnostic and focuses on general principles.', 1, 1, '2026-04-12 11:15:00', '2026-04-12 11:20:00'),
(39, 85, 19, 'Priya Patel', 'priya.patel@email.com', 'Is the translation faithful to the original text?', 'Yes, the dialogue and narrative are carefully adapted to preserve the depth of the original.', 1, 1, '2026-04-12 11:30:00', '2026-04-12 11:35:00'),
(40, 86, 20, 'Lucas Miller', 'lucas.miller@email.com', 'Does this book require prior knowledge of poker to understand?', 'Not at all. The author uses poker as a framework to explain general decision-making skills.', 1, 1, '2026-04-12 11:45:00', '2026-04-12 11:50:00'),
(41, 87, 21, 'Ananya Gupta', 'ananya.gupta@email.com', 'Is this a self-help book or a memoir?', 'It is a memoir that reads like a novel, with self-help insights woven through personal stories.', 1, 1, '2026-04-12 12:00:00', '2026-04-12 12:05:00'),
(42, 88, 22, 'James Wilson', 'james.wilson@email.com', 'How hard is the science in this book?', 'It is \"hard sci-fi,\" meaning the science is accurate and integral to the plot, but written accessibly.', 1, 1, '2026-04-12 12:15:00', '2026-04-12 12:20:00'),
(43, 89, 23, 'Fatima Al-Mansoori', 'fatima.m@email.com', 'Do I need to know HTML/CSS to benefit from this?', 'Basic knowledge is helpful, but the design principles can be understood even by beginners.', 1, 1, '2026-04-12 12:30:00', '2026-04-12 12:35:00'),
(44, 90, 24, 'Leo Rossi', 'leo.rossi@email.com', 'Does this cover quantum computing encryption?', 'Yes, the final chapters discuss the impact of quantum computing on modern cryptography.', 1, 1, '2026-04-12 12:45:00', '2026-04-12 12:50:00'),
(45, 1, 1, 'Admin User', 'admin@luminabooks.com', 'Is this the original unabridged text or a simplified edition?', 'This is the complete, original unabridged text exactly as published.', 1, 1, '2026-04-01 05:00:00', '2026-04-01 05:00:00'),
(46, 1, 2, 'John Doe', 'john@example.com', 'Does this edition include any footnotes or historical context?', 'Yes, it contains extensive footnotes explaining 1920s cultural references.', 1, 1, '2026-04-01 05:05:00', '2026-04-01 05:05:00'),
(47, 1, 4, 'HI', 'HW@gmail.com', 'Is the cover design hardcover or paperback?', 'This listing is for the premium hardcover edition with dust jacket.', 1, 1, '2026-04-01 05:10:00', '2026-04-01 05:10:00'),
(48, 1, 5, 'Updated Name', 'testuser@test.com', 'Are there any trigger warnings I should know about?', 'The book contains themes of alcoholism and infidelity typical of the era.', 1, 1, '2026-04-01 05:15:00', '2026-04-01 05:15:00'),
(49, 1, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 'How does this compare to the 1974 film adaptation?', 'The book dives much deeper into Gatsby\'s internal motivations than the movie.', 1, 1, '2026-04-01 05:20:00', '2026-04-01 05:20:00'),
(50, 1, 7, 'Fatima Khan', 'fatima.khan@email.com', 'Is it suitable for high school students?', 'Absolutely. It is a staple in most high school and college literature curricula.', 1, 1, '2026-04-01 05:25:00', '2026-04-01 05:25:00'),
(51, 1, 8, 'Karim Hassan', 'karim.hassan@email.com', 'Will there be a sequel or companion novel?', 'No, it is a standalone masterpiece by F. Scott Fitzgerald.', 1, 1, '2026-04-01 05:30:00', '2026-04-01 05:30:00'),
(52, 1, 9, 'Nadia Islam', 'nadia.islam@email.com', 'What language is the translation if applicable?', 'This edition is in English, the original language of the work.', 1, 1, '2026-04-01 05:35:00', '2026-04-01 05:35:00'),
(53, 1, 10, 'Tariq Ali', 'tariq.ali@email.com', 'Does it come with a reading guide for book clubs?', 'Yes, a comprehensive discussion guide is included in the appendix.', 1, 1, '2026-04-01 05:40:00', '2026-04-01 05:40:00'),
(54, 1, 11, 'Jack', 'J@gmail.com', 'How long is the average reading time for this book?', 'Most readers finish it in about 6-8 hours at a moderate pace.', 1, 1, '2026-04-01 05:45:00', '2026-04-01 05:45:00'),
(55, 2, 1, 'Admin User', 'admin@luminabooks.com', 'Is this appropriate for middle school readers?', 'Yes, it is widely taught in 8th and 9th grade English classes.', 1, 1, '2026-04-02 03:00:00', '2026-04-02 03:00:00'),
(56, 2, 2, 'John Doe', 'john@example.com', 'Does it include the controversial original draft ending?', 'No, this uses the standard published ending approved by Harper Lee.', 1, 1, '2026-04-02 03:05:00', '2026-04-02 03:05:00'),
(57, 2, 4, 'HI', 'HW@gmail.com', 'Are the legal terms explained for laymen?', 'The narrative context makes the trial very accessible, no law degree needed.', 1, 1, '2026-04-02 03:10:00', '2026-04-02 03:10:00'),
(58, 2, 5, 'Updated Name', 'testuser@test.com', 'Is there an audio version available with this purchase?', 'This is a physical book listing. Audiobooks are sold separately.', 1, 1, '2026-04-02 03:15:00', '2026-04-02 03:15:00'),
(59, 2, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 'How does it compare to Go Set a Watchman?', 'Watchman was an earlier draft. This novel stands alone as the definitive work.', 1, 1, '2026-04-02 03:20:00', '2026-04-02 03:20:00'),
(60, 2, 7, 'Fatima Khan', 'fatima.khan@email.com', 'What themes are most prominent in this book?', 'Racial injustice, moral courage, empathy, and loss of innocence.', 1, 1, '2026-04-02 03:25:00', '2026-04-02 03:25:00'),
(61, 2, 8, 'Karim Hassan', 'karim.hassan@email.com', 'Is the Southern dialect hard to understand?', 'It can be tricky at first, but you quickly get used to the rhythm.', 1, 1, '2026-04-02 03:30:00', '2026-04-02 03:30:00'),
(62, 2, 9, 'Nadia Islam', 'nadia.islam@email.com', 'Does it have a happy ending?', 'It has a poignant, realistic ending that emphasizes moral victory over legal victory.', 1, 1, '2026-04-02 03:35:00', '2026-04-02 03:35:00'),
(63, 2, 10, 'Tariq Ali', 'tariq.ali@email.com', 'How many pages is this edition?', 'This specific printing contains 336 pages.', 1, 1, '2026-04-02 03:40:00', '2026-04-02 03:40:00'),
(64, 2, 11, 'Jack', 'J@gmail.com', 'Can I get a bulk discount for classroom use?', 'Please contact our institutional sales team for educator pricing.', 1, 1, '2026-04-02 03:45:00', '2026-04-02 03:45:00'),
(65, 97, NULL, 'John Doe', 'john@example.com', 'can i overwrite this book', 'no', 1, 1, '2026-04-15 04:11:44', '2026-04-15 04:14:38'),
(66, 97, NULL, 'Zacky', 'Z@gmailcom', 'yoyohi', NULL, 0, 1, '2026-04-18 06:13:40', '2026-04-18 06:13:40'),
(67, 97, NULL, 'Gal Belly', 'G@gmail.com', 'gmail', NULL, 0, 1, '2026-04-23 03:38:48', '2026-04-23 03:38:48'),
(68, 113, NULL, 'Alex', 'A@gmail.com', 'ascdscdc', NULL, 0, 1, '2026-04-23 07:28:48', '2026-04-23 07:28:48'),
(69, 113, NULL, 'Alex', 'A@gmail.com', 'Alex', 'hi', 1, 1, '2026-04-23 07:28:59', '2026-04-23 07:29:22');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `book_id`, `user_id`, `user_name`, `user_email`, `rating`, `comment`, `is_approved`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'An absolute masterpiece! Fitzgerald\'s prose is breathtaking and the portrayal of the Jazz Age is unmatched. Every re-read reveals new layers of meaning.', 1, '2026-02-20 11:26:29', '2026-04-01 11:26:29'),
(2, 1, NULL, 'James Wilson', 'james@email.com', 4, 'Beautiful writing but the characters are so flawed it\'s hard to root for anyone. Still, a must-read classic that everyone should experience.', 1, '2026-03-08 11:26:29', '2026-04-01 11:26:29'),
(3, 1, NULL, 'Emily Chen', 'emily@email.com', 5, 'The symbolism in this book is incredible. The green light, the eyes of Dr. T.J. Eckleburg - every detail has meaning. A true work of art.', 1, '2026-01-08 11:26:29', '2026-04-01 11:26:29'),
(4, 2, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book changed my perspective on justice and morality. Scout\'s innocent yet perceptive narration makes the heavy themes accessible and deeply moving.', 1, '2026-01-11 11:26:29', '2026-04-01 11:26:29'),
(5, 2, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Atticus Finch is one of the greatest literary heroes ever created. His quiet courage and moral integrity are inspiring. A timeless classic.', 1, '2026-03-26 11:26:29', '2026-04-01 11:26:29'),
(11, 6, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'Every programmer should read this book. Uncle Bob\'s principles have transformed how I write code. Clean code is not just a goal, it\'s a discipline.', 1, '2026-02-23 11:26:29', '2026-04-01 11:26:29'),
(12, 6, NULL, 'James Wilson', 'james@email.com', 4, 'Excellent practical advice for writing maintainable code. Some examples feel dated but the core principles are timeless. A developer\'s essential guide.', 1, '2026-01-17 11:26:29', '2026-04-01 11:26:29'),
(13, 7, NULL, 'Emily Chen', 'emily@email.com', 4, 'The Gang of Four patterns are foundational to software design. Some patterns feel over-engineered for modern development, but understanding them is invaluable.', 1, '2026-03-04 11:26:29', '2026-04-01 11:26:29'),
(14, 8, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book made me a better developer overnight. The pragmatic approach to software engineering is refreshing and immediately applicable to any project.', 1, '2026-01-02 11:26:29', '2026-04-01 11:26:29'),
(15, 9, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Harari weaves anthropology, history, and philosophy into an incredible narrative. It fundamentally changed how I think about human civilization and progress.', 1, '2026-03-28 11:26:29', '2026-04-01 11:26:29'),
(16, 9, NULL, 'David Kim', 'david@email.com', 4, 'Fascinating journey through human history. Some arguments are debatable but the overall thesis is thought-provoking and well-researched.', 1, '2026-01-07 11:26:29', '2026-04-01 11:26:29'),
(17, 10, NULL, 'Rachel Green', 'rachel@email.com', 4, 'Diamond\'s thesis about geography shaping civilization is compelling. A sweeping analysis that connects dots across continents and millennia.', 1, '2026-01-25 11:26:29', '2026-04-01 11:26:29'),
(18, 11, NULL, 'Tom Harris', 'tom@email.com', 5, 'Atomic Habits is the best self-help book I\'ve ever read. Clear\'s four-step framework is simple yet powerful. I\'ve already seen real changes in my daily routine.', 1, '2026-03-20 11:26:29', '2026-04-01 11:26:29'),
(19, 11, NULL, 'Anna Lee', 'anna@email.com', 5, 'Finally, a habits book that actually works! The concept of 1% improvement is transformative. Small changes really do compound into remarkable results.', 1, '2026-01-18 11:26:29', '2026-04-01 11:26:29'),
(20, 12, NULL, 'Chris Taylor', 'chris@email.com', 4, 'Great framework for startups. The build-measure-learn loop is a game-changer. Some concepts are overused now but the original insights are still valuable.', 1, '2026-02-24 11:26:29', '2026-04-01 11:26:29'),
(21, 13, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'Kahneman\'s exploration of System 1 and System 2 thinking is mind-blowing. It explains so many of our irrational decisions. Essential reading for anyone.', 1, '2026-02-12 11:26:29', '2026-04-01 11:26:29'),
(22, 13, NULL, 'James Wilson', 'james@email.com', 4, 'Dense but incredibly insightful. The research on cognitive biases is eye-opening. Be prepared to question your own thinking after reading this.', 1, '2026-03-22 11:26:29', '2026-04-01 11:26:29'),
(23, 14, NULL, 'Emily Chen', 'emily@email.com', 5, 'Tolle\'s message about living in the present moment is simple yet profound. This book helped me find peace in the chaos of modern life.', 1, '2026-02-03 11:26:29', '2026-04-01 11:26:29'),
(24, 14, NULL, 'Michael Brown', 'michael@email.com', 4, 'A spiritual guide that actually makes sense. The concept of the \"pain body\" resonated deeply with me. Practical wisdom for everyday mindfulness.', 1, '2026-01-30 11:26:29', '2026-04-01 11:26:29'),
(25, 15, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'A beautiful fable about following your dreams. Coelho\'s writing is poetic and the story is universal. I return to this book every few years.', 1, '2026-02-06 11:26:29', '2026-04-01 11:26:29'),
(26, 15, NULL, 'David Kim', 'david@email.com', 4, 'Simple yet profound. The Alchemist reminds us that the journey is as important as the destination. A quick read with lasting impact.', 1, '2026-03-19 11:26:29', '2026-04-01 11:26:29'),
(30, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'An absolute masterpiece! Fitzgerald\'s prose is breathtaking and the portrayal of the Jazz Age is unmatched. Every re-read reveals new layers of meaning.', 1, '2026-01-25 10:54:54', '2026-04-02 10:54:54'),
(31, 1, NULL, 'James Wilson', 'james@email.com', 4, 'Beautiful writing but the characters are so flawed it\'s hard to root for anyone. Still, a must-read classic that everyone should experience.', 1, '2026-03-25 10:54:54', '2026-04-02 10:54:54'),
(32, 1, NULL, 'Emily Chen', 'emily@email.com', 5, 'The symbolism in this book is incredible. The green light, the eyes of Dr. T.J. Eckleburg - every detail has meaning. A true work of art.', 1, '2026-02-12 10:54:54', '2026-04-02 10:54:54'),
(33, 2, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book changed my perspective on justice and morality. Scout\'s innocent yet perceptive narration makes the heavy themes accessible and deeply moving.', 1, '2026-03-07 10:54:54', '2026-04-02 10:54:54'),
(34, 2, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Atticus Finch is one of the greatest literary heroes ever created. His quiet courage and moral integrity are inspiring. A timeless classic.', 1, '2026-01-27 10:54:54', '2026-04-02 10:54:54'),
(36, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'An absolute masterpiece! Fitzgerald\'s prose is breathtaking and the portrayal of the Jazz Age is unmatched. Every re-read reveals new layers of meaning.', 1, '2026-01-29 10:57:14', '2026-04-02 10:57:14'),
(37, 1, NULL, 'James Wilson', 'james@email.com', 4, 'Beautiful writing but the characters are so flawed it\'s hard to root for anyone. Still, a must-read classic that everyone should experience.', 1, '2026-01-09 10:57:14', '2026-04-02 10:57:14'),
(38, 1, NULL, 'Emily Chen', 'emily@email.com', 5, 'The symbolism in this book is incredible. The green light, the eyes of Dr. T.J. Eckleburg - every detail has meaning. A true work of art.', 1, '2026-03-07 10:57:14', '2026-04-02 10:57:14'),
(39, 2, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book changed my perspective on justice and morality. Scout\'s innocent yet perceptive narration makes the heavy themes accessible and deeply moving.', 1, '2026-01-17 10:57:14', '2026-04-02 10:57:14'),
(40, 2, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Atticus Finch is one of the greatest literary heroes ever created. His quiet courage and moral integrity are inspiring. A timeless classic.', 1, '2026-01-30 10:57:14', '2026-04-02 10:57:14'),
(41, 24, NULL, 'David Kim', 'david@email.com', 4, 'Orwell\'s dystopian vision feels more relevant than ever. The concepts of doublethink and Newspeak are chillingly prescient. A must-read for our times.', 1, '2026-01-05 10:57:14', '2026-04-02 10:57:14'),
(42, 24, NULL, 'Rachel Green', 'rachel@email.com', 5, 'Terrifyingly accurate prediction of surveillance culture. Big Brother is watching indeed. This book should be required reading in every school.', 1, '2026-03-02 10:57:14', '2026-04-02 10:57:14'),
(46, 6, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'Every programmer should read this book. Uncle Bob\'s principles have transformed how I write code. Clean code is not just a goal, it\'s a discipline.', 1, '2026-03-11 10:57:14', '2026-04-02 10:57:14'),
(47, 6, NULL, 'James Wilson', 'james@email.com', 4, 'Excellent practical advice for writing maintainable code. Some examples feel dated but the core principles are timeless. A developer\'s essential guide.', 1, '2026-01-04 10:57:14', '2026-04-02 10:57:14'),
(48, 7, NULL, 'Emily Chen', 'emily@email.com', 4, 'The Gang of Four patterns are foundational to software design. Some patterns feel over-engineered for modern development, but understanding them is invaluable.', 1, '2026-01-07 10:57:14', '2026-04-02 10:57:14'),
(49, 8, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book made me a better developer overnight. The pragmatic approach to software engineering is refreshing and immediately applicable to any project.', 1, '2026-01-19 10:57:14', '2026-04-02 10:57:14'),
(50, 9, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Harari weaves anthropology, history, and philosophy into an incredible narrative. It fundamentally changed how I think about human civilization and progress.', 1, '2026-01-16 10:57:14', '2026-04-02 10:57:14'),
(51, 9, NULL, 'David Kim', 'david@email.com', 4, 'Fascinating journey through human history. Some arguments are debatable but the overall thesis is thought-provoking and well-researched.', 1, '2026-03-17 10:57:14', '2026-04-02 10:57:14'),
(52, 10, NULL, 'Rachel Green', 'rachel@email.com', 4, 'Diamond\'s thesis about geography shaping civilization is compelling. A sweeping analysis that connects dots across continents and millennia.', 1, '2026-04-01 10:57:14', '2026-04-02 10:57:14'),
(53, 11, NULL, 'Tom Harris', 'tom@email.com', 5, 'Atomic Habits is the best self-help book I\'ve ever read. Clear\'s four-step framework is simple yet powerful. I\'ve already seen real changes in my daily routine.', 1, '2026-02-26 10:57:14', '2026-04-02 10:57:14'),
(54, 11, NULL, 'Anna Lee', 'anna@email.com', 5, 'Finally, a habits book that actually works! The concept of 1% improvement is transformative. Small changes really do compound into remarkable results.', 1, '2026-03-08 10:57:14', '2026-04-02 10:57:14'),
(55, 12, NULL, 'Chris Taylor', 'chris@email.com', 4, 'Great framework for startups. The build-measure-learn loop is a game-changer. Some concepts are overused now but the original insights are still valuable.', 1, '2026-02-17 10:57:14', '2026-04-02 10:57:14'),
(56, 13, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'Kahneman\'s exploration of System 1 and System 2 thinking is mind-blowing. It explains so many of our irrational decisions. Essential reading for anyone.', 1, '2026-03-25 10:57:14', '2026-04-02 10:57:14'),
(57, 13, NULL, 'James Wilson', 'james@email.com', 4, 'Dense but incredibly insightful. The research on cognitive biases is eye-opening. Be prepared to question your own thinking after reading this.', 1, '2026-03-06 10:57:14', '2026-04-02 10:57:14'),
(58, 14, NULL, 'Emily Chen', 'emily@email.com', 5, 'Tolle\'s message about living in the present moment is simple yet profound. This book helped me find peace in the chaos of modern life.', 1, '2026-02-16 10:57:14', '2026-04-02 10:57:14'),
(59, 14, NULL, 'Michael Brown', 'michael@email.com', 4, 'A spiritual guide that actually makes sense. The concept of the \"pain body\" resonated deeply with me. Practical wisdom for everyday mindfulness.', 1, '2026-01-05 10:57:14', '2026-04-02 10:57:14'),
(60, 15, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'A beautiful fable about following your dreams. Coelho\'s writing is poetic and the story is universal. I return to this book every few years.', 1, '2026-01-25 10:57:14', '2026-04-02 10:57:14'),
(61, 15, NULL, 'David Kim', 'david@email.com', 4, 'Simple yet profound. The Alchemist reminds us that the journey is as important as the destination. A quick read with lasting impact.', 1, '2026-01-19 10:57:14', '2026-04-02 10:57:14'),
(64, 1, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'An absolute masterpiece! Fitzgerald\'s prose is breathtaking and the portrayal of the Jazz Age is unmatched. Every re-read reveals new layers of meaning.', 1, '2026-01-04 11:46:15', '2026-04-02 11:46:15'),
(65, 1, NULL, 'James Wilson', 'james@email.com', 4, 'Beautiful writing but the characters are so flawed it\'s hard to root for anyone. Still, a must-read classic that everyone should experience.', 1, '2026-03-20 11:46:15', '2026-04-02 11:46:15'),
(66, 1, NULL, 'Emily Chen', 'emily@email.com', 5, 'The symbolism in this book is incredible. The green light, the eyes of Dr. T.J. Eckleburg - every detail has meaning. A true work of art.', 1, '2026-02-25 11:46:15', '2026-04-02 11:46:15'),
(67, 2, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book changed my perspective on justice and morality. Scout\'s innocent yet perceptive narration makes the heavy themes accessible and deeply moving.', 1, '2026-01-22 11:46:15', '2026-04-02 11:46:15'),
(68, 2, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Atticus Finch is one of the greatest literary heroes ever created. His quiet courage and moral integrity are inspiring. A timeless classic.', 1, '2026-02-28 11:46:15', '2026-04-02 11:46:15'),
(69, 24, NULL, 'David Kim', 'david@email.com', 4, 'Orwell\'s dystopian vision feels more relevant than ever. The concepts of doublethink and Newspeak are chillingly prescient. A must-read for our times.', 1, '2026-03-23 11:46:15', '2026-04-02 11:46:15'),
(70, 24, NULL, 'Rachel Green', 'rachel@email.com', 5, 'Terrifyingly accurate prediction of surveillance culture. Big Brother is watching indeed. This book should be required reading in every school.', 1, '2026-03-01 11:46:15', '2026-04-02 11:46:15'),
(74, 6, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'Every programmer should read this book. Uncle Bob\'s principles have transformed how I write code. Clean code is not just a goal, it\'s a discipline.', 1, '2026-01-18 11:46:15', '2026-04-02 11:46:15'),
(75, 6, NULL, 'James Wilson', 'james@email.com', 4, 'Excellent practical advice for writing maintainable code. Some examples feel dated but the core principles are timeless. A developer\'s essential guide.', 1, '2026-02-20 11:46:15', '2026-04-02 11:46:15'),
(76, 7, NULL, 'Emily Chen', 'emily@email.com', 4, 'The Gang of Four patterns are foundational to software design. Some patterns feel over-engineered for modern development, but understanding them is invaluable.', 1, '2026-01-17 11:46:15', '2026-04-02 11:46:15'),
(77, 8, NULL, 'Michael Brown', 'michael@email.com', 5, 'This book made me a better developer overnight. The pragmatic approach to software engineering is refreshing and immediately applicable to any project.', 1, '2026-01-04 11:46:15', '2026-04-02 11:46:15'),
(78, 9, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'Harari weaves anthropology, history, and philosophy into an incredible narrative. It fundamentally changed how I think about human civilization and progress.', 1, '2026-01-25 11:46:15', '2026-04-02 11:46:15'),
(79, 9, NULL, 'David Kim', 'david@email.com', 4, 'Fascinating journey through human history. Some arguments are debatable but the overall thesis is thought-provoking and well-researched.', 1, '2026-03-07 11:46:15', '2026-04-02 11:46:15'),
(80, 10, NULL, 'Rachel Green', 'rachel@email.com', 4, 'Diamond\'s thesis about geography shaping civilization is compelling. A sweeping analysis that connects dots across continents and millennia.', 1, '2026-02-03 11:46:15', '2026-04-02 11:46:15'),
(81, 11, NULL, 'Tom Harris', 'tom@email.com', 5, 'Atomic Habits is the best self-help book I\'ve ever read. Clear\'s four-step framework is simple yet powerful. I\'ve already seen real changes in my daily routine.', 1, '2026-01-11 11:46:15', '2026-04-02 11:46:15'),
(82, 11, NULL, 'Anna Lee', 'anna@email.com', 5, 'Finally, a habits book that actually works! The concept of 1% improvement is transformative. Small changes really do compound into remarkable results.', 1, '2026-01-19 11:46:15', '2026-04-02 11:46:15'),
(83, 12, NULL, 'Chris Taylor', 'chris@taylor.com', 4, 'Great framework for startups. The build-measure-learn loop is a game-changer. Some concepts are overused now but the original insights are still valuable.', 1, '2026-02-07 11:46:15', '2026-04-02 11:46:15'),
(84, 13, NULL, 'Sarah Mitchell', 'sarah@email.com', 5, 'Kahneman\'s exploration of System 1 and System 2 thinking is mind-blowing. It explains so many of our irrational decisions. Essential reading for anyone.', 1, '2026-02-15 11:46:15', '2026-04-02 11:46:15'),
(85, 13, NULL, 'James Wilson', 'james@email.com', 4, 'Dense but incredibly insightful. The research on cognitive biases is eye-opening. Be prepared to question your own thinking after reading this.', 1, '2026-02-05 11:46:15', '2026-04-02 11:46:15'),
(86, 14, NULL, 'Emily Chen', 'emily@email.com', 5, 'Tolle\'s message about living in the present moment is simple yet profound. This book helped me find peace in the chaos of modern life.', 1, '2026-01-13 11:46:15', '2026-04-02 11:46:15'),
(87, 14, NULL, 'Michael Brown', 'michael@email.com', 4, 'A spiritual guide that actually makes sense. The concept of the \"pain body\" resonated deeply with me. Practical wisdom for everyday mindfulness.', 1, '2026-03-19 11:46:15', '2026-04-02 11:46:15'),
(88, 15, NULL, 'Lisa Anderson', 'lisa@email.com', 5, 'A beautiful fable about following your dreams. Coelho\'s writing is poetic and the story is universal. I return to this book every few years.', 1, '2026-02-23 11:46:15', '2026-04-02 11:46:15'),
(89, 15, NULL, 'David Kim', 'david@email.com', 4, 'Simple yet profound. The Alchemist reminds us that the journey is as important as the destination. A quick read with lasting impact.', 1, '2026-01-09 11:46:15', '2026-04-02 11:46:15'),
(92, 1, NULL, 'Test User', NULL, 5, 'Great book!', 1, '2026-04-02 12:14:45', '2026-04-02 12:14:45'),
(93, 81, 15, 'Elena Rodriguez', 'elena.r@email.com', 5, 'Absolutely mesmerizing! The atmosphere of the Cemetery of Forgotten Books is so vivid. A true masterpiece of modern literature.', 1, '2026-04-12 08:00:00', '2026-04-12 08:00:00'),
(95, 83, 17, 'Sarah Jenkins', 'sarah.jenkins@email.com', 5, 'I could not put this down! Evelyn Hugo is a character I will never forget. The twists kept me guessing until the very end.', 1, '2026-04-12 08:30:00', '2026-04-12 08:30:00'),
(96, 84, 18, 'David Okonkwo', 'david.okonkwo@email.com', 5, 'Uncle Bob strikes again. A must-read for senior developers looking to structure their applications better.', 1, '2026-04-12 08:45:00', '2026-04-12 08:45:00'),
(97, 85, 19, 'Priya Patel', 'priya.patel@email.com', 4, 'The graphic format makes the dense history much more digestible. Beautiful artwork too.', 1, '2026-04-12 09:00:00', '2026-04-12 09:00:00'),
(98, 86, 20, 'Lucas Miller', 'lucas.miller@email.com', 4, 'Annie Duke\'s poker background gives her a unique perspective on decision making under uncertainty. Very practical advice.', 1, '2026-04-12 09:15:00', '2026-04-12 09:15:00'),
(99, 87, 21, 'Ananya Gupta', 'ananya.gupta@email.com', 5, 'Heartbreaking and uplifting at the same time. It reminds us that we are all just people trying to figure it out.', 1, '2026-04-12 09:30:00', '2026-04-12 09:30:00'),
(100, 88, 22, 'James Wilson', 'james.wilson@email.com', 5, 'Even better than The Martian! Rocky is the best alien character ever written. Science fiction at its finest.', 1, '2026-04-12 09:45:00', '2026-04-12 09:45:00'),
(101, 89, 23, 'Fatima Al-Mansoori', 'fatima.m@email.com', 5, 'This book saved my design career. Practical, actionable advice that you can apply immediately to any project.', 1, '2026-04-12 10:00:00', '2026-04-12 10:00:00'),
(102, 90, 24, 'Leo Rossi', 'leo.rossi@email.com', 4, 'A fascinating journey through the history of encryption. Singh explains the math behind the secrets perfectly.', 1, '2026-04-12 10:15:00', '2026-04-12 10:15:00'),
(103, 1, 1, 'Admin User', 'admin@luminabooks.com', 5, 'A timeless classic. The prose is absolutely breathtaking.', 1, '2026-04-01 06:00:00', '2026-04-01 06:00:00'),
(104, 1, 2, 'John Doe', 'john@example.com', 4, 'Great story, though the pacing slows down in the middle.', 1, '2026-04-01 06:05:00', '2026-04-01 06:05:00'),
(105, 1, 4, 'HI', 'HW@gmail.com', 5, 'Highly recommended! I read it twice in a week.', 1, '2026-04-01 06:10:00', '2026-04-01 06:10:00'),
(106, 1, 5, 'Updated Name', 'testuser@test.com', 4, 'Excellent character development and setting.', 1, '2026-04-01 06:15:00', '2026-04-01 06:15:00'),
(107, 1, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 5, 'A masterpiece of modern literature.', 1, '2026-04-01 06:20:00', '2026-04-01 06:20:00'),
(108, 1, 7, 'Fatima Khan', 'fatima.khan@email.com', 3, 'Interesting themes, but a bit too dense for casual reading.', 1, '2026-04-01 06:25:00', '2026-04-01 06:25:00'),
(109, 1, 8, 'Karim Hassan', 'karim.hassan@email.com', 5, 'Changed my perspective on the Jazz Age completely.', 1, '2026-04-01 06:30:00', '2026-04-01 06:30:00'),
(110, 1, 9, 'Nadia Islam', 'nadia.islam@email.com', 4, 'Beautifully written, but the ending is somewhat ambiguous.', 1, '2026-04-01 06:35:00', '2026-04-01 06:35:00'),
(111, 1, 10, 'Tariq Ali', 'tariq.ali@email.com', 5, 'An absolute must-read for literature enthusiasts.', 1, '2026-04-01 06:40:00', '2026-04-01 06:40:00'),
(112, 1, 11, 'Jack', 'J@gmail.com', 4, 'Solid storytelling with profound social commentary.', 1, '2026-04-01 06:45:00', '2026-04-01 06:45:00'),
(113, 2, 1, 'Admin User', 'admin@luminabooks.com', 5, 'A profound exploration of justice and morality.', 1, '2026-04-02 04:00:00', '2026-04-02 04:00:00'),
(114, 2, 2, 'John Doe', 'john@example.com', 5, 'Scout\'s voice is unforgettable. Truly inspiring.', 1, '2026-04-02 04:05:00', '2026-04-02 04:05:00'),
(115, 2, 4, 'HI', 'HW@gmail.com', 4, 'A bit slow at times, but the payoff is worth it.', 1, '2026-04-02 04:10:00', '2026-04-02 04:10:00'),
(116, 2, 5, 'Updated Name', 'testuser@test.com', 5, 'Essential reading for understanding human empathy.', 1, '2026-04-02 04:15:00', '2026-04-02 04:15:00'),
(117, 2, 6, 'Rahim Ahmed', 'rahim.ahmed@email.com', 4, 'Brilliantly captures the complexities of the South.', 1, '2026-04-02 04:20:00', '2026-04-02 04:20:00'),
(118, 2, 7, 'Fatima Khan', 'fatima.khan@email.com', 5, 'Atticus Finch remains the gold standard of heroes.', 1, '2026-04-02 04:25:00', '2026-04-02 04:25:00'),
(119, 2, 8, 'Karim Hassan', 'karim.hassan@email.com', 4, 'Heartbreaking yet uplifting. A true classic.', 1, '2026-04-02 04:30:00', '2026-04-02 04:30:00'),
(120, 2, 9, 'Nadia Islam', 'nadia.islam@email.com', 5, 'The courtroom scenes are incredibly tense and well-written.', 1, '2026-04-02 04:35:00', '2026-04-02 04:35:00'),
(121, 2, 10, 'Tariq Ali', 'tariq.ali@email.com', 4, 'A beautiful story about growing up and facing prejudice.', 1, '2026-04-02 04:40:00', '2026-04-02 04:40:00'),
(122, 2, 11, 'Jack', 'J@gmail.com', 5, 'Every generation needs to read this book.', 1, '2026-04-02 04:45:00', '2026-04-02 04:45:00'),
(123, 97, NULL, 'John Doe', 'john@example.com', 5, 'great!!!!!!!!!!!!', 1, '2026-04-15 04:27:00', '2026-04-15 06:34:42'),
(126, 97, NULL, 'Null', 'N@gmail.com', 4, 'good not so great hi', 1, '2026-04-15 04:38:14', '2026-04-19 00:44:46'),
(127, 110, NULL, 'Alex', 'A@gmail.com', 3, 'great', 1, '2026-04-23 07:31:22', '2026-04-23 07:31:22');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('0DLOwtbHMq7xd66S89wBPMwV9B2kvbV2sNeu6M1C', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2dpTzRGQWljd3JSdE9YM0JPcGVrcXE5amZMTlpWMVRoemw2dHprVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvc3RhZmYvY291cnNlLWNhdGVnb3JpZXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1777366295),
('2inbwE4KPRarLI6Pk7obhPWi6JE8GtliA3NUKSrh', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNllUb1EzeGZqeFJuNGVyZUhhbDlRVFFCV3dlWjlNb0pGOHBURXpWWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY291cnNlcz9mZWF0dXJlZD10cnVlIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1777366295),
('2xVuJ0BFg073X6pGDgfD68DRMzjsx00qg9zAHEUv', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDZRZVlaQnJzYjhkMW81ZlNYZ3o5UThsdERDS24xWU1PNXFUVGRsaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY2FydCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777366296),
('6ZXsEeNvFU7qZNzhgrCvRQqgtLNbFtPIIudGZrX5', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkNVTG9abWQ2YkJJU1dsYkE1WGM4cWlkczR6Znl1VHJvU1d3b1VVdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY291cnNlcyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777366295),
('f9PBxhaGty8VJwYbgL1Kc218XJr39EqGXzc16URg', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOTVhTGM3Mzl5Zm1udEFOdFMzbms2QkttckthOUhieUlxcU0zdmRhOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvc3RhZmYvcHJvbW8tY29kZXMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1777366519),
('OD8VmvsoGMHcuctf7bg14vPUUluvJONcyuXzHAnY', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSmVhckxnR0NZaXlMQlJsaFBUekJ3TmVMVnFrYkw1M05JRnIwNzJwOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvYXV0aC9tZSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777366295),
('UESUB2vOP0ouVpMAbx7kDl7ElXWBxYjqllwAPYxT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSEdsTGd2cGJ3eWQyVWJjN3Nsb25iRGxFb2lNcDZkNVg1UjZOSTE2UCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvY2F0ZWdvcmllcyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1777366295),
('uhQZv6lC4oaN5FFywso85d9ZmZ5VLTiBJKjn878C', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibmJ5TzR3QTJXQ1VLMm5vOGVRRXJQMGdxNG5BQzlGYmd3T283VU5VMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvc3RhdHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1777366295);

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bkash_number` varchar(20) DEFAULT NULL,
  `nagad_number` varchar(20) DEFAULT NULL,
  `cod_charge` decimal(10,2) NOT NULL DEFAULT 0.00,
  `bkash_discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `nagad_discount_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `bkash_number`, `nagad_number`, `cod_charge`, `bkash_discount_percent`, `nagad_discount_percent`, `created_at`, `updated_at`) VALUES
(1, '23235325343', '43534534534', 111.00, 1.00, 1.00, '2026-04-11 00:19:14', '2026-04-11 00:41:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'customer',
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `avatar`, `email_verified_at`, `password`, `role`, `phone`, `address`, `city`, `zip_code`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@luminabooks.com', NULL, NULL, '$2y$12$0FIMULzS8898WOaSposMdeQJ9mh2R/7p5mt6ZKsS5dCAYGNOSRua.', 'staff', '+1234567890', 'gfgregerg', 'dfbrbreg', 'sdvsdvsv', NULL, '2026-04-01 11:26:29', '2026-04-18 10:00:54'),
(2, 'John Doe', 'john@example.com', 'avatars/pKJFn79PKhjphvjcSSEP1J5A9ErEDs40Ld7hvjhJ.png', NULL, '$2y$12$Ag9jYvyH2RFKr1OPkTq4AusMDTulJCvc49//PiRe50Apwf9BDM5H.', 'customer', '35434534534', '123 Main St, New York, NY', 'dfsdfsdfs', 'dfsdfsdf', NULL, '2026-04-01 11:26:29', '2026-04-11 03:48:25'),
(4, 'HI', 'HW@gmail.com', NULL, NULL, '$2y$12$GSiKfBnxYYATrFFjhJA8neCzH6PicWfOnS3OEg05LkrfomHK1kI3W', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-02 11:10:00', '2026-04-02 11:10:00'),
(5, 'Updated Name', 'testuser@test.com', NULL, NULL, '$2y$12$JNghpYyXm82uLeGKH.csJuZqfapyjPO0cEt0aqQi4bxHE3gK8eT5C', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-02 12:13:32', '2026-04-02 12:15:43'),
(6, 'Rahim Ahmed', 'rahim.ahmed@email.com', NULL, NULL, '$2y$12$/UbWtr6/wFlgUg63b5CXP.CGucoDB3.oZJyuZHgfr7IiiLQIo6/ei', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-06 02:50:09', '2026-04-06 02:50:09'),
(7, 'Fatima Khan', 'fatima.khan@email.com', NULL, NULL, '$2y$12$whH6fl1Y5vAXhMrusneImeiXh0jXp.AcEP/Wq3A8b.yV158ZcPM6C', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-06 02:50:10', '2026-04-06 02:50:10'),
(8, 'Karim Hassan', 'karim.hassan@email.com', NULL, NULL, '$2y$12$IkZ88SIoIxTDu7oIgUKzyud4s5j8O75ghXuDfzOLs9F9vowq5s8aW', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-06 02:50:10', '2026-04-06 02:50:10'),
(9, 'Nadia Islam', 'nadia.islam@email.com', NULL, NULL, '$2y$12$TuNIyZh7uNGTZw9QTrOIIukb4Mrs0hMrxnnUvYlF5AQMkO713oziC', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-06 02:50:10', '2026-04-06 02:50:10'),
(10, 'Tariq Ali', 'tariq.ali@email.com', NULL, NULL, '$2y$12$V/neXmnlMdW0R.FD3vmkiuMy2h3a4FReKi7S9TqTBWU.oNRP9.q5O', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-06 02:50:10', '2026-04-06 02:50:10'),
(11, 'Jack', 'J@gmail.com', NULL, NULL, '$2y$12$Q1bcLn/lD4KApBFVmaF2aue6VTKJLBVBmAnYNLFknD66niIQNV.D6', 'customer', NULL, NULL, NULL, NULL, NULL, '2026-04-09 00:17:28', '2026-04-09 00:17:28'),
(12, 'Null', 'N@gmail.com', NULL, NULL, '$2y$12$ecXe.x35UJOP.ORVGkoTL.AnCPpucTTFQhbqIbSvFD/2qHSX81Tvy', 'customer', '34534534534', '34534534543ferg', 'sdvsdv', 'sdvsdv', NULL, '2026-04-09 03:00:03', '2026-04-12 04:56:06'),
(13, 'Alex', 'A@gmail.com', 'avatars/176BwcKqQmShX7O7SaDDI5PdNSJGYKHghjLYmgxJ.webp', NULL, '$2y$12$dxv8dalWJqtjo3cmOg0leeUktOVmDBXZh4uWn53d1XVfUGdo9CZ5e', 'customer', '23423423432', 'ffdfsvv111111', 'vfvf', 'fvfvfv', NULL, '2026-04-09 08:36:32', '2026-04-19 04:05:23'),
(14, 'Test User', 'testphone@test.com', NULL, NULL, '$2y$12$F8Y8Iw7F1qk1a99yIzrCm.X2o6sfgCLBqkY8dyyQkhCibWIXy3c5.', 'customer', '01712345678', NULL, NULL, NULL, NULL, '2026-04-11 01:24:51', '2026-04-11 01:24:51'),
(15, 'Elena Rodriguez', 'elena.r@email.com', 'avatars/user1.jpg', NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+1-555-0101', '45 Maple Avenue, Apt 2B', 'Springfield', '62704', NULL, '2026-04-12 04:00:00', '2026-04-12 04:00:00'),
(16, 'Marcus Chen', 'marcus.chen@email.com', 'avatars/user2.jpg', NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+1-555-0102', '789 Oak Drive', 'Riverside', '92501', NULL, '2026-04-12 04:05:00', '2026-04-12 04:05:00'),
(17, 'Sarah Jenkins', 'sarah.jenkins@email.com', NULL, NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+1-555-0103', '32 Pine Lane', 'Aurora', '80012', NULL, '2026-04-12 04:10:00', '2026-04-12 04:10:00'),
(18, 'David Okonkwo', 'david.okonkwo@email.com', 'avatars/user4.jpg', NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+44-20-7946-0104', '15 Elm Street', 'London', 'E1 6AN', NULL, '2026-04-12 04:15:00', '2026-04-12 04:15:00'),
(19, 'Priya Patel', 'priya.patel@email.com', NULL, NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+91-98765-43210', 'Sector 4, Block B', 'New Delhi', '110001', NULL, '2026-04-12 04:20:00', '2026-04-12 04:20:00'),
(20, 'Lucas Miller', 'lucas.miller@email.com', 'avatars/user6.jpg', NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+1-555-0106', '909 Birch Road', 'Austin', '73301', NULL, '2026-04-12 04:25:00', '2026-04-12 04:25:00'),
(21, 'Ananya Gupta', 'ananya.gupta@email.com', NULL, NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+91-98765-43211', 'Plot 22, Green Park', 'Mumbai', '400001', NULL, '2026-04-12 04:30:00', '2026-04-12 04:30:00'),
(22, 'James Wilson', 'james.wilson@email.com', 'avatars/user8.jpg', NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+1-555-0108', '67 Cedar Court', 'Denver', '80202', NULL, '2026-04-12 04:35:00', '2026-04-12 04:35:00'),
(23, 'Fatima Al-Mansoori', 'fatima.m@email.com', NULL, NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+971-50-123-4567', 'Villa 10, Marina District', 'Dubai', '00000', NULL, '2026-04-12 04:40:00', '2026-04-12 04:40:00'),
(24, 'Leo Rossi', 'leo.rossi@email.com', 'avatars/user10.jpg', NULL, '$2y$12$LJ3m4Nq8rX5yZ6w7V8bA9.eK2pL0m1nO3qR4sT5uV6w7X8y9Z0aB', 'customer', '+39-06-1234-5678', 'Via Roma 45', 'Rome', '00184', NULL, '2026-04-12 04:45:00', '2026-04-12 04:45:00'),
(25, 'Zacky', 'Z@gmailcom', NULL, NULL, '$2y$12$/1HDPTx7Sm8Mo2TKogNNOeXV3eZZi2rBA/pLh2rp9LT6DeQ57YIze', 'customer', '45333333333', 'regergerg', 'wvwrgw', 'ererger', NULL, '2026-04-18 05:55:12', '2026-04-18 06:34:08'),
(26, 'aaa', 'AAA@gm1ail.com', NULL, NULL, '$2y$12$VB.Mu4pD934vxKMnR8mcF.Iyac.egP2HLjrRO2JKbxHB571bVJici', 'customer', '24323423423', NULL, NULL, NULL, NULL, '2026-04-19 00:32:13', '2026-04-19 00:32:13'),
(27, 'Gal Belly', 'G@gmail.com', NULL, NULL, '$2y$12$XWnMJ.HtC5nNFv9qLXAcKOH55LRoJyLrPalVpPHxa9j3ALi1AO.lm', 'customer', '34534534534', 'fefwfwf', 'wfwefwef', 'wfwfwef', NULL, '2026-04-23 03:30:45', '2026-04-23 03:39:50');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `book_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `book_id`, `created_at`, `updated_at`) VALUES
(3, 2, 2, '2026-04-01 12:37:13', '2026-04-01 12:37:13'),
(11, 2, 23, '2026-04-02 10:36:12', '2026-04-02 10:36:12'),
(12, 4, 24, '2026-04-02 11:10:53', '2026-04-02 11:10:53'),
(13, 4, 19, '2026-04-02 11:10:53', '2026-04-02 11:10:53'),
(14, 5, 1, '2026-04-02 12:13:56', '2026-04-02 12:13:56'),
(22, 2, 78, '2026-04-08 08:58:09', '2026-04-08 08:58:09'),
(23, 2, 25, '2026-04-08 08:58:10', '2026-04-08 08:58:10'),
(25, 12, 26, '2026-04-09 04:06:46', '2026-04-09 04:06:46'),
(26, 12, 25, '2026-04-10 23:40:53', '2026-04-10 23:40:53'),
(28, 2, 79, '2026-04-12 00:49:53', '2026-04-12 00:49:53'),
(29, 2, 28, '2026-04-12 07:47:22', '2026-04-12 07:47:22'),
(34, 2, 90, '2026-04-12 08:00:23', '2026-04-12 08:00:23'),
(35, 2, 26, '2026-04-12 08:17:58', '2026-04-12 08:17:58'),
(40, 2, 96, '2026-04-15 04:03:12', '2026-04-15 04:03:12'),
(41, 2, 94, '2026-04-15 04:03:13', '2026-04-15 04:03:13'),
(42, 2, 97, '2026-04-15 04:11:25', '2026-04-15 04:11:25'),
(44, 12, 97, '2026-04-15 04:32:41', '2026-04-15 04:32:41'),
(45, 1, 97, '2026-04-15 04:55:02', '2026-04-15 04:55:02'),
(47, 25, 96, '2026-04-18 06:07:31', '2026-04-18 06:07:31'),
(48, 2, 110, '2026-04-23 03:29:45', '2026-04-23 03:29:45'),
(49, 27, 20, '2026-04-23 03:39:12', '2026-04-23 03:39:12'),
(51, 13, 114, '2026-04-23 07:20:20', '2026-04-23 07:20:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_pages`
--
ALTER TABLE `about_pages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `books_status_index` (`status`),
  ADD KEY `books_stock_index` (`stock`),
  ADD KEY `books_is_featured_index` (`is_featured`),
  ADD KEY `books_category_id_index` (`category_id`),
  ADD KEY `books_created_at_index` (`created_at`),
  ADD KEY `books_status_created_at_index` (`status`,`created_at`);
ALTER TABLE `books` ADD FULLTEXT KEY `books_search_index` (`title`,`author`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_items_user_id_book_id_unique` (`user_id`,`book_id`),
  ADD UNIQUE KEY `cart_items_user_id_course_id_unique` (`user_id`,`course_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `courses_slug_unique` (`slug`);

--
-- Indexes for table `course_lessons`
--
ALTER TABLE `course_lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_lessons_section_id_foreign` (`section_id`);

--
-- Indexes for table `course_levels`
--
ALTER TABLE `course_levels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_levels_slug_unique` (`slug`);

--
-- Indexes for table `course_progress`
--
ALTER TABLE `course_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_progress_user_id_foreign` (`user_id`),
  ADD KEY `course_progress_course_id_foreign` (`course_id`),
  ADD KEY `course_progress_lesson_id_foreign` (`lesson_id`),
  ADD KEY `course_progress_quiz_id_foreign` (`quiz_id`);

--
-- Indexes for table `course_questions`
--
ALTER TABLE `course_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_questions_course_id_foreign` (`course_id`),
  ADD KEY `course_questions_user_id_foreign` (`user_id`);

--
-- Indexes for table `course_quizzes`
--
ALTER TABLE `course_quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_quizzes_course_id_foreign` (`course_id`),
  ADD KEY `course_quizzes_lesson_id_foreign` (`lesson_id`);

--
-- Indexes for table `course_quiz_questions`
--
ALTER TABLE `course_quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_quiz_questions_quiz_id_foreign` (`quiz_id`);

--
-- Indexes for table `course_resources`
--
ALTER TABLE `course_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_resources_lesson_id_foreign` (`lesson_id`),
  ADD KEY `course_resources_course_id_foreign` (`course_id`);

--
-- Indexes for table `course_reviews`
--
ALTER TABLE `course_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_reviews_course_id_foreign` (`course_id`),
  ADD KEY `course_reviews_user_id_foreign` (`user_id`);

--
-- Indexes for table `course_sections`
--
ALTER TABLE `course_sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_sections_course_id_foreign` (`course_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `gallery_photos`
--
ALTER TABLE `gallery_photos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `idx_user_id_created_at` (`user_id`,`created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_book_id` (`book_id`),
  ADD KEY `order_items_course_id_foreign` (`course_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `promo_codes`
--
ALTER TABLE `promo_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promo_codes_code_unique` (`code`);

--
-- Indexes for table `promo_code_usages`
--
ALTER TABLE `promo_code_usages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promo_code_usages_promo_code_id_user_id_unique` (`promo_code_id`,`user_id`),
  ADD KEY `promo_code_usages_user_id_foreign` (`user_id`),
  ADD KEY `promo_code_usages_order_id_foreign` (`order_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_book_id_index` (`book_id`),
  ADD KEY `questions_user_id_index` (`user_id`),
  ADD KEY `questions_is_answered_index` (`is_answered`),
  ADD KEY `questions_created_at_index` (`created_at`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_book_id_foreign` (`book_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlists_user_id_book_id_unique` (`user_id`,`book_id`),
  ADD KEY `wishlists_book_id_foreign` (`book_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_pages`
--
ALTER TABLE `about_pages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `course_lessons`
--
ALTER TABLE `course_lessons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=313;

--
-- AUTO_INCREMENT for table `course_levels`
--
ALTER TABLE `course_levels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `course_progress`
--
ALTER TABLE `course_progress`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `course_questions`
--
ALTER TABLE `course_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `course_quizzes`
--
ALTER TABLE `course_quizzes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=208;

--
-- AUTO_INCREMENT for table `course_quiz_questions`
--
ALTER TABLE `course_quiz_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=850;

--
-- AUTO_INCREMENT for table `course_resources`
--
ALTER TABLE `course_resources`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=781;

--
-- AUTO_INCREMENT for table `course_reviews`
--
ALTER TABLE `course_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `course_sections`
--
ALTER TABLE `course_sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery_photos`
--
ALTER TABLE `gallery_photos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=241;

--
-- AUTO_INCREMENT for table `promo_codes`
--
ALTER TABLE `promo_codes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `promo_code_usages`
--
ALTER TABLE `promo_code_usages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_lessons`
--
ALTER TABLE `course_lessons`
  ADD CONSTRAINT `course_lessons_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_progress`
--
ALTER TABLE `course_progress`
  ADD CONSTRAINT `course_progress_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_progress_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `course_lessons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_progress_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `course_quizzes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_progress_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_questions`
--
ALTER TABLE `course_questions`
  ADD CONSTRAINT `course_questions_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_questions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `course_quizzes`
--
ALTER TABLE `course_quizzes`
  ADD CONSTRAINT `course_quizzes_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_quizzes_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `course_lessons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_quiz_questions`
--
ALTER TABLE `course_quiz_questions`
  ADD CONSTRAINT `course_quiz_questions_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `course_quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_resources`
--
ALTER TABLE `course_resources`
  ADD CONSTRAINT `course_resources_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_resources_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `course_lessons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_reviews`
--
ALTER TABLE `course_reviews`
  ADD CONSTRAINT `course_reviews_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `course_sections`
--
ALTER TABLE `course_sections`
  ADD CONSTRAINT `course_sections_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `promo_code_usages`
--
ALTER TABLE `promo_code_usages`
  ADD CONSTRAINT `promo_code_usages_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promo_code_usages_promo_code_id_foreign` FOREIGN KEY (`promo_code_id`) REFERENCES `promo_codes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `promo_code_usages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `questions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
