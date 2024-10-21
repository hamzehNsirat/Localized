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
/*
User Indexes / Triggers
*/

-- User National Number Index
-- to optimize the Retrieval Based on a given User's National Number
CREATE INDEX  idx_user_national_num ON user_localized(national_number);

-- User National Number Index
-- to optimize the Retrieval Based on a given User's Status
CREATE INDEX  idx_fk_user_status ON user_localized(user_status);

-- User National Number Index
-- to optimize the Retrieval Based on a given User's Email
CREATE INDEX  idx_user_email ON user_localized(user_email);

-- User Password Hash Trigger
-- to secure user entered password
CREATE OR REPLACE FUNCTION insert_salt_user_password()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN			
	NEW.password = (SELECT crypt(NEW.user_password, gen_salt('md5'))) ;
	RETURN NEW;
END;
$$

CREATE TRIGGER before_insert_userpass
BEFORE INSERT ON user_localized
FOR EACH ROW
EXECUTE FUNCTION insert_salt_user_password();

CREATE TRIGGER before_update_userpass
BEFORE INSERT ON user_localized
FOR EACH ROW
EXECUTE FUNCTION insert_salt_user_password();