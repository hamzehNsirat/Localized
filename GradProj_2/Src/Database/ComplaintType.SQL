-- TABLE: Complaint Type
-- TYPE: Look up

CREATE TABLE complaint_type ( 
	complaint_type_id SERIAL PRIMARY KEY,
	complaint_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Complaint Type CRUD Functions
*/
-- GET ALL Complaint Types  
CREATE OR REPLACE FUNCTION complaint_type_get_all()
RETURNS TABLE(cmplaint_type_id BIGINT, cmplaint_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(complaint_type_id AS BIGINT), complaint_type FROM complaint_type;
END;
$$ LANGUAGE plpgsql;
-- GET A Complaint Type
CREATE OR REPLACE FUNCTION complaint_type_get_by_id(IN cmplaint_type_id BIGINT)
RETURNS TABLE(complaint_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.complaint_type FROM complaint_type AS D WHERE D.complaint_type_id = cmplaint_type_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Complaint Type
CREATE OR REPLACE FUNCTION complaint_type_insert(IN cmplaint_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO complaint_type (complaint_type, last_modification_date, last_modified_by) VALUES
	(cmplaint_type, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A Complaint Type
CREATE OR REPLACE FUNCTION complaint_type_update(IN cmplaint_type_id BIGINT, IN cmplaint_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE complaint_type 
	SET complaint_type = cmplaint_type, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE complaint_type_id = cmplaint_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A Complaint Type
CREATE OR REPLACE FUNCTION complaint_type_delete(IN cmplaint_type_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM complaint_type 
	WHERE complaint_type_id = cmplaint_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;