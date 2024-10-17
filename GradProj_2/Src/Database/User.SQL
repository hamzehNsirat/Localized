-- TABLE: User
-- TYPE: Main

CREATE TABLE user_localized ( 
	user_id SERIAL PRIMARY KEY,
	national_number    BIGINT UNIQUE,
	user_type    BIGINT,
	user_status  BIGINT,
	first_name VARCHAR(35) NOT NULL,
	middle_name VARCHAR(35) NOT NULL,
	last_name VARCHAR(35) NOT NULL,
	date_of_birth  DATE NOT NULL,
	user_name VARCHAR(35) NOT NULL UNIQUE,
	user_address TEXT DEFAULT NULL,
	user_email VARCHAR(254) NOT NULL UNIQUE,
	user_password  VARCHAR(100) NOT NULL,
	user_pass_salt VARCHAR(22) NOT NULL,
	is_email_verified BOOLEAN NOT NULL,
	user_phone_number VARCHAR(15) NOT NULL UNIQUE,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_user_status FOREIGN KEY (user_status)
    REFERENCES user_status(user_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_user_type FOREIGN KEY (user_type)
    REFERENCES user_type(user_type_id) ON DELETE SET NULL ON UPDATE CASCADE
);
