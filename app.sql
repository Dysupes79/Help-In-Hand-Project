CREATE DATABASE mentalHelp;

CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE sessions (
    userId INT(11) NOT NULL,
    token VARCHAR(255) NOT NULL
);