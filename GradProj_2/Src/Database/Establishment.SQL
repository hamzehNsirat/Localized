-- TABLE: Establishment
-- TYPE: Main

CREATE TABLE establishment ( 
	establishment_id SERIAL PRIMARY KEY,
	establishment_status    BIGINT,
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
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	industry_type_spec    BIGINT[],
	establishment_logo       BYTEA,
	establishment_cover       BYTEA,
	est_compliance_indicator FLOAT NOT NULL DEFAULT 0,
	est_compliance_indicator_desc VARCHAR(15) NOT NULL DEFAULT 'GOOD'
	CONSTRAINT fk_establishment_status FOREIGN KEY (establishment_status)
    REFERENCES establishment_status(establishment_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_industry FOREIGN KEY (industry_type)
    REFERENCES industry_type(industry_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_est_compliance_ind CHECK(est_compliance_indicator BETWEEN 0 AND 1),
	CONSTRAINT chk_est_compliance_ind_desc CHECK(est_compliance_indicator_desc IN('GOOD', 'WARNING', 'RESTRICTED', 'SUSPENDED'))
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
		out_establishment_logo       BYTEA,
		out_establishment_cover       BYTEA,
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
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
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by	
	FROM establishment;
END;
$$ LANGUAGE plpgsql;
-- GET AN ESTABLISHMENT BY ID
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
		out_establishment_logo       BYTEA,
		out_establishment_cover       BYTEA,
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
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
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
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
		out_establishment_logo       BYTEA,
		out_establishment_cover       BYTEA,
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
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
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
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
		out_establishment_logo       BYTEA,
		out_establishment_cover       BYTEA,		
		out_est_compliance_indicator FLOAT,
		out_est_compliance_indicator_desc VARCHAR,
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
		establishment_logo,
		establishment_cover,
		est_compliance_indicator,
		est_compliance_indicator_desc,
		last_modification_date,
		last_modified_by	
	FROM establishment
	WHERE industry_type_spec = est_industry_type;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Quotation
CREATE OR REPLACE FUNCTION quotation_insert (
	IN in_requester_id 		 BIGINT ,
	IN in_supplier_id 		 BIGINT ,
	IN in_quotation_status_id  BIGINT ,
	IN in_quotation_request_date   TIMESTAMP,
	IN in_quotation_details     JSONB,
	IN in_quotation_attachments JSONB,
	IN in_payment_details_bank		      VARCHAR,
	IN in_payment_details_iban		      VARCHAR,
	IN in_payment_details_bank_acc_num	  VARCHAR,
	IN in_from_establishment_name	  TEXT,
	IN in_to_establishment_name	  TEXT,
	IN in_ship_to_address		      TEXT,
	IN in_bill_to_address		      TEXT,
	IN in_supplier_address		  TEXT,
	IN in_last_modified_by		BIGINT,
	OUT out_quotation_id BIGINT
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
	INSERT INTO
		quotation (
		requester_id 		  ,
		supplier_id 		  ,
		quotation_status_id   ,
		quotation_request_date   ,
		quotation_details     ,
		quotation_attachments ,
		payment_details_bank		      ,
		payment_details_iban		      ,
		payment_details_bank_acc_num	  ,
		from_establishment_name	  ,
		to_establishment_name	  ,
		ship_to_address		      ,
		bill_to_address		      ,
		supplier_address		  ,
		last_modified_by		
		)
	VALUES
		(
		in_requester_id 		  ,
		in_supplier_id 		  ,
		in_quotation_status_id   ,
		in_quotation_request_date   ,
		in_quotation_details     ,
		in_quotation_attachments ,
		in_payment_details_bank		      ,
		in_payment_details_iban		      ,
		in_payment_details_bank_acc_num	  ,
		in_from_establishment_name	  ,
		in_to_establishment_name	  ,
		in_ship_to_address		      ,
		in_bill_to_address		      ,
		in_supplier_address		  ,
		TRUE,
		CURRENT_TIMESTAMP,
		in_last_modified_by
	) RETURNING CAST(product_id AS BIGINT) INTO out_quotation_id;
EXCEPTION
WHEN OTHERS THEN 
	out_quotation_id := -1;
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
	IN in_establishment_logo       BYTEA,
	IN in_establishment_cover       BYTEA,
	IN in_est_compliance_indicator FLOAT,
	IN in_est_compliance_indicator_desc VARCHAR,
	IN last_modifier BIGINT
)
RETURNS INTEGER AS $$
BEGIN
	UPDATE establishment 
	SET 
	establishment_status = COALESCE(in_establishment_status, establishment_status),
	industry_type_spec = COALESCE(in_industry_type, industry_type_spec),
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
	establishment_logo   = COALESCE(in_establishment_logo, establishment_logo),
	establishment_cover  = COALESCE(in_establishment_cover, establishment_cover),
	est_compliance_indicator = COALESCE(in_est_compliance_indicator, est_compliance_indicator),
	est_compliance_indicator_desc = COALESCE(in_est_compliance_indicator_desc, est_compliance_indicator_desc),
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	COALESCE(last_modifier, last_modified_by)

	WHERE CAST(establishment_id AS BIGINT) = est_id;
	RETURN 0 AS execution_result;

EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE AN ESTABLISHMENT
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
