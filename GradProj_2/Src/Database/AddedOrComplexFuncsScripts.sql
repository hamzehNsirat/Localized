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
-- SP NO.:#7, 
-- Complexity: MODERATE,
-- Creation Data: 03122024,
-- Desc: Gets Products filtered by Retailers chosen industry types and ranked base on the suppliers compliance score
-- NodeJS Model: Product
CREATE OR REPLACE FUNCTION retailer_get_marketplace_products(
  IN in_retailer_id BIGINT, 
  IN in_page_size INTEGER, 
  IN in_page_index INTEGER
)
RETURNS TABLE(		
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image BYTEA,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_product_supplier BIGINT
) AS $$
BEGIN
RETURN QUERY 
  WITH retailer_establishment AS (
    SELECT retailstore_est_id 
    FROM retailstore_owned_get(in_retailer_id)
  ),
  retailer_categories AS (
    SELECT out_category_id 
    FROM retailstore_categories_get((SELECT retailstore_est_id FROM retailer_establishment))
  ),
  products_with_compliance AS (
    SELECT 
      p.product_id,
      p.product_name,
      p.product_description,
      p.product_image,
      p.product_retail_price,
      p.product_unit_price,
      p.product_whole_sale_price,
      s.supplier_compliance_indicator,
      p.supplier_id
    FROM product p
    JOIN supplier s ON p.supplier_id = s.supplier_id
    WHERE p.product_category = ANY(SELECT out_category_id FROM retailer_categories)
      AND p.product_status_id = (
        SELECT product_status_id 
        FROM product_status 
        WHERE product_status LIKE '%PUBLISHED%'
      )
  )
  SELECT 
    CAST(product_id AS BIGINT) AS out_product_id,
    product_name AS out_product_name,
    product_description AS out_product_description,
    product_image AS out_product_image,
    product_retail_price AS out_product_retail_price,
    product_unit_price AS out_product_unit_price,
    product_whole_sale_price AS out_product_whole_sale_price,
    supplier_id
  FROM products_with_compliance
  ORDER BY supplier_compliance_indicator DESC
  LIMIT in_page_size
  OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------
-- SP NO.:#8, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Gets Products filtered by Entered Category / Industry
-- NodeJS Model: Product
CREATE OR REPLACE FUNCTION fetch_products_by_industry_and_category(
  IN industry_types BIGINT[], -- Array of industry types
  IN categories BIGINT[],     -- Array of categories
  IN page_size INTEGER,       -- Pagination: page size
  IN page_index INTEGER       -- Pagination: page index
)
RETURNS TABLE(		
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image BYTEA,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_supplier_id BIGINT,
  total_records_count BIGINT
) AS $$
DECLARE
  v_total_count BIGINT; -- Variable to store total count
BEGIN
  -- Calculate the total records count
  SELECT COUNT(*)
  INTO v_total_count
  FROM product p
  WHERE 
    (
      -- Check if categories array is NULL or if product belongs to the given categories
      categories IS NULL OR p.product_category = ANY(categories)
    )
    AND (
      -- Check if industry types array is NULL or if product belongs to an industry type
      industry_types IS NULL OR p.product_category IN (
        SELECT category_id 
        FROM category
        WHERE industry_type = ANY(industry_types)
      )
    );

  -- Return the paginated results with total count included in each row
  RETURN QUERY 
  SELECT 
    CAST(p.product_id AS BIGINT) AS out_product_id,
    p.product_name AS out_product_name,
    p.product_description AS out_product_description,
    p.product_image AS out_product_image,
    p.product_retail_price AS out_product_retail_price,
    p.product_unit_price AS out_product_unit_price,
    p.product_whole_sale_price AS out_product_whole_sale_price,
    p.supplier_id AS out_supplier_id,
    v_total_count AS total_records_count -- Include the total count in each row
  FROM product p
  WHERE 
    (
      -- Check if categories array is NULL or if product belongs to the given categories
      categories IS NULL OR p.product_category = ANY(categories)
    )
    AND (
      -- Check if industry types array is NULL or if product belongs to an industry type
      industry_types IS NULL OR p.product_category IN (
        SELECT category_id 
        FROM category
        WHERE industry_type = ANY(industry_types)
      )
    )
  LIMIT page_size
  OFFSET ((page_index - 1) * page_size);
