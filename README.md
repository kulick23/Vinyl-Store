🎧 Project Description
We are developing a platform for buying and selling vinyl records — similar to Discogs, but with a modern design and a strong focus on usability for both collectors and casual users.

1. Market & Audience Analysis
The vinyl market is steadily growing, especially among audiophiles, collectors, and fans of analog sound.

Our target audience includes men and women aged 25–45 who are willing to pay for rare releases, quality service, and a user-friendly experience.

There is strong monetization potential through:

sales commissions,

subscription models,

and featured collections/promotions.

2. Business Goals
Launch an online marketplace for listing, buying, and selling vinyl records.

Improve access to vinyl across CIS countries.

Become the #1 vinyl sales platform in the region within 2 years.

3. Core Functionality
User registration, authentication, and personal accounts.

Search and filtering by genre, artist, release year, and price.

Product detail pages with comprehensive information.

Order processing and purchase history.

Seller and buyer profile management.

4. Non-Functional Requirements
Scalability (ability to handle increasing traffic).

Secure data storage.

Intuitive, mobile-friendly, and responsive UI.

Integration with payment systems and third-party APIs (e.g., shipping).

5. Competitor Analysis
Unlike Discogs or Avito, our focus is on:

minimalist, user-friendly interface,

localization for the CIS market,

seller support,

and a smooth experience for collectors.

Key advantages: simplicity, speed, and strong mobile UX.

6. North Star & KPIs
North Star Metric: number of successful transactions.

KPIs:

number of registered users,

average order value,

number of new vinyl listings,

and customer retention rate (repeat purchases).

7. Risks & Mitigation
Low initial traffic → target niche communities and leverage social media marketing.

Strong competition from larger platforms → focus on UX, local support, and community building.

🗄️ Database Overview
We use PostgreSQL as the primary relational database. The schema includes 7 main tables:

Customer — user data (buyers/sellers).

VinylRecord — record listings with title, year, genre, artist, and price.

Order / OrderItem — purchase and shopping cart data.

Artist / Genre — reference data for cataloging.

EFMigrationsHistory — system table used by Entity Framework for migration tracking.

The database supports:

User authentication and authorization.

Order management and cart functionality.

Analytics across users, artists, genres, and sales.





🗄️ Database Overview
This is a relational database schema designed for an online vinyl record marketplace. It supports user management, product listings, order processing, and categorization.

📊 Tables and Relationships
Customer
Stores user information (buyers and sellers).

Id — Primary key

FirstName, LastName — User names

Email, Phone, Password — Contact & auth info

Role — Can define user type (e.g., admin, buyer, seller)

🔗 One-to-many: A customer can place many orders.

Order
Represents an order placed by a user.

Id — Primary key

OrderDate — Timestamp of when the order was placed

CustomerId — Foreign key to Customer

🔗 One-to-many: An order can contain multiple items (OrderItem).

OrderItem
Line items within an order.

Id — Primary key

OrderId — Foreign key to Order

VinylRecordId — Foreign key to VinylRecord

Quantity — Number of copies ordered

Price — Final price at the moment of purchase

VinylRecord
Core entity — a listed vinyl record for sale.

Id — Primary key

Title — Record name

Year — Release year

ArtistId — Foreign key to Artist

GenreId — Foreign key to Genre

Price — Listed price

🔗 Many-to-one with Artist and Genre

Artist
Reference table for musical artists.

Id — Primary key

Name — Artist name

🔗 One-to-many: One artist can have many records.

Genre
Reference table for genres (e.g., Rock, Jazz).

Id — Primary key

Name — Genre name

🔗 One-to-many: One genre can include many records.

__EFMigrationsHistory
Technical table used by Entity Framework to track applied migrations. Not part of business logic.

📌 Key Notes:
Fully normalized design (no data duplication).

Designed for scalability: supports multiple users, orders, and products.

Suitable for analytics (e.g., sales per artist, popular genres).

Supports secure authentication & order tracking.



![image](https://github.com/user-attachments/assets/28b72dcb-b4b9-4cf7-822e-48e74ffbcaf8)
