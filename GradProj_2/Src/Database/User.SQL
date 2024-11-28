-- TABLE: User
-- TYPE: Main

CREATE TABLE user_localized ( 
	user_id SERIAL PRIMARY KEY,
	national_number    BIGINT UNIQUE,
	user_type    BIGINT,
	user_status  BIGINT,
	first_name VARCHAR(35) NOT NULL,
	middle_name VARCHAR(35) ,
	last_name VARCHAR(35) NOT NULL,
	date_of_birth  DATE ,
	user_name VARCHAR(35) NOT NULL UNIQUE,
	user_address TEXT DEFAULT NULL,
	user_email VARCHAR(254) NOT NULL UNIQUE,
	user_password  VARCHAR(100) NOT NULL,
	is_email_verified BOOLEAN NOT NULL,
	user_phone_number VARCHAR(15)  UNIQUE,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	user_image BYTEA DEFAULT NULL,
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

-- User Phone Number Index
-- to optimize the Retrieval Based on a given User's Phone Number
CREATE INDEX  idx_user_phone ON user_localized(user_phone_number);

-- User Password Hash Trigger
-- to secure user entered password
CREATE OR REPLACE FUNCTION insert_salt_user_password()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	NEW.user_password = (SELECT crypt(NEW.user_password, gen_salt('md5'))) ;
	RETURN NEW;
END;
$$

CREATE TRIGGER before_insert_userpass
BEFORE INSERT ON user_localized
FOR EACH ROW
EXECUTE FUNCTION insert_salt_user_password();
 
CREATE TRIGGER before_update_userpass 
BEFORE UPDATE ON user_localized
FOR EACH ROW
WHEN ( 
    NEW.is_pass_change IS NOT NULL AND NEW.is_pass_change = TRUE
)
EXECUTE FUNCTION insert_salt_user_password();


/*
User CRUD Functions
*/
-- GET A User BY ID
CREATE OR REPLACE FUNCTION user_get_by_id(IN in_user_id BIGINT)
RETURNS TABLE(		
		national_number BIGINT,
		user_type    	BIGINT,
		user_status  	BIGINT,
		first_name 		VARCHAR,
		middle_name 	VARCHAR,
		last_name 		VARCHAR,
		date_of_birth  	DATE,
		user_name 		VARCHAR,
		user_address 	TEXT,
		user_email 		VARCHAR,
		is_email_verified BOOLEAN,
		user_phone_number VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		D.national_number,
		D.user_type,
		D.user_status,
		D.first_name,
		D.middle_name,
		D.last_name,
		D.date_of_birth,
		D.user_name_lclzd,
		D.user_address,
		D.user_email,
		D.is_email_verified,
		D.user_phone_number
	FROM user_localized AS D
	WHERE CAST(D.user_id AS BIGINT) = in_user_id;
END;
$$ LANGUAGE plpgsql;
-- VALIDATE USER LOGIN
CREATE OR REPLACE FUNCTION validate_user_login (
		IN in_user_name 		VARCHAR,
		IN in_user_email 		VARCHAR,
		IN in_user_pass 		VARCHAR
)
RETURNS TABLE(		
		out_user_id		 BIGINT,
		out_user_type    BIGINT,
		out_is_valid    INTEGER
) AS $$
DECLARE salted_pass VARCHAR; 
DECLARE v_user_id BIGINT;
DECLARE v_user_type BIGINT;
DECLARE v_user_name VARCHAR;
DECLARE v_user_email VARCHAR;
DECLARE check_state BOOLEAN;
BEGIN

	SELECT user_password, user_id, user_type
	FROM user_localized D
	WHERE CAST(D.user_name_lclzd AS VARCHAR) = in_user_name  AND CAST(D.user_email AS VARCHAR) = in_user_email  INTO salted_pass, v_user_id, v_user_type;
	IF salted_pass IS NULL THEN 
		v_user_id := 0;
		v_user_type := 0;
		RETURN QUERY SELECT  v_user_id,v_user_type, 0;
	END IF;
	check_state = (SELECT  (salted_pass = crypt(in_user_pass, salted_pass)));
	IF check_state = TRUE THEN 
		RETURN QUERY SELECT v_user_id,v_user_type, 1;
	ELSE 
		RETURN QUERY  SELECT v_user_id,v_user_type, 0;
	END IF;
END;
$$ LANGUAGE plpgsql;
-- INSERT A User
CREATE OR REPLACE FUNCTION user_insert (
	IN in_national_number   BIGINT,
	IN in_user_type    BIGINT,
	IN in_user_status  BIGINT,
	IN in_first_name   VARCHAR,
	IN in_middle_name 	VARCHAR,
	IN in_last_name	VARCHAR,
	IN in_date_of_birth  DATE,
	IN in_user_name 	  VARCHAR,
	IN in_user_address 	TEXT ,
	IN in_user_email 	  VARCHAR,
	IN in_user_password  VARCHAR,
	IN in_is_email_verified BOOLEAN,
	IN in_user_phone_number VARCHAR,
	IN in_last_modified_by	 BIGINT,
	IN in_image BYTEA,
	OUT out_user_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO user_localized 
	(	
	national_number,
	user_type,
	user_status,
	first_name,
	middle_name,
	last_name,
	date_of_birth,
	user_name_lclzd 	 ,
	user_address ,
	user_email 	 ,
	user_password,
	is_email_verified,
	user_phone_number,
	last_modification_date,
	last_modified_by,
	user_image
	)
	VALUES
	(
	in_national_number,
	in_user_type,
	in_user_status,
	in_first_name,
	in_middle_name,
	in_last_name,
	in_date_of_birth,
	in_user_name,
	in_user_address ,
	in_user_email ,
	in_user_password,
	in_is_email_verified,
	in_user_phone_number,
	CURRENT_TIMESTAMP,
	in_last_modified_by,
	in_image
	) RETURNING CAST(user_id AS BIGINT) INTO out_user_id;

EXCEPTION WHEN OTHERS THEN 
	out_user_id := -1;	
END;
$$ LANGUAGE plpgsql;

-- UPDATE A User
CREATE OR REPLACE FUNCTION user_update (
	IN in_national_number   BIGINT,
	IN in_user_type    BIGINT,
	IN in_user_status  BIGINT,
	IN in_first_name   VARCHAR,
	IN in_middle_name 	VARCHAR,
	IN in_last_name	VARCHAR,
	IN in_date_of_birth  DATE,
	IN in_user_name 	  VARCHAR,
	IN in_user_address 	TEXT ,
	IN in_user_email 	  VARCHAR,
	IN in_user_password  VARCHAR,
	IN in_is_email_verified BOOLEAN,
	IN in_user_phone_number VARCHAR,
	IN in_last_modified_by	 BIGINT,
	IN in_user_image BYTEA,
	IN in_user_id BIGINT,
	IN in_is_pass_change BOOLEAN,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE user_localized 
	SET	
	national_number=	COALESCE(in_national_number, national_number),
	user_status=	COALESCE(in_user_status, user_status),
	first_name=	COALESCE(in_first_name, first_name),
	middle_name=	COALESCE(in_middle_name, middle_name),
	last_name=	COALESCE(in_last_name, last_name),
	date_of_birth=	COALESCE(in_date_of_birth, date_of_birth),
	user_address =	COALESCE(in_user_address, user_address) ,
	user_email 	 =	COALESCE(in_user_email, user_email) ,
	user_password =	COALESCE(in_user_password, user_password),
	is_email_verified =  	COALESCE(in_is_email_verified, is_email_verified),

	user_phone_number = 	COALESCE(in_user_phone_number, user_phone_number),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by),
	user_image = COALESCE(in_user_image, user_image),
	is_pass_change = COALESCE(in_is_pass_change, is_pass_change)
	WHERE CAST(user_id AS BIGINT) = in_user_id;
	update_res := 0;	

EXCEPTION WHEN OTHERS THEN 
	update_res := -1;	

END;
$$ LANGUAGE plpgsql;


-- DELETE A User
CREATE OR REPLACE FUNCTION user_delete (
	IN in_user_id BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE user_localized 
	SET	
	user_status = (SELECT user_status_id FROM user_status WHERE user_status LIKE '%INACTIVE%'),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)

	WHERE CAST(user_id AS BIGINT) = in_user_id;
	update_res := 0;	

EXCEPTION WHEN OTHERS THEN 
	update_res := -1;	
END;
$$ LANGUAGE plpgsql;


-- UPDATE A UserStatus By Admin
CREATE OR REPLACE FUNCTION user_update_status (
	IN in_user_status  BIGINT,
	IN in_user_id BIGINT,
	IN in_last_modified_by BIGINT,
	OUT update_res INT
)
RETURNS INT AS $$
BEGIN
    UPDATE user_localized 
	SET	
	user_status		=	COALESCE(in_user_status, user_status),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by =	COALESCE(in_last_modified_by, last_modified_by)
	WHERE CAST(user_id AS BIGINT) = in_user_id;
	update_res := 0;	

EXCEPTION WHEN OTHERS THEN 
	update_res := -1;	

END;
$$ LANGUAGE plpgsql;