create table users
(
    user_id            serial
        primary key,
    user_email         varchar(255) not null
        constraint users_email_key
            unique,
    user_password_hash varchar(255) not null,
    user_phone_number  varchar(20),
    user_gender        varchar(10)
        constraint users_gender_check
            check ((user_gender)::text = ANY
                   (ARRAY [('Male'::character varying)::text, ('Female'::character varying)::text])),
    user_first_name    varchar(255),
    user_last_name     varchar(255),
    created_at         timestamp default CURRENT_TIMESTAMP,
    updated_at         timestamp default CURRENT_TIMESTAMP
);