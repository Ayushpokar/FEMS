CREATE DATABASE IF NOT EXISTS fems;
CREATE SCHEMA IF NOT EXISTS fems; 

-- Faculty Table created
CREATE TABLE IF NOT EXISTS fems.tbl_users(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50),
    user_email VARCHAR(50),
    user_mobile VARCHAR(20),
    user_role VARCHAR(20),
    user_department VARCHAR(20),
    user_password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)       

CREATE TABLE IF NOT EXISTS fems.tbl_events(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    descrp TEXT,
    venue VARCHAR(100),
    category VARCHAR(50),
    mode_of_event VARCHAR(20),
    registration_fee int DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    total_cost int,
    audience_size int,
    brochureurl VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

--Guest Table 
CREATE TABLE IF NOT EXISTS fems.tbl_guest(  
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50),
    mobile VARCHAR(20),
    company VARCHAR(50),
    designation VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
INSERT into fems.tbl_guest(id,name) VALUES(0, 'No Guest')


--Volunteer Details
CREATE TABLE IF NOT EXISTS fems.tbl_volunteer(
	id SERIAL PRIMARY KEY,
    register_number varchar(20) UNIQUE,
    name VARCHAR(50),
    email VARCHAR(50),
    mobile VARCHAR(20),
    department VARCHAR(20)
)

--Volunteer Group Details
CREATE TABLE IF NOT EXISTS fems.tbl_volunteer_group(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    register_number VARCHAR(20) REFERENCES fems.tbl_volunteer(register_number)
)

INSERT INTO fems.tbl_volunteer_group VALUES(null,'No Group',null);

CREATE TABLE IF NOT EXISTS fems.tbl_event_details(
    id SERIAL PRIMARY KEY,
    event_id int REFERENCES fems.tbl_events,
    guest_id int REFERENCES fems.tbl_guest,
    user_id int REFERENCES fems.tbl_users,
    group_id int REFERENCES fems.tbl_volunteer_group
)

CREATE TABLE IF NOT EXISTS fems.tbl_participate(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    mobile VARCHAR(20),
    employment_status VARCHAR(30),
    organisation_name VARCHAR(100),
    city VARCHAR(20)
)

CREATE TABLE IF NOT EXISTS fems.tbl_participate_master(
    id SERIAL PRIMARY KEY,
    participate_id int REFERENCES fems.tbl_participate,
    event_id int REFERENCES fems.tbl_events(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS fems.tbl_event_status(
    id SERIAL PRIMARY KEY,
    event_id int REFERENCES fems.tbl_events(id),
    user_id int REFERENCES fems.tbl_users(id),
    status VARCHAR(50) DEFAULT 'created',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

    