END;
$$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------------
-- SP NO.:#8, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Search Products by Search Term
-- NodeJS Model: Product
CREATE OR REPLACE FUNCTION search_products(
  IN search_term TEXT,
  IN page_size INTEGER,
  IN page_index INTEGER
)
RETURNS TABLE(
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image BYTEA,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_supplier_id BIGINT,
  total_records_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH matching_products AS (
    SELECT 
      p.product_id AS out_product_id,
      p.product_name AS out_product_name,
      p.product_description AS out_product_description,
      p.product_image AS out_product_image,
      p.product_retail_price AS out_product_retail_price,
      p.product_unit_price AS out_product_unit_price,
      p.product_whole_sale_price AS out_product_whole_sale_price,
      p.supplier_id AS out_supplier_id
    FROM product p
    LEFT JOIN category c ON p.product_category = c.category_id
    LEFT JOIN factory f ON p.supplier_id = f.owner_id
    LEFT JOIN establishment e ON f.factory_est_id = e.establishment_id
    WHERE 
      -- Search by product name
      LOWER(p.product_name) LIKE LOWER('%' || search_term || '%')
      OR
      -- Search by category name
      LOWER(c.category_name) LIKE LOWER('%' || search_term || '%')
      OR
      -- Search by establishment name
      LOWER(e.establishment_name) LIKE LOWER('%' || search_term || '%')
  ),
  total_count AS (
    SELECT COUNT(*) AS total_records_count
    FROM matching_products
  )
  SELECT 
    CAST(p.out_product_id AS BIGINT),
    p.out_product_name,
    p.out_product_description,
    p.out_product_image,
    p.out_product_retail_price,
    p.out_product_unit_price,
    p.out_product_whole_sale_price,
    p.out_supplier_id,
    tc.total_records_count
  FROM matching_products p, total_count tc
  ORDER BY p.out_product_name
  LIMIT page_size
  OFFSET ((page_index - 1) * page_size);
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------------------
-- SP NO.:#9, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Get Supplier Related Products
-- NodeJS Model: Product

CREATE OR REPLACE FUNCTION get_supplier_details(
  IN in_supplier_id BIGINT,
  IN page_size INTEGER,
  IN page_index INTEGER
)
RETURNS TABLE(
  supplier_establishment_name TEXT,
  supplier_establishment_logo BYTEA,
  supplier_establishment_cover BYTEA,
  supplier_industry_type BIGINT[],
  total_products_count BIGINT,
  paginated_products JSONB,
  total_reviews_count BIGINT,
  paginated_reviews JSONB,
  supplier_review_count BIGINT,
  overall_rating FLOAT
) AS $$
DECLARE
  v_total_products_count BIGINT;
  v_total_reviews_count BIGINT;
  v_paginated_products JSONB;
  v_paginated_reviews JSONB;
  v_supplier_review_count BIGINT;
  v_overall_rating FLOAT;
BEGIN
  -- Fetch total product count
  SELECT COUNT(*)
  INTO v_total_products_count
  FROM product p
  WHERE p.supplier_id = in_supplier_id;

  -- Fetch total review count
  SELECT COUNT(*)
  INTO v_total_reviews_count
  FROM review r
  WHERE r.supplier_id = in_supplier_id;

  -- Fetch paginated products as JSONB
  SELECT JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'product_id', p.product_id,
      'product_name', p.product_name,
      'product_description', p.product_description,
      'product_image', p.product_image,
      'product_unit_price', p.product_unit_price,
      'product_whole_sale_price', p.product_whole_sale_price,
      'product_retail_price', p.product_retail_price
    )
  )
  INTO v_paginated_products
  FROM (
    SELECT *
    FROM product p
    WHERE p.supplier_id = in_supplier_id
    ORDER BY p.product_name
    LIMIT page_size
    OFFSET ((page_index - 1) * page_size)
  ) p;

  -- Fetch paginated reviews as JSONB
  SELECT JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'review_id', r.review_id,
      'review_rating', r.rating,
      'review_text', r.review_comment,
      'review_date', r.review_date
    )
  )
  INTO v_paginated_reviews
  FROM (
    SELECT *
    FROM review r
    WHERE r.supplier_id = in_supplier_id
    ORDER BY r.review_date DESC
    LIMIT page_size
    OFFSET ((page_index - 1) * page_size)
  ) r;

  -- Fetch supplier review count and overall rating
  SELECT 
    COUNT(r.review_id),
    AVG(r.rating)
  INTO 
    v_supplier_review_count,
    v_overall_rating
  FROM review r
  WHERE r.supplier_id = in_supplier_id;

  -- Fetch supplier establishment details
  RETURN QUERY
  SELECT 
    e.establishment_name AS supplier_establishment_name,
    e.establishment_logo AS supplier_establishment_logo,
    e.establishment_cover AS supplier_establishment_cover,
    e.industry_type_spec AS supplier_industry_type,
    v_total_products_count,
    v_paginated_products,
    v_total_reviews_count,
    v_paginated_reviews,
    v_supplier_review_count,
    v_overall_rating
  FROM establishment e
  JOIN supplier s ON e.establishment_id = (SELECT factory_est_id FROM factory WHERE owner_id = in_supplier_id)
  WHERE s.supplier_id = in_supplier_id;
END;
$$ LANGUAGE plpgsql;

