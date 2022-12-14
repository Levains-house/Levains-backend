CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    kakao_talk_chatting_url VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL

    CONSTRAINT usernameUnique UNIQUE(username)
);

CREATE TABLE Address (
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
)

CREATE TABLE Items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_type VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    trade_status VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    img_name VARCHAR(255) NOT NULL,
    img_url VARCHAR(255) NOT NULL

    FOREIGN KEY (user_id) REFERENCES users (user_id)
);