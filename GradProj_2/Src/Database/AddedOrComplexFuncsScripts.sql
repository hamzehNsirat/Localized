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
		user_phone_number VARCHAR,
    user_image TEXT
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
		D.user_phone_number,
    D.user_image
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
DROP FUNCTION retailer_get_marketplace_products;
CREATE OR REPLACE FUNCTION retailer_get_marketplace_products(
  IN in_retailer_id BIGINT, 
  IN in_page_size INTEGER, 
  IN in_page_index INTEGER
)
RETURNS TABLE(		
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_product_supplier BIGINT,
  out_product_category BIGINT
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
      p.supplier_id,
      p.product_category
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
DROP FUNCTION fetch_products_by_industry_and_category
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
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_supplier_id BIGINT,
  total_records_count BIGINT,
  out_product_category BIGINT
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
    ) AND p.product_status_id = (
        SELECT product_status_id 
        FROM product_status 
        WHERE product_status LIKE '%PUBLISHED%'
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
    v_total_count AS total_records_count, -- Include the total count in each row
    p.product_category
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
    )  AND p.product_status_id = (
        SELECT product_status_id 
        FROM product_status 
        WHERE product_status LIKE '%PUBLISHED%'
      )
  LIMIT page_size
  OFFSET ((page_index - 1) * page_size);
END;
$$ LANGUAGE plpgsql;
----------------------------------------------------------------------------------------------
-- SP NO.:#9, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Search Products by Search Term
-- NodeJS Model: Product
DROP FUNCTION search_products;
CREATE OR REPLACE FUNCTION search_products(
  IN search_term TEXT,
  IN page_size INTEGER,
  IN page_index INTEGER
)
RETURNS TABLE(
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT,
  out_supplier_id BIGINT,
  total_records_count BIGINT,
  out_product_category BIGINT

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
      p.supplier_id AS out_supplier_id,
      p.product_category 

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
      AND p.product_status_id = (
      SELECT product_status_id 
      FROM product_status 
      WHERE product_status LIKE '%PUBLISHED%'
      )
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
-- SP NO.:#10, 
-- Complexity: MODERATE,
-- Creation Data: 04122024,
-- Desc: Get Supplier Related Products
-- NodeJS Model: Product
DROP FUNCTION get_supplier_details;
CREATE OR REPLACE FUNCTION get_supplier_details(
  IN in_supplier_id BIGINT,
  IN page_size INTEGER,
  IN page_index INTEGER
)
RETURNS TABLE(
  supplier_establishment_name TEXT,
  supplier_establishment_logo TEXT,
  supplier_establishment_cover TEXT,
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
      'out_product_category', p.product_category

    )
  )
  INTO v_paginated_products
  FROM (
    SELECT *
    FROM product p
    WHERE p.supplier_id = in_supplier_id
    AND p.product_status_id = (
      SELECT product_status_id 
      FROM product_status 
      WHERE product_status LIKE '%PUBLISHED%'
    )
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
--------------------------------------------------------------------------------------------------------------
-- SP NO.:#11, 
-- Complexity: MODERATE,
-- Creation Data: 06122024,
-- Desc: Get Retailer Related Quotations
-- NodeJS Model: Quotation
CREATE OR REPLACE FUNCTION get_quotations_by_retailer(
  IN in_retailer_id BIGINT,
  IN in_page_size INTEGER,
  IN in_page_index INTEGER
)
RETURNS TABLE(
  out_quotation_id BIGINT,
  out_supplier_establishment_logo TEXT,
  out_supplier_establishment_name TEXT,
  out_quotation_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CAST(q.quotation_id AS BIGINT) AS out_quotation_id ,
    e.establishment_logo AS out_supplier_establishment_logo,
    e.establishment_name AS out_supplier_establishment_name,
    qs.quotation_status AS out_quotation_status
  FROM
    quotation q
  JOIN factory f ON q.supplier_id = f.owner_id
  JOIN establishment e ON f.factory_est_id = e.establishment_id
  JOIN quotation_status qs ON q.quotation_status_id = qs.quotation_status_id
  WHERE
    q.requester_id = in_retailer_id
  ORDER BY q.quotation_request_date DESC
  LIMIT in_page_size
  OFFSET (in_page_index - 1) * in_page_size;
END;
$$ LANGUAGE plpgsql;
------------------------------------------------------------------------------------------------
-- SP NO.:#12, 
-- Complexity: MODERATE,
-- Creation Data: 06122024,
-- Desc: Calculate Supplier Overall Rating
-- NodeJS Model: Supplier
CREATE OR REPLACE FUNCTION update_supplier_overall_rating(
  IN in_supplier_id BIGINT
)
RETURNS VOID AS $$
DECLARE
  v_avg_rating FLOAT;
BEGIN
  -- Calculate the average rating for the specific supplier
  SELECT AVG(rating)
  INTO v_avg_rating
  FROM review
  WHERE supplier_id = in_supplier_id;

  -- Update the supplier's overall rating
  UPDATE supplier
  SET supplier_overall_rating = COALESCE(v_avg_rating, 0)
  WHERE supplier_id = in_supplier_id;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------
-- SP NO.:#13, 
-- Complexity: EASY,
-- Creation Data: 09122024,
-- Desc: Calculate Supplier Details
-- NodeJS Model: Supplier
CREATE OR REPLACE FUNCTION supplier_get_by_user(IN in_user_id BIGINT)
RETURNS TABLE(		
	out_supplier_id    BIGINT,
	out_supplier_tax_identification_num    VARCHAR,
	out_supplier_bank_account_num    VARCHAR,
	out_supplier_iban    VARCHAR,
	out_supplier_compliance_indicator FLOAT,
	out_supplier_complaint_count 	    INTEGER,
	out_supplier_positive_review_count INTEGER,
	out_supplier_overall_rating INTEGER

) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	CAST(supplier_id AS BIGINT),
	supplier_tax_identification_num,
	supplier_bank_account_num,
	supplier_iban,
	supplier_compliance_indicator,
	supplier_complaint_count 	,
	supplier_positive_review_count,
	supplier_overall_rating
	FROM supplier
	WHERE CAST(supplier_user_id AS BIGINT) = in_user_id;
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------
-- SP NO.:#14, 
-- Complexity: MODERATE,
-- Creation Data: 10122024,
-- Desc: Get Supplier Marketplace
-- NodeJS Model: Supplier
DROP FUNCTION supplier_get_marketplace_products;
CREATE OR REPLACE FUNCTION supplier_get_marketplace_products(
  IN in_supplier_id BIGINT, 
  IN in_page_size INTEGER, 
  IN in_page_index INTEGER
)
RETURNS TABLE(		
  out_product_id BIGINT,
  out_product_name VARCHAR,
  out_product_description TEXT, 
  out_product_image TEXT,
  out_product_retail_price FLOAT,
  out_product_unit_price FLOAT,
  out_product_whole_sale_price FLOAT
) AS $$
BEGIN
RETURN QUERY 
  WITH factory AS (
    SELECT factory_est_id 
    FROM factory_owned_get(in_supplier_id)
  ),
  supplier_categories AS (
    SELECT out_category_id 
    FROM factory_categories_get((SELECT factory_est_id FROM factory))
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
    WHERE p.product_category = ANY(SELECT out_category_id FROM supplier_categories)
      AND p.product_status_id = (
        SELECT product_status_id 
        FROM product_status 
        WHERE product_status LIKE '%PUBLISHED%'
      )
      AND p.supplier_id <> in_supplier_id
  )
  SELECT 
    CAST(product_id AS BIGINT) AS out_product_id,
    product_name AS out_product_name,
    product_description AS out_product_description,
    product_image AS out_product_image,
    product_retail_price AS out_product_retail_price,
    product_unit_price AS out_product_unit_price,
    product_whole_sale_price AS out_product_whole_sale_price
  FROM products_with_compliance
  LIMIT in_page_size
  OFFSET ((in_page_index - 1) * in_page_size);
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------
-- SP NO.:#15, 
-- Complexity: MODERATE,
-- Creation Data: 11122024,
-- Desc: Get Supplier Related Quotations
-- NodeJS Model: Quotation
CREATE OR REPLACE FUNCTION get_quotations_by_supplier(
  IN in_supplier_id BIGINT,
  IN in_page_size INTEGER,
  IN in_page_index INTEGER
)
RETURNS TABLE(
  out_quotation_id BIGINT,
  out_supplier_establishment_logo TEXT,
  out_supplier_establishment_name TEXT,
  out_quotation_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CAST(q.quotation_id AS BIGINT) AS out_quotation_id ,
    e.establishment_logo AS out_supplier_establishment_logo,
    e.establishment_name AS out_supplier_establishment_name,
    qs.quotation_status AS out_quotation_status
  FROM
    quotation q
  JOIN retailstore f ON q.requester_id = f.owner_id
  JOIN establishment e ON f.retailstore_est_id = e.establishment_id
  JOIN quotation_status qs ON q.quotation_status_id = qs.quotation_status_id
  WHERE
    q.supplier_id = in_supplier_id
  ORDER BY q.quotation_request_date DESC
  LIMIT in_page_size
  OFFSET (in_page_index - 1) * in_page_size;
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------------
-- SP NO.:#16, 
-- Complexity: MODERATE,
-- Creation Data: 11122024,
-- Desc: UPDATE AN Order
-- NodeJS Model: ORDER
CREATE OR REPLACE FUNCTION order_update (
	IN in_order_id 		     BIGINT,
	IN in_order_quantity   	 FLOAT,
	IN in_order_price 		 FLOAT,
	IN in_last_modified_by   BIGINT
) 
RETURNS INTEGER
AS $$ 
DECLARE 
v_state TEXT;
v_msg TEXT;
v_detail TEXT;
v_hint TEXT;
v_context TEXT;
BEGIN
	UPDATE
	order_localized 
	SET
	order_quantity = COALESCE(in_order_quantity,order_quantity),
	order_price = COALESCE(in_order_price,order_price), 
  	last_modification_date = CURRENT_TIMESTAMP,
  	last_modified_by = in_last_modified_by
	WHERE CAST(order_id AS BIGINT) = in_order_id;
	RETURN 0;
EXCEPTION
WHEN OTHERS THEN 
	RETURN -1;
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
--------------------------------------------------------------
-- SP NO.:#17, 
-- Complexity: MODERATE,
-- Creation Data: 17122024,
-- Desc: Search Applications By Name,ID
-- NodeJS Model: Applicattion
-- SEARCH ALL APPLICATIONS
CREATE OR REPLACE FUNCTION application_search(IN search_term TEXT, IN page_size INTEGER, IN page_index INTEGER)
RETURNS TABLE(	
		out_application_id 		BIGINT,
		out_establishment_name  TEXT,
		out_establishment_logo  TEXT,
		out_application_status  VARCHAR
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
	WHERE 
		CAST(application_id AS TEXT) = search_term
	OR	
		CAST(establishment_name AS TEXT) LIKE '%' || search_term || '%'
    ORDER BY application_id DESC
	LIMIT page_size
	OFFSET ((page_index - 1) * page_size) ;
END;
$$ LANGUAGE plpgsql;
--------------------------------------------------------------------
-- SP NO.:#18, 
-- Complexity: MODERATE,
-- Creation Data: 17122024,
-- Desc: Search Users By Name,ID
-- NodeJS Model: User
-- SEARCH ALL USERS
CREATE OR REPLACE FUNCTION user_search(IN search_term TEXT, IN in_page_size INT, in_page_index INT)
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
		user_phone_number VARCHAR,
    user_image TEXT
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
		D.user_phone_number,
    D.user_image
	FROM user_localized AS D
	WHERE CAST(D.user_id AS TEXT) = search_term
	OR CAST(D.first_name AS TEXT) LIKE '%' || search_term || '%'
	OR CAST(D.middle_name AS TEXT)LIKE '%' || search_term || '%'
	OR CAST(D.last_name AS TEXT)  LIKE '%' || search_term || '%'
	LIMIT in_page_size
	OFFSET ((in_page_index - 1) * in_page_size) ;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------
-- SP NO.:#19, 
-- Complexity: MODERATE,
-- Creation Data: 17122024,
-- Desc: Get  Related Quotations
-- NodeJS Model: Quotation
CREATE OR REPLACE FUNCTION get_quotations_list(
  IN in_page_size INTEGER,
  IN in_page_index INTEGER
)
RETURNS TABLE(
  out_quotation_id BIGINT,
  out_retailer_establishment_logo TEXT,
  out_retailer_establishment_name TEXT,
  out_quotation_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CAST(q.quotation_id AS BIGINT) AS out_quotation_id ,
    e.establishment_logo AS out_retailer_establishment_logo,
    e.establishment_name AS out_retailer_establishment_name,
    qs.quotation_status AS out_quotation_status
  FROM
    quotation q
  JOIN retailstore f ON q.requester_id = f.owner_id
  JOIN establishment e ON f.retailstore_est_id = e.establishment_id
  JOIN quotation_status qs ON q.quotation_status_id = qs.quotation_status_id
  ORDER BY q.quotation_request_date DESC
  LIMIT in_page_size
  OFFSET (in_page_index - 1) * in_page_size;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------
-- SP NO.:#20, 
-- Complexity: MODERATE,
-- Creation Data: 17122024,
-- Desc: Get  Related Quotations
-- NodeJS Model: Quotation
CREATE OR REPLACE FUNCTION search_quotations(
  IN search_term TEXT,
  IN in_page_size INTEGER,
  IN in_page_index INTEGER
)
RETURNS TABLE(
  out_quotation_id BIGINT,
  out_retailer_establishment_logo TEXT,
  out_retailer_establishment_name TEXT,
  out_quotation_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CAST(q.quotation_id AS BIGINT) AS out_quotation_id ,
    e.establishment_logo AS out_retailer_establishment_logo,
    e.establishment_name AS out_retailer_establishment_name,
    qs.quotation_status AS out_quotation_status
  FROM
    quotation q
  JOIN retailstore f ON q.requester_id = f.owner_id
  JOIN establishment e ON f.retailstore_est_id = e.establishment_id
  JOIN quotation_status qs ON q.quotation_status_id = qs.quotation_status_id
  WHERE CAST(q.quotation_id AS TEXT) = search_term
  OR e.establishment_name LIKE '%' || search_term || '%'
  ORDER BY q.quotation_request_date DESC
  LIMIT in_page_size
  OFFSET (in_page_index - 1) * in_page_size;
END;
$$ LANGUAGE plpgsql;
-----------------------------------------------------------------
-- SP NO.:#20, 
-- Complexity: MODERATE,
-- Creation Data: 18122024,
-- Desc: Get  Related Complaints
-- NodeJS Model: Complaint
-- SEARCH A Complaint BY ID, TITLE

CREATE OR REPLACE FUNCTION complaint_search(IN search_term TEXT, IN page_size INT, IN page_index INT) 
RETURNS TABLE (
	out_complaint_id		   BIGINT, 
	out_complaint_title 		VARCHAR,
	out_complaint_type_id    BIGINT,
	out_complaint_supplier_id   BIGINT ,
	out_complaint_retailer_id BIGINT,
	out_complaint_status_id 	 VARCHAR,
	out_quotation_id BIGINT,
	out_creation_date  TIMESTAMP 
) 
AS $$ BEGIN RETURN QUERY
	SELECT 
	CAST(D.complaint_id AS BIGINT),	
	D.complaint_title,
	CAST(D.complaint_type_id AS BIGINT),
	CAST(D.supplier_id AS BIGINT),
	CAST(D.retailer_id AS BIGINT),
	D.complaint_status_id,
	D.quotation_id,
	D.creation_date
	FROM	complaint AS D
	WHERE CAST(D.complaint_id AS TEXT) = search_term
  OR D.complaint_title LIKE '%'||search_term||'%'
  ORDER BY creation_date DESC
	LIMIT page_size
	OFFSET ((page_index - 1) * page_size) ;
END;
$$ LANGUAGE plpgsql;
----------------------------------------------------------------
-- SP NO.:#20, 
-- Complexity: MODERATE,
-- Creation Data: 18122024,
-- Desc: decrements Compliance Indicator for Respondant
-- NodeJS Model:

CREATE OR REPLACE FUNCTION recalculate_compliance()
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
    -- Check if 'is_penalty_resulted' is true in the new record
    IF NEW.is_penalty_resulted = TRUE THEN
    
        -- Case 1: Submitter type is TRUE -> Update supplier's compliance indicator and complaint count
        IF NEW.submitter_type = TRUE THEN
            UPDATE supplier
            SET 
                supplier_compliance_indicator = CASE WHEN supplier_compliance_indicator = 0 THEN 0 ELSE supplier_compliance_indicator - 0.05 END,
                supplier_complaint_count = supplier_complaint_count + 1
            WHERE supplier_id = NEW.supplier_id;

        -- Case 2: Submitter type is FALSE -> Update retailer's compliance indicator and complaint count
        ELSIF NEW.submitter_type = FALSE THEN
            UPDATE retailer
            SET 
                retailer_compliance_indicator = CASE WHEN  retailer_compliance_indicator = 0 THEN 0 ELSE retailer_compliance_indicator - 0.05 END,
                retailer_complaint_count = retailer_complaint_count + 1
            WHERE retailer_id = NEW.retailer_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Trigger Definition
CREATE TRIGGER before_update_cmp
BEFORE UPDATE ON complaint
FOR EACH ROW
EXECUTE FUNCTION recalculate_compliance();
----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION insert_rating_type()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN			
	IF (NEW.rating IN (3, 4 5)) THEN 
		NEW.rating_type =  TRUE;
    UPDATE supplier
    SET 
        supplier_positive_review_count = supplier_positive_review_count + 1
    WHERE supplier_id = NEW.supplier_id;
	ELSE 
		NEW.rating_type =  FALSE;
	END IF;
	RETURN NEW;
END;
$$
------------------------------------------------------------------------
-- SP NO.:#21, 
-- Complexity: MODERATE,
-- Creation Data: 19122024,
-- Desc: decrements Compliance Indicator for Est
-- NodeJS Model:

CREATE OR REPLACE FUNCTION recalculate_est_compliance()
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
    -- Check if 'is_penalty_resulted' is true in the new record
    IF NEW.penalty_status_id ='APPLIED' THEN
      UPDATE establishment
      SET 
          est_compliance_indicator = est_compliance_indicator - COALESCE(CAST(OLD.penalty_weight AS FLOAT), 0.15)
      WHERE CAST(establishment_id AS BIGINT) = OLD.establishment_id;
      UPDATE complaint SET is_penalty_resulted = TRUE WHERE CAST(complaint_id AS BIGINT) = OLD.related_complaint_id;
    ELSIF NEW.penalty_status_id = 'DISABLED' THEN
      UPDATE establishment
      SET 
          est_compliance_indicator = est_compliance_indicator + COALESCE(CAST(OLD.penalty_weight AS FLOAT), 0.15)
      WHERE CAST(establishment_id AS BIGINT) = OLD.establishment_id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION remove_penalty_compliance()
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
    UPDATE establishment
    SET 
        est_compliance_indicator = est_compliance_indicator + COALESCE(CAST(OLD.penalty_weight AS FLOAT), 0.15)
    WHERE CAST(establishment_id AS BIGINT) = OLD.establishment_id;
    RETURN NEW;
END;
$$;

-- Trigger Definition
CREATE TRIGGER before_update_pnlt
BEFORE UPDATE ON penalty
FOR EACH ROW
EXECUTE FUNCTION recalculate_est_compliance();

-- Trigger Definition
CREATE TRIGGER before_delete_pnlt
BEFORE DELETE ON penalty
FOR EACH ROW
EXECUTE FUNCTION remove_penalty_compliance();