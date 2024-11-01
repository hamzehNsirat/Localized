-- TABLE: Penalty Type
-- TYPE: Look up

CREATE TABLE penalty_type ( 
	penalty_type_id SERIAL PRIMARY KEY,
	penalty_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Penalty Type CRUD Functions
*/
-- GET ALL Penalty Types   
CREATE OR REPLACE FUNCTION penalty_type_get_all()
RETURNS TABLE(penlty_type_id BIGINT, penlty_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(penalty_type_id AS BIGINT), penalty_type FROM penalty_type;
END;
$$ LANGUAGE plpgsql;
-- GET A Penalty Type
CREATE OR REPLACE FUNCTION penalty_type_get_by_id(IN penlty_type_id BIGINT)
RETURNS TABLE(penalty_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.penalty_type FROM penalty_type AS D WHERE D.penalty_type_id = penlty_type_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Penalty Type
CREATE OR REPLACE FUNCTION penalty_type_insert(IN penlty_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO penalty_type (penalty_type, last_modification_date, last_modified_by) VALUES
	(penlty_type, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A Penalty Type
CREATE OR REPLACE FUNCTION penalty_type_update(IN penlty_type_id BIGINT, IN penlty_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE penalty_type 
	SET penalty_type = penlty_type, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE penalty_type_id = penlty_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A Penalty Type
CREATE OR REPLACE FUNCTION penalty_type_delete(IN penlty_type_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM penalty_type 
	WHERE penalty_type_id = penlty_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;