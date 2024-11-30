CREATE TABLE application ( 
    application_id SERIAL PRIMARY KEY,
    application_status VARCHAR,
	user_first_name VARCHAR(35) NOT NULL,
	user_last_name VARCHAR(35) NOT NULL,
	user_name VARCHAR(35) NOT NULL,
	user_email VARCHAR(254) NOT NULL,
	user_password  VARCHAR(100) NOT NULL,
	user_phone_number VARCHAR(15),
	establishment_name TEXT,
	establishment_contact_number VARCHAR(15),
	establishment_email VARCHAR(254) NOT NULL,
	establishment_description TEXT NOT NULL,
	establishment_commercial_registration_num BIGINT NOT NULL,
	establishment_city VARCHAR(254) NOT NULL,
	establishment_street VARCHAR(254) NOT NULL,
	establishment_building_num VARCHAR(15) NOT NULL,
	establishment_industry_type_spec    BIGINT[] NOT NULL,
	establishment_logo       BYTEA,
	creation_date  TIMESTAMP NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	user_type		         INTEGER   NOT NULL,
    CONSTRAINT chk_app_status CHECK(application_status IN('NEW', 'APPROVED', 'REJECTED'))
);
-- GET ALL APPLICATIONS
CREATE OR REPLACE FUNCTION application_get_all(IN page_size INTEGER, IN page_index INTEGER)
RETURNS TABLE(	
		out_application_id BIGINT,
		out_establishment_name TEXT,
		out_establishment_logo       BYTEA,
		out_application_status    VARCHAR
) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(application_id AS BIGINT),
		establishment_name,
		establishment_logo,
		application_status
	FROM application
    ORDER BY application_id DESC
	LIMIT page_size
	OFFSET ((page_index - 1) * page_size) ;
END;
$$ LANGUAGE plpgsql;

-- GET APPLICATION DATA
CREATE OR REPLACE FUNCTION application_get_by_id(IN in_application_id BIGINT)
RETURNS TABLE(	
        out_application_id BIGINT,
        out_user_first_name VARCHAR,
        out_user_last_name VARCHAR,
        out_user_name VARCHAR,
        out_user_email VARCHAR,
        out_user_password  VARCHAR,
        out_user_phone_number VARCHAR,
        out_establishment_name TEXT,
        out_establishment_contact_number VARCHAR,
        out_establishment_email VARCHAR,
        out_establishment_description TEXT,
        out_establishment_commercial_registration_num BIGINT,
        out_establishment_city VARCHAR,
        out_establishment_street VARCHAR,
        out_establishment_building_num VARCHAR,
        out_establishment_industry_type_spec    BIGINT[],
        out_establishment_logo       BYTEA,
        out_user_type INT
) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(application_id AS BIGINT),
        user_first_name ,
        user_last_name ,
        user_name ,
        user_email ,
        user_password  ,
        user_phone_number ,
        establishment_name ,
        establishment_contact_number ,
        establishment_email ,
        establishment_description ,
        establishment_commercial_registration_num ,
        establishment_city ,
        establishment_street ,
        establishment_building_num ,
        establishment_industry_type_spec    ,
        establishment_logo,
        user_type       
	FROM application
    WHERE CAST(application_id AS BIGINT) = in_application_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT APPLICATION
CREATE OR REPLACE FUNCTION application_insert(
        IN in_user_first_name VARCHAR,
        IN in_user_last_name VARCHAR,
        IN in_user_name VARCHAR,
        IN in_user_email VARCHAR,
        IN in_user_password  VARCHAR,
        IN in_user_phone_number VARCHAR,
        IN in_establishment_name TEXT,
        IN in_establishment_contact_number VARCHAR,
        IN in_establishment_email VARCHAR,
        IN in_establishment_description TEXT,
        IN in_establishment_commercial_registration_num BIGINT,
        IN in_establishment_city VARCHAR,
        IN in_establishment_street VARCHAR,
        IN in_establishment_building_num VARCHAR,
        IN in_establishment_industry_type_spec    BIGINT[],
        IN in_establishment_logo       BYTEA,
        IN in_user_type INTEGER,
        OUT out_application_id BIGINT
)

RETURNS BIGINT
AS $$
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
   INSERT INTO application
	(   
        application_status,
        user_first_name ,
        user_last_name ,
        user_name ,
        user_email ,
        user_password  ,
        user_phone_number ,
        establishment_name ,
        establishment_contact_number ,
        establishment_email ,
        establishment_description ,
        establishment_commercial_registration_num ,
        establishment_city ,
        establishment_street ,
        establishment_building_num ,
        establishment_industry_type_spec    ,
        establishment_logo,       
        creation_date  ,
        last_modification_date,
        last_modified_by,
        user_type
    )
    VALUES (
        'NEW',
        in_user_first_name ,
        in_user_last_name ,
        in_user_name ,
        in_user_email ,
        in_user_password  ,
        in_user_phone_number ,
        in_establishment_name ,
        in_establishment_contact_number ,
        in_establishment_email ,
        in_establishment_description ,
        in_establishment_commercial_registration_num ,
        in_establishment_city ,
        in_establishment_street ,
        in_establishment_building_num ,
        in_establishment_industry_type_spec    ,
        in_establishment_logo,       
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        1,
        in_user_type
    ) RETURNING CAST(application_id AS BIGINT) INTO out_application_id;
EXCEPTION WHEN OTHERS THEN 
	get stacked diagnostics
	v_state = returned_sqlstate,
	v_msg = message_text,
	v_detail = pg_exception_detail,
	v_context = pg_exception_context;
        
    raise notice E' Got exception:
    state: % 
    message: % 
    detail: %
    hint: %
    context: %',  v_state, v_msg, v_detail, v_hint, v_context;
	out_application_id:= -1;
END;
$$ LANGUAGE plpgsql;
-- CHECK APPLICATION STATUS
CREATE OR REPLACE FUNCTION application_check_status(IN in_user_email VARCHAR, IN in_user_name VARCHAR, IN in_user_password VARCHAR)
RETURNS TABLE(	
		out_application_status VARCHAR
	) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		application_status
	FROM application
    WHERE (user_email = in_user_email OR user_name = in_user_name) AND user_password = in_user_password
    ORDER BY application_id DESC
	LIMIT 1;
END;
$$ LANGUAGE plpgsql;
-- CHECK APPLICATION STATUS
CREATE OR REPLACE FUNCTION application_update_status(IN in_application_id BIGINT, IN in_application_status VARCHAR)
RETURNS INTEGER
AS $$
BEGIN
	UPDATE application
	SET	application_status = in_application_status
    WHERE CAST(application_id AS BIGINT) = in_application_id;
    RETURN 0;
EXCEPTION WHEN OTHERS THEN 
    RETURN -1;
END;
$$ LANGUAGE plpgsql;
