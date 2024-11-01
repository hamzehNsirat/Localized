-- TABLE: Adminstrator
-- TYPE: Main

CREATE TABLE adminstrator ( 
	admin_id SERIAL PRIMARY KEY,
	hire_date    TIMESTAMP NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Adminstrator CRUD Functions
*/
-- GET ALL Adminstrators
CREATE OR REPLACE FUNCTION adminstrators_get()
RETURNS TABLE(adminstrator_id BIGINT, hire_date DATE) AS $$
BEGIN
    RETURN QUERY SELECT CAST(D.admin_id AS BIGINT),CAST(D.hire_date AS DATE) FROM adminstrator AS D;
END;
$$ LANGUAGE plpgsql;
-- INSERT AN Adminstrator
CREATE OR REPLACE FUNCTION adminstrators_insert(IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO adminstrator (hire_date, last_modification_date, last_modified_by) VALUES
	(CURRENT_DATE, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE AN Adminstrator
CREATE OR REPLACE FUNCTION adminstrators_delete(IN admin_id BIGINT, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM adminstrator  AS D
	WHERE CAST(D.admin_id AS BIGINT) = admin_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;