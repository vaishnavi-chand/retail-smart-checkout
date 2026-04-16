CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (id, name, price) VALUES
(1, 'Apple', 1.00),
(2, 'Banana', 0.50),
(3, 'Orange', 0.75),
(4, 'Milk', 2.50),
(5, 'Bread', 2.00);