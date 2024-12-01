-- THIS IS THE COMPLEX FUNCTIONS CODE FILE
-- SP NO.:#1, 
-- Complexity: EASY,
-- Creation Data: 28112024,
-- Desc: Gets List of User in order to be displayed by admin paginated
-- NodeJS Model: User
CREATE OR REPLACE FUNCTION user_get_list(IN in_page_size INT, in_page_index INT)
RETURNS TABLE (		
		user_id BIGINT,
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
		CAST(D.user_id AS BIGINT),
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
	ORDER BY user_id ASC
	LIMIT in_page_size
	OFFSET ((in_page_index - 1) * in_page_size) ;
END;
$$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------
-- SP NO.:#2, 
-- Complexity: EASY,
-- Creation Data: 01122024,
-- Desc: Gets Retailer Data By UserID in order to be displayed
-- NodeJS Model: Retailer
-- GET A Retailer BY UserID
CREATE OR REPLACE FUNCTION retailer_get_by_user(IN in_ret_user_id BIGINT)
RETURNS TABLE(		
	out_retailer_id    BIGINT,
	out_retailer_tax_identification_num    VARCHAR,
	out_retailer_bank_account_num    VARCHAR,
	out_retailer_iban    VARCHAR,
	out_retailer_compliance_indicator FLOAT,
	out_retailer_complaint_count 	    INTEGER
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	CAST(retailer_id AS BIGINT),
	retailer_tax_identification_num,
	retailer_bank_account_num,
	retailer_iban,
	retailer_compliance_indicator,
	retailer_compliance_count 
	FROM retailer
	WHERE CAST(retailer_user_id AS BIGINT) = in_ret_user_id;
END;
$$ LANGUAGE plpgsql;