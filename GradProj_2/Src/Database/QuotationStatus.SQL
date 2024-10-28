-- TABLE: Quotation Status
-- TYPE: Look up

CREATE TABLE quotation_status (
	quotation_status_id SERIAL PRIMARY KEY,
	quotation_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Quotation Status CRUD Functions
*/
-- GET ALL Quotation Statuses
CREATE OR REPLACE FUNCTION quotation_status_get_all()
RETURNS TABLE(quot_status_id BIGINT, quot_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(quotation_status_id AS BIGINT), quotation_status FROM quotation_status;
END;
$$ LANGUAGE plpgsql;
-- GET A Quotation Status
CREATE OR REPLACE FUNCTION quotation_status_get_by_id(IN quot_status_id BIGINT)
RETURNS TABLE(quotation_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.quotation_status FROM quotation_status AS D WHERE D.quotation_status_id = quot_status_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Quotation Status
CREATE OR REPLACE FUNCTION quotation_status_insert(IN quot_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO quotation_status (quotation_status, last_modification_date, last_modified_by) VALUES
	(quot_status, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A Quotation Status
CREATE OR REPLACE FUNCTION quotation_status_update(IN quot_status_id BIGINT, IN quot_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE quotation_status 
	SET quotation_status = quot_status, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE quotation_status_id = quot_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A Quotation Status
CREATE OR REPLACE FUNCTION quotation_status_delete(IN quot_status_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM quotation_status 
	WHERE quotation_status_id = quot_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;