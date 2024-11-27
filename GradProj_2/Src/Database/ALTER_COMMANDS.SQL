-- LAST UPDATED: 27-11-2024
-- REMOVE MIDDLE NAME NOT NULL CONSTRAINT IN TABLE: USER_LOCALIZED
ALTER TABLE user_localized ALTER COLUMN middle_name DROP NOT NULL
ALTER TABLE user_localized ALTER COLUMN user_phone_number DROP NOT NULL
ALTER TABLE user_localized ALTER COLUMN date_of_birth DROP NOT NULL
ALTER TABLE user_localized DROP COLUMN user_pass_salt
--
DROP FUNCTION user_update
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
	IN in_user_pass_salt VARCHAR,
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
----------------------------------