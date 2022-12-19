CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    kakao_talk_chatting_url VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,

    CONSTRAINT usernameUnique UNIQUE(username),
    CONSTRAINT kakaoTalkChattingUrlCheck CHECK(kakao_talk_chatting_url LIKE 'https://open.kakao.com/%')
);

CREATE TABLE Address (
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    trade_status VARCHAR(255) DEFAULT 'BEFORE',
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    img_name VARCHAR(255) DEFAULT NULL,
    img_url VARCHAR(255) DEFAULT NULL,

    CONSTRAINT purposeCheck CHECK(purpose IN ('SHARE','WANT')),
    CONSTRAINT categoryCheck CHECK(category IN ('CLOTH','THINGS','BOOK','LIVE_THINGS','BABY_THINGS','EXPERIENCE')),
    CONSTRAINT tradeStatusCheck CHECK(trade_status IN ('BEFORE','AFTER')),

    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);