CREATE TABLE users (user_id serial PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), salt VARCHAR(255), email VARCHAR(255), type VARCHAR(255), status VARCHAR(255), info VARCHAR(255));

CREATE TABLE timing (time_id serial PRIMARY KEY, user_id integer REFERENCES users(user_id), start_time VARCHAR(255), end_time VARCHAR(255), total_time VARCHAR(255), date VARCHAR(255) , the_day VARCHAR(255));

CREATE TABLE leaving (leave_id serial PRIMARY KEY, user_id integer REFERENCES users(user_id), time_type VARCHAR(255), type VARCHAR(255), from_date VARCHAR(255), to_date VARCHAR(255), description VARCHAR(255), request_time VARCHAR(255), status VARCHAR(255), result VARCHAR(255), answer_time VARCHAR(255), the_name VARCHAR(255));

INSERT INTO users(username, password, salt,  email, type, status, info) VALUES ('aradadmin', '3ea7d8fd2b62580af41fc8185e8e26618cc67b7cb34eceffc25ee68092ce913529cab808191b3a8b53c144340c5668fabf1afc4ea56dce1ae53561f806607542', '02ea2edc50774b7b', 'attendance@araddata.com', 'admin', 'off', 'admin');