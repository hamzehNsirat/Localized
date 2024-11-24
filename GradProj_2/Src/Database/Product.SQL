-- TABLE: Product
-- TYPE: Main
CREATE TABLE product (
	product_id SERIAL PRIMARY KEY,
	supplier_id BIGINT NOT NULL,
	product_status_id BIGINT NOT NULL,
	product_unit_price FLOAT NOT NULL,
	product_whole_sale_price FLOAT,
	product_retail_price FLOAT ,
	product_unit_price_discount FLOAT DEFAULT NULL,
	product_category BIGINT,
	product_description TEXT DEFAULT NULL,
	product_image BYTEA DEFAULT NULL,
	product_name VARCHAR(70) NOT NULL,
	product_addition_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date TIMESTAMP NOT NULL,
	last_modified_by BIGINT NOT NULL,
	CONSTRAINT fk_prdct_supplier_id FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_prdct_status_id FOREIGN KEY (product_status_id) REFERENCES product_status(product_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prdct_cat FOREIGN KEY (product_category) REFERENCES category(category_id) ON DELETE SET NULL,
	CONSTRAINT chk_prdct_price CHECK(product_unit_price >= 0),
	CONSTRAINT chk_prdct_discount CHECK(
		product_unit_price_discount BETWEEN 0
		AND 1
	)
);

/*
 Product Indexes  / Triggers
 */
-- Product Supplier ID Index
-- to optimize the Retrieval Based on a given Product's Supplier
CREATE INDEX idx_product_supplier_id ON product(supplier_id);

-- Product Category Index
-- to optimize the Retrieval Based on a given Product's Category
CREATE INDEX idx_product_category ON product(product_category);

-- Product Status Index
-- to optimize the Retrieval Based on a given Product's Status
CREATE INDEX idx_product_status ON product(product_status_id);

/*
 Product CRUD Functions
 */

-- GET A Product BY ID
CREATE OR REPLACE FUNCTION product_get_by_id(IN in_product_id BIGINT) 
RETURNS TABLE(
	out_supplier_id BIGINT,
	out_product_status_id BIGINT,
	out_product_unit_price FLOAT,
	out_product_whole_sale_price FLOAT,
	out_product_retail_price FLOAT,
	out_product_unit_price_discount FLOAT,
	out_product_category VARCHAR,
	out_product_description TEXT,
	out_product_image BYTEA,
	out_product_name VARCHAR,
	out_product_addition_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	supplier_id,
	product_status_id,
	product_unit_price,
	product_whole_sale_price,
	product_retail_price,
	product_unit_price_discount,
	(
		SELECT
			category_name
		FROM
			category
		WHERE
			product_category = CAST(category_id AS BIGINT)
	),
	product_description,
	product_image,
	product_name,
	product_addition_date,
	last_modification_date,
	last_modified_by
	FROM	product
	WHERE	CAST(product_id AS BIGINT) = in_product_id;
END;
$$ LANGUAGE plpgsql;
-- GET A Product BY SUPPLIER ID
CREATE OR REPLACE FUNCTION product_get_by_supplier(IN in_supplier_id BIGINT) 
RETURNS TABLE(
	out_product_id BIGINT,
	out_product_status_id BIGINT,
	out_product_unit_price FLOAT,
	out_product_whole_sale_price FLOAT,
	out_product_retail_price FLOAT,
	out_product_unit_price_discount FLOAT,
	out_product_category VARCHAR,
	out_product_description TEXT,
	out_product_image BYTEA,
	out_product_name VARCHAR,
	out_product_addition_date TIMESTAMP,
	out_last_modification_date TIMESTAMP,
	out_last_modified_by BIGINT
) 
AS $$ BEGIN RETURN QUERY
	SELECT
	CAST(product_id AS BIGINT),
	product_status_id,
	product_unit_price,
	product_whole_sale_price,
	product_retail_price,
	product_unit_price_discount,
	(
		SELECT
			category_name
		FROM
			category
		WHERE
			product_category = CAST(category_id AS BIGINT)
	),
	product_description,
	product_image,
	product_name,
	product_addition_date,
	last_modification_date,
	last_modified_by
	FROM	product
	WHERE	CAST(supplier_id AS BIGINT) = in_supplier_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Product
CREATE OR REPLACE FUNCTION product_insert (
	IN in_supplier_id BIGINT,
	IN in_product_status_id BIGINT,
	IN in_product_unit_price FLOAT,
	IN in_product_whole_sale_price FLOAT,
	IN in_product_retail_price FLOAT,
	IN in_product_unit_price_discount FLOAT,
	IN in_product_category BIGINT,
	IN in_product_description TEXT,
	IN in_product_image BYTEA,
	IN in_product_name VARCHAR,
	IN in_last_modified_by BIGINT,
	OUT out_product_id BIGINT
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
		product (
			supplier_id,
			product_status_id,
			product_unit_price,
			product_unit_price_discount,
			product_category,
			product_description,
			product_image,
			product_name,
			product_addition_date,
			last_modification_date,
			last_modified_by,
			product_whole_sale_price,
			product_retail_price
		)
	VALUES
		(
			in_supplier_id,
			in_product_status_id,
			in_product_unit_price,
			in_product_unit_price_discount,
			in_product_category,
			in_product_description,
			in_product_image,
			in_product_name,
			CURRENT_TIMESTAMP,
			CURRENT_TIMESTAMP,
			in_last_modified_by,
			in_product_whole_sale_price,
			in_product_retail_price
	) RETURNING CAST(product_id AS BIGINT) INTO out_product_id;
EXCEPTION
WHEN OTHERS THEN 
	out_product_id := -1;
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


-- UPDATE A product
CREATE OR REPLACE FUNCTION product_update (
	IN in_product_id BIGINT,
	IN in_product_status_id BIGINT,
	IN in_product_unit_price FLOAT,
	IN in_product_whole_sale_price FLOAT,
	IN in_product_retail_price FLOAT,
	IN in_product_unit_price_discount FLOAT,
	IN in_product_category BIGINT,
	IN in_product_description TEXT,
	IN in_product_image BYTEA,
	IN in_product_name VARCHAR,
	IN in_last_modified_by BIGINT,
	OUT update_res INT
) 
RETURNS INT 
AS $$ 
DECLARE
    v_state TEXT;
    v_msg TEXT;
    v_detail TEXT;
    v_hint TEXT;
    v_context TEXT;
BEGIN
	UPDATE	product 
	SET
	product_status_id = COALESCE(in_product_status_id, product_status_id),
	product_unit_price = COALESCE(in_product_unit_price, product_unit_price),
	product_whole_sale_price = COALESCE(in_product_whole_sale_price, product_whole_sale_price),
	product_retail_price = COALESCE(in_product_retail_price, product_retail_price),
	product_unit_price_discount = COALESCE(in_product_unit_price_discount,product_unit_price_discount),
	product_category = COALESCE(in_product_category,product_category),
	product_description = COALESCE(in_product_description,product_description),
	product_image = COALESCE(in_product_image,product_image),
	product_name =COALESCE( in_product_name, product_name),
	last_modification_date = CURRENT_TIMESTAMP,
	last_modified_by = COALESCE(in_last_modified_by, last_modified_by)
	WHERE
	CAST(product_id AS BIGINT) = in_product_id;
	update_res := 0;

EXCEPTION WHEN OTHERS THEN 

	update_res := -1;
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