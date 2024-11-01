-- TABLE: Product Status
-- TYPE: Look up

CREATE TABLE product_status (
	product_status_id SERIAL PRIMARY KEY,
	product_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Product Status CRUD Functions
*/
-- GET ALL Product Statuses
CREATE OR REPLACE FUNCTION product_status_get_all()
RETURNS TABLE(prdct_status_id BIGINT, prdct_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(product_status_id AS BIGINT), product_status FROM product_status;
END;
$$ LANGUAGE plpgsql;
-- GET A Product Status
CREATE OR REPLACE FUNCTION product_status_get_by_id(IN prdct_status_id BIGINT)
RETURNS TABLE(product_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.product_status FROM product_status AS D WHERE D.product_status_id = prdct_status_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Product Status
CREATE OR REPLACE FUNCTION product_status_insert(IN prdct_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO product_status (product_status, last_modification_date, last_modified_by) VALUES
	(prdct_status, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A Product Status
CREATE OR REPLACE FUNCTION product_status_update(IN prdct_status_id BIGINT, IN prdct_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE product_status 
	SET product_status = prdct_status, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE product_status_id = prdct_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A Product Status
CREATE OR REPLACE FUNCTION product_status_delete(IN prdct_status_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM product_status 
	WHERE product_status_id = prdct_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
