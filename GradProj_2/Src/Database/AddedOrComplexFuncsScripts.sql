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
-----------------------------------------------------------------------------------
-- SP NO.:#3, 
-- Complexity: EASY,
-- Creation Data: 02122024,
-- Desc: Gets Completion Rate for Retailer in terms of how many non-null valued columns they have as user or retailer 
-- NodeJS Model: Retailer
-- GET Completion Rate for Retailer
CREATE OR REPLACE FUNCTION calculate_completion_percentage_retailer(in_user_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
  v_completion_percentage FLOAT;
BEGIN
  -- Calculate the completion percentage
  WITH total_columns_retailer AS (
    SELECT COUNT(*) AS column_count
    FROM information_schema.columns
    WHERE table_name = 'retailer'
  ),
  null_columns_retailer AS (
    SELECT 
      (CASE WHEN retailer_tax_identification_num IS NULL OR retailer_tax_identification_num = '' THEN 1 ELSE 0 END) +
      (CASE WHEN retailer_bank_account_num IS NULL OR retailer_bank_account_num = '' THEN 1 ELSE 0 END) +
      (CASE WHEN retailer_iban IS NULL OR retailer_iban = '' THEN 1 ELSE 0 END) AS null_column_count
    FROM retailer AS R WHERE  R.retailer_user_id = in_user_id
  ),
  total_columns_user AS (
    SELECT COUNT(*) AS column_count
    FROM information_schema.columns
    WHERE table_name = 'user_localized'
  ),
  null_columns_user AS (
    SELECT 
      (CASE WHEN national_number IS NULL OR national_number = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN middle_name IS NULL OR middle_name = '' THEN 1 ELSE 0 END) +
      (CASE WHEN date_of_birth IS NULL THEN 1 ELSE 0 END) +
      (CASE WHEN user_address IS NULL OR user_address = '' THEN 1 ELSE 0 END) +
      (CASE WHEN user_image IS NULL THEN 1 ELSE 0 END) AS null_column_count
    FROM user_localized
    WHERE user_id = in_user_id
  )
  SELECT 
    100 * (
      (
        total_columns_retailer.column_count - (SELECT null_column_count FROM null_columns_retailer) +
        total_columns_user.column_count - (SELECT null_column_count FROM null_columns_user)
      )::FLOAT / 
      (
        total_columns_retailer.column_count + total_columns_user.column_count
      )
    )
  INTO v_completion_percentage
  FROM 
    total_columns_retailer,
    total_columns_user;

  -- Return the calculated completion percentage
  RETURN v_completion_percentage;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------------
-- SP NO.:#4, 
-- Complexity: EASY,
-- Creation Data: 02122024,
-- Desc: Gets Completion Rate for Supplier in terms of how many non-null valued columns they have as user or retailer 
-- NodeJS Model: Supplier
-- GET Completion Rate for Supplier
CREATE OR REPLACE FUNCTION calculate_completion_percentage_supplier(in_user_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
  v_completion_percentage FLOAT;
BEGIN
  -- Calculate the completion percentage
  WITH total_columns_supplier AS (
    SELECT COUNT(*) AS column_count
    FROM information_schema.columns
    WHERE table_name = 'supplier'
  ),
  null_columns_supplier AS (
    SELECT 
      (CASE WHEN supplier_tax_identification_num IS NULL OR supplier_tax_identification_num = '' THEN 1 ELSE 0 END) +
      (CASE WHEN supplier_bank_account_num IS NULL OR supplier_bank_account_num = '' THEN 1 ELSE 0 END) +
      (CASE WHEN supplier_iban IS NULL OR supplier_iban = '' THEN 1 ELSE 0 END) AS null_column_count
    FROM supplier AS R WHERE  R.supplier_user_id = in_user_id
  ),
  total_columns_user AS (
    SELECT COUNT(*) AS column_count
    FROM information_schema.columns
    WHERE table_name = 'user_localized'
  ),
  null_columns_user AS (
    SELECT 
      (CASE WHEN national_number IS NULL OR national_number = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN middle_name IS NULL OR middle_name = '' THEN 1 ELSE 0 END) +
      (CASE WHEN date_of_birth IS NULL THEN 1 ELSE 0 END) +
      (CASE WHEN user_address IS NULL OR user_address = '' THEN 1 ELSE 0 END) +
      (CASE WHEN user_image IS NULL THEN 1 ELSE 0 END) AS null_column_count
    FROM user_localized
    WHERE user_id = in_user_id
  )
  SELECT 
    100 * (
      (
        total_columns_supplier.column_count - (SELECT null_column_count FROM null_columns_supplier) +
        total_columns_user.column_count - (SELECT null_column_count FROM null_columns_user)
      )::FLOAT / 
      (
        total_columns_supplier.column_count + total_columns_user.column_count
      )
    )
  INTO v_completion_percentage
  FROM 
    total_columns_supplier,
    total_columns_user;

  -- Return the calculated completion percentage
  RETURN v_completion_percentage;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------------
-- SP NO.:#5, 
-- Complexity: EASY,
-- Creation Data: 02122024,
-- Desc: Gets Completion Rate for Retailer in terms of how many non-null valued columns they have in establishmeny
-- NodeJS Model: Retailer
-- GET Completion Rate for Retailer Establishment
CREATE OR REPLACE FUNCTION calculate_retailer_establishment_completion_percentage(in_owner_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
  v_establishment_id BIGINT;
  v_completion_percentage FLOAT;
BEGIN
  -- Fetch the establishment_id associated with the retailer's owner_id
  SELECT retailstore_est_id INTO v_establishment_id
  FROM retailstore
  WHERE owner_id = in_owner_id;

  IF v_establishment_id IS NULL THEN
    RAISE EXCEPTION 'No establishment associated with the provided owner_id: %', in_owner_id;
  END IF;

  -- Calculate the completion percentage for the establishment
  WITH total_columns_establishment AS (
    SELECT COUNT(*) AS column_count
    FROM information_schema.columns
    WHERE table_name = 'establishment'
  ),
  null_columns_establishment AS (
    SELECT 
      (CASE WHEN establishment_cover IS NULL OR establishment_cover = '' THEN 1 ELSE 0 END) +
      (CASE WHEN establishment_website IS NULL OR establishment_website = '' THEN 1 ELSE 0 END) +
      (CASE WHEN establishment_registration_date IS NULL THEN 1 ELSE 0 END) AS null_column_count
    FROM establishment
    WHERE establishment_id = v_establishment_id
  )
  SELECT 
    100 * (
      (
        total_columns_establishment.column_count - null_columns_establishment.null_column_count
      )::FLOAT / total_columns_establishment.column_count
    )
  INTO v_completion_percentage
  FROM total_columns_establishment, null_columns_establishment;

  -- Return the calculated completion percentage
  RETURN v_completion_percentage;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------------
-- SP NO.:#6, 
-- Complexity: EASY,
-- Creation Data: 02122024,
-- Desc: Gets Completion Rate for Supplier in terms of how many non-null valued columns they have in establishmeny
-- NodeJS Model: Supplier
-- GET Completion Rate for Supplier Establishment
CREATE OR REPLACE FUNCTION calculate_supplier_establishment_completion_percentage(in_owner_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
  v_establishment_id BIGINT;
  v_completion_percentage FLOAT;
BEGIN
  -- Fetch the establishment_id associated with the supplier's owner_id
  SELECT factory_est_id INTO v_establishment_id
  FROM factory
  WHERE owner_id = in_owner_id;

  IF v_establishment_id IS NULL THEN
    RAISE EXCEPTION 'No establishment associated with the provided owner_id: %', in_owner_id;
  END IF;

  -- Calculate the completion percentage for the establishment
  WITH total_columns_establishment AS (
    SELECT COUNT(*) AS column_count
    FROM information_schema.columns
    WHERE table_name = 'establishment'
  ),
  null_columns_establishment AS (
    SELECT 
      (CASE WHEN establishment_cover IS NULL OR establishment_cover = '' THEN 1 ELSE 0 END) +
      (CASE WHEN establishment_website IS NULL OR establishment_website = '' THEN 1 ELSE 0 END) +
      (CASE WHEN establishment_registration_date IS NULL THEN 1 ELSE 0 END) AS null_column_count
    FROM establishment
    WHERE establishment_id = v_establishment_id
  )
  SELECT 
    100 * (
      (
        total_columns_establishment.column_count - null_columns_establishment.null_column_count
      )::FLOAT / total_columns_establishment.column_count
    )
  INTO v_completion_percentage
  FROM total_columns_establishment, null_columns_establishment;

  -- Return the calculated completion percentage
  RETURN v_completion_percentage;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------------------------