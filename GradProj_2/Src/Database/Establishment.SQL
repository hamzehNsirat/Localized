-- TABLE: Establishment
-- TYPE: Main

CREATE TABLE establishment ( 
	establishment_id SERIAL PRIMARY KEY,
	establishment_status    BIGINT,
	industry_type    BIGINT[],
	establishment_name TEXT,
	commercial_registration_num BIGINT NOT NULL UNIQUE,
	establishment_registration_date TIMESTAMP NOT NULL,
	contact_number VARCHAR(15) NOT NULL,
	establishment_email VARCHAR(254) NOT NULL UNIQUE,
	establishment_website TEXT DEFAULT NULL,
	establishment_description TEXT NOT NULL,
	establishment_type BOOLEAN NOT NULL,
	establishment_city VARCHAR(254) NOT NULL,
	establishment_street VARCHAR(254) NOT NULL,
	establishment_building_num VARCHAR(15) NOT NULL,
	establishment_longitude FLOAT,
	establishment_latitude  FLOAT,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	establishment_logo       BYTEA,
	establishment_cover       BYTEA,
	CONSTRAINT fk_establishment_status FOREIGN KEY (establishment_status)
    REFERENCES establishment_status(establishment_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_industry FOREIGN KEY (industry_type)
    REFERENCES industry_type(industry_type_id) ON DELETE SET NULL ON UPDATE CASCADE
);
/*
Establishment Indexes  / Triggers
*/

-- Establishment Industry Type Index
-- to optimize the Retrieval Based on a given Establishment's Industry Type
CREATE INDEX  idx_fk_establishment_industry_type ON establishment(industry_type);

-- Establishment Commercial Registration Number Index
-- to optimize the Retrieval Based on a given Establishment's Commercial Registration Number
CREATE INDEX  idx_fk_establishment_cmrcRec ON establishment(commercial_registration_num);

/*
Establishment CRUD Functions
*/
-- GET ALL ESTABLISHMENTS
CREATE OR REPLACE FUNCTION establishment_get_all()
RETURNS TABLE(	
		out_establishment_id BIGINT,
		out_establishment_status    BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_longitude FLOAT,
		out_establishment_latitude  FLOAT,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
	) 
AS $$
BEGIN
    RETURN QUERY 
	SELECT 
		CAST(establishment_id AS BIGINT),
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_longitude,
		establishment_latitude,
		last_modification_date,
		last_modified_by	
	FROM establishment;
END;
$$ LANGUAGE plpgsql;
-- GET AN ESTABLISHMENT BY ID
DROP FUNCTION establishment_get_by_id;
CREATE OR REPLACE FUNCTION establishment_get_by_id(IN est_id BIGINT)
RETURNS TABLE(		
		out_establishment_status BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_longitude FLOAT,
		out_establishment_latitude  FLOAT,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_longitude,
		establishment_latitude,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE CAST(establishment_id AS BIGINT) = est_id;
END;
$$ LANGUAGE plpgsql;
-- GET AN ESTABLISHMENT BY COMMERCIAL REG NUMBER
CREATE OR REPLACE FUNCTION establishment_get_by_commercial_reg_num(IN est_cmr_reg_num BIGINT)
RETURNS TABLE(		
		out_establishment_id BIGINT,
		out_establishment_status BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_longitude FLOAT,
		out_establishment_latitude  FLOAT,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		CAST(establishment_id AS BIGINT),
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		CAST(establishment_registration_date AS TIMESTAMP),
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_longitude,
		establishment_latitude,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE CAST(commercial_registration_num AS BIGINT) = est_cmr_reg_num;
END;
$$ LANGUAGE plpgsql;


-- GET AN ESTABLISHMENT BY INDUSTRY TYPE/S
CREATE OR REPLACE FUNCTION establishment_get_by_industry_type(IN est_industry_type BIGINT[])
RETURNS TABLE(		
		out_establishment_id BIGINT,
		out_establishment_status BIGINT,
		out_industry_type    BIGINT[],
		out_establishment_name TEXT,
		out_commercial_registration_num BIGINT,
		out_establishment_registration_date TIMESTAMP,
		out_contact_number VARCHAR,
		out_establishment_email VARCHAR,
		out_establishment_website TEXT,
		out_establishment_description TEXT,
		out_establishment_type BOOLEAN,
		out_establishment_city VARCHAR,
		out_establishment_street VARCHAR,
		out_establishment_building_num VARCHAR,
		out_establishment_longitude FLOAT,
		out_establishment_latitude  FLOAT,
		out_last_modification_date  TIMESTAMP,
		out_last_modified_by		 BIGINT
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
		CAST(establishment_id AS BIGINT),
		establishment_status,
		industry_type_spec,
		establishment_name,
		commercial_registration_num,
		CAST(establishment_registration_date AS TIMESTAMP),
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_longitude,
		establishment_latitude,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE industry_type_spec = est_industry_type;
END;
$$ LANGUAGE plpgsql;
-- INSERT AN ESTABLISHMENT
DROP FUNCTION establishment_insert;
CREATE OR REPLACE FUNCTION establishment_insert(
	IN in_establishment_status    BIGINT,
	IN in_industry_type    BIGINT[],
	IN in_establishment_name TEXT,
	IN in_commercial_registration_num BIGINT,
	IN in_establishment_registration_date TIMESTAMP,
	IN in_contact_number VARCHAR,
	IN in_establishment_email VARCHAR,
	IN in_establishment_website TEXT,
	IN in_establishment_description TEXT,
	IN in_establishment_type BOOLEAN,
	IN in_establishment_city VARCHAR,
	IN in_establishment_street VARCHAR,
	IN in_establishment_building_num VARCHAR,
	IN in_establishment_longitude FLOAT,
	IN in_establishment_latitude  FLOAT,
	IN last_modifier BIGINT,
	OUT out_establishment_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
	INSERT INTO establishment (
		establishment_status,
		industry_type,
		establishment_name,
		commercial_registration_num,
		establishment_registration_date,
		contact_number,
		establishment_email,
		establishment_website,
		establishment_description,
		establishment_type,
		establishment_city,
		establishment_street,
		establishment_building_num,
		establishment_longitude,
		establishment_latitude,
		last_modification_date,
		last_modified_by
	) VALUES
	(
		in_establishment_status,
		in_industry_type,
		in_establishment_name,
		in_commercial_registration_num,
		in_establishment_registration_date,
		in_contact_number,
		in_establishment_email,
		in_establishment_website,
		in_establishment_description,
		in_establishment_type,
		in_establishment_city,
		in_establishment_street,
		in_establishment_building_num,
		in_establishment_longitude,
		in_establishment_latitude,
		CURRENT_TIMESTAMP,
		last_modifier
	) RETURNING CAST(establishment_id AS BIGINT) INTO out_establishment_id;
EXCEPTION WHEN OTHERS THEN 
	SET out_establishment_id = -1;	
END;
$$ LANGUAGE plpgsql;

-- UPDATE AN ESTABLISHMENT 
CREATE OR REPLACE FUNCTION establishment_update (
	IN est_id BIGINT,
	IN in_establishment_status    BIGINT,
	IN in_industry_type    BIGINT[],
	IN in_establishment_name TEXT,
	IN in_commercial_registration_num BIGINT,
	IN in_establishment_registration_date TIMESTAMP,
	IN in_contact_number VARCHAR,
	IN in_establishment_email VARCHAR,
	IN in_establishment_website TEXT,
	IN in_establishment_description TEXT,
	IN in_establishment_city VARCHAR,
	IN in_establishment_street VARCHAR,
	IN in_establishment_building_num VARCHAR,
	IN in_establishment_longitude FLOAT,
	IN in_establishment_latitude  FLOAT,
	IN last_modifier BIGINT
)
RETURNS INTEGER AS $$
BEGIN
	UPDATE establishment 
	SET 
	establishment_status = COALESCE(in_establishment_status, establishment_status),
	industry_type = COALESCE(in_industry_type, industry_type),
	establishment_name = COALESCE(in_establishment_name, establishment_name),
	commercial_registration_num = COALESCE(in_commercial_registration_num, commercial_registration_num),
	establishment_registration_date = COALESCE(in_establishment_registration_date, establishment_registration_date),
	contact_number = COALESCE(in_contact_number, contact_number),
	establishment_email = COALESCE(in_establishment_email, establishment_email),
	establishment_website = COALESCE(in_establishment_website, establishment_website),
	establishment_description = COALESCE(in_establishment_description, establishment_description),
	establishment_city = COALESCE(in_establishment_city, establishment_city),
	establishment_street = COALESCE(in_establishment_street, establishment_street),
	establishment_building_num = COALESCE(in_establishment_building_num, establishment_building_num),
	establishment_longitude = COALESCE(in_establishment_longitude, establishment_longitude),
	establishment_latitude = COALESCE(in_establishment_latitude, establishment_latitude),
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	COALESCE(last_modifier, last_modified_by)

	WHERE CAST(establishment_id AS BIGINT) = est_id;
	RETURN 0 AS execution_result;

EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;

-- DELETE AN ESTABLISHMENT STATUS
CREATE OR REPLACE FUNCTION establishment_delete (
	IN est_id BIGINT,
	IN last_modifier BIGINT
)
RETURNS INTEGER AS $$
BEGIN
	UPDATE establishment 
	SET 
	establishment_status = (SELECT establishment_status_id FROM establishment_status WHERE establishment_status LIKE '%INACTIVE%'),
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier

	WHERE CAST(establishment_id AS BIGINT) = est_id;
	RETURN 0 AS execution_result;

EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
