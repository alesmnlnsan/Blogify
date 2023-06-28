CREATE DATABASE blog_app;

-- TABLES
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    content TEXT, 
    author_id INTEGER,
    publication_date TIMESTAMP,
    updated_date TIMESTAMP,
    image_url TEXT,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_digest TEXT,
    pronouns TEXT
);

CREATE TABLE todos (
    task_id SERIAL PRIMARY KEY,
    task VARCHAR(300) NOT NULL,
    complete BOOLEAN DEFAULT FALSE
);

-- USERS DATA
INSERT INTO users (user_id, username, email, password_digest, pronouns)
VALUES (1, 'JaneDoe', 'janedoe@example.com', 'password', 'she/her');

-- POSTS DATA
INSERT INTO posts (post_id, title, content, author_id, publication_date, updated_date, image_url)
VALUES (1, 'Blog Introduction', 'This is the content to my first post!', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'https://i.pinimg.com/236x/7d/12/b0/7d12b00ab44ee4699f17089afee64a2d--phone-wallpapers.jpg');

INSERT INTO posts (post_id, title, content, author_id, publication_date, updated_date, image_url)
VALUES (2, 'The Art of Coding', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'https://i.pinimg.com/236x/7d/12/b0/7d12b00ab44ee4699f17089afee64a2d--phone-wallpapers.jpg');
