-- LAST UPDATED: 27-11-2024
-- REMOVE MIDDLE NAME NOT NULL CONSTRAINT IN TABLE: USER_LOCALIZED
ALTER TABLE user_localized ALTER COLUMN middle_name DROP NOT NULL
ALTER TABLE user_localized ALTER COLUMN user_phone_number DROP NOT NULL
ALTER TABLE user_localized ALTER COLUMN date_of_birth DROP NOT NULL
ALTER TABLE user_localized DROP COLUMN user_pass_salt
ALTER TABLE user_localized ALTER COLUMN date_of_birth SET DEFAULT '1970-01-01';
ALTER TABLE user_localized ALTER COLUMN middle_name SET DEFAULT '';
ALTER TABLE user_localized ALTER COLUMN user_phone_number SET DEFAULT NULL;
----------------------------------
DROP TRIGGER before_update_userpass ON user_localized;
CREATE TRIGGER before_update_userpass 
BEFORE UPDATE ON user_localized
FOR EACH ROW
WHEN ( 
    NEW.is_pass_change IS NOT NULL AND NEW.is_pass_change = TRUE
)
EXECUTE FUNCTION insert_salt_user_password();
----------------------------------
ALTER TABLE supplier ALTER COLUMN supplier_tax_identification_num DROP NOT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_iban DROP NOT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_tax_identification_num SET DEFAULT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_iban SET DEFAULT NULL;
ALTER TABLE supplier ALTER COLUMN supplier_bank_account_num SET DEFAULT NULL;

ALTER TABLE retailer ALTER COLUMN retailer_tax_identification_num DROP NOT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_iban DROP NOT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_tax_identification_num SET DEFAULT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_iban SET DEFAULT NULL;
ALTER TABLE retailer ALTER COLUMN retailer_bank_account_num SET DEFAULT NULL;

ALTER TABLE establishment ALTER COLUMN establishment_registration_date DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN commercial_registration_num DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_email DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_city DROP NOT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_registration_date SET DEFAULT NULL;
ALTER TABLE establishment ALTER COLUMN commercial_registration_num SET DEFAULT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_email SET DEFAULT NULL;
ALTER TABLE establishment ALTER COLUMN establishment_city SET DEFAULT NULL;
----------------------------------------------------------------------------------------
drop function user_insert;
drop function user_update;
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
------------------------------------------------------------------------------------
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
------------------------------------------------------------------------------------
-- PLUS APPLICATION.SQL FILE
-- VALIDATE USER LOGIN
DROP FUNCTION validate_user_login;
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
	WHERE (CAST(D.user_name_lclzd AS VARCHAR) = in_user_name  OR CAST(D.user_email AS VARCHAR) = in_user_email)  INTO salted_pass, v_user_id, v_user_type;
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
-----------------------------------------------------------------------------
ALTER TABLE user_localized
ADD COLUMN reset_password_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_password_expires TIMESTAMP DEFAULT NULL;
-----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION insert_salt_user_password()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	NEW.user_password = (SELECT crypt(NEW.user_password, gen_salt('md5'))) ;
	NEW.is_pass_change = FALSE;
	RETURN NEW;
END;
$$

------------------------------------------------
-- 02-12-2024
alter table retailstore drop constraint fk_retailstore_owner_id;
alter table retailstore add constraint fk_retailstore_owner_id foreign key (owner_id)
references retailer(retailer_id);
------------------------------------------------
-- GET Owned Factories Industry Type Categories
CREATE OR REPLACE FUNCTION retailstore_categories_get (
	retailstore_est_id           BIGINT
)
RETURNS TABLE(		
	out_category_id INTEGER,
	out_category_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
	SELECT category_id, category_name
	FROM  category WHERE  industry_type =  ANY(SELECT industry_type_id FROM retailstore_industry_get(retailstore_est_id));
END;
$$ LANGUAGE plpgsql;
-- GET Owned Factories
CREATE OR REPLACE FUNCTION retailstore_owned_get (
	IN in_owner_id BIGINT
)
RETURNS TABLE(		
	retailstore_est_id           BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	f.retailstore_est_id
	FROM retailstore f WHERE f.owner_id = in_owner_id;
END;
$$ LANGUAGE plpgsql;
