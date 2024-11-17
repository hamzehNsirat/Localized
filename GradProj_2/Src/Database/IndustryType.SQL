-- TABLE: Industry Type
-- TYPE: Look up

CREATE TABLE industry_type ( 
	industry_type_id SERIAL PRIMARY KEY,
	industry_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Industry Type CRUD Functions
*/
-- GET ALL Industry Types   
CREATE OR REPLACE FUNCTION industry_type_get_all()
RETURNS TABLE(indus_type_id BIGINT, indus_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(industry_type_id AS BIGINT), industry_type FROM industry_type;
END;
$$ LANGUAGE plpgsql;
-- GET A Industry Type
CREATE OR REPLACE FUNCTION industry_type_get_by_id(IN indus_type_id BIGINT[])
RETURNS TABLE(industry_type_id INT, industry_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.industry_type_id, D.industry_type FROM industry_type AS D WHERE D.industry_type_id =ANY(ARRAY[indus_type_id]);
END;
$$ LANGUAGE plpgsql;

-- INSERT A Industry Type
CREATE OR REPLACE FUNCTION industry_type_insert(IN indus_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO industry_type (industry_type, last_modification_date, last_modified_by) VALUES
	(indus_type, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A Industry Type
CREATE OR REPLACE FUNCTION industry_type_update(IN indus_type_id BIGINT, IN indus_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE industry_type 
	SET industry_type = indus_type, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE industry_type_id = indus_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A Industry Type
CREATE OR REPLACE FUNCTION industry_type_delete(IN indus_type_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM industry_type 
	WHERE industry_type_id = indus_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;