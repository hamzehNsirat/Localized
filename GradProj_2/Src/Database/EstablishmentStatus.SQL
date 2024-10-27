-- TABLE: Establishment Status
-- TYPE: Look up

CREATE TABLE establishment_status (
	establishment_status_id SERIAL PRIMARY KEY,
	establishment_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);

/*
Establishment CRUD Functions
*/
-- GET ALL ESTABLISHMENT STATUSES
CREATE OR REPLACE FUNCTION establishment_status_get_all()
RETURNS TABLE(establishment_status_id INT, establishment_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(D.establishment_status_id AS INT), D.establishment_status FROM establishment_status AS D;
END;
$$ LANGUAGE plpgsql;
-- GET AN ESTABLISHMENT STATUS
CREATE OR REPLACE FUNCTION establishment_status_get_by_id(IN est_status_id BIGINT)
RETURNS TABLE(establishment_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.establishment_status FROM establishment_status AS D WHERE D.establishment_status_id = est_status_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT AN ESTABLISHMENT STATUS
CREATE OR REPLACE FUNCTION establishment_status_insert(IN est_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO establishment_status (establishment_status, last_modification_date, last_modified_by) VALUES
	(est_status, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE AN ESTABLISHMENT STATUS
CREATE OR REPLACE FUNCTION establishment_status_update(IN est_status_id BIGINT, IN est_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE establishment_status 
	SET establishment_status = est_status, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE establishment_status_id = est_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE AN ESTABLISHMENT STATUS
CREATE OR REPLACE FUNCTION establishment_status_delete(IN est_status_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM establishment_status 
	WHERE establishment_status_id = est_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;

