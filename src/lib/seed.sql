-- =========================================
-- ROLES TABLE
-- =========================================
create table roles (
    id serial primary key,
    name text unique not null
);

-- Insert default roles
insert into roles (name)
values
('owner'),
('admin'),
('moderator'),
('user'),
('suspended'),
('banned');

-- =========================================
-- USERS TABLE
-- =========================================
create table users (
id bigserial primary key,
email text unique not null,
password text not null, -- hashed password
username text unique not null check (char_length(username) between 1 and 32),
role int references roles(id) on delete set null,
suspended_until timestamp null,
-- avatar text, -- optional, enable later
created_at timestamp default now()
);

-- =========================================
-- POSTS TABLE
-- =========================================
create table posts (
id bigserial primary key,
content text not null check (char_length(content) between 1 and 400),
author bigint references users(id) on delete cascade,
likes int default 0,
reposts int default 0,
comments int default 0,
created_at timestamp default now()
);

-- =========================================
-- COMMENTS TABLE
-- =========================================
create table comments (
id bigserial primary key,
content text not null check (char_length(content) between 1 and 200),
post bigint references posts(id) on delete cascade,
"user" bigint references users(id) on delete cascade,
created_at timestamp default now()
);

-- =========================================
-- LIKES TABLE
-- =========================================
create table likes (
id bigserial primary key,
post bigint references posts(id) on delete cascade,
"user" bigint references users(id) on delete cascade,
created_at timestamp default now(),
unique (post, "user")
);

-- =========================================
-- REPOSTS TABLE
-- =========================================
create table reposts (
id bigserial primary key,
post bigint references posts(id) on delete cascade,
"user" bigint references users(id) on delete cascade,
created_at timestamp default now(),
unique (post, "user")
);

-- =========================================
-- SAMPLE DATA (OPTIONAL)
-- =========================================