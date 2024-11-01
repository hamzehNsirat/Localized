-- TABLE: Transaction Status
-- TYPE: Look up

CREATE TABLE transaction_status ( 
	transaction_status_id SERIAL PRIMARY KEY,
	transaction_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Transaction Status CRUD Functions
*/
-- GET ALL Transaction Statuses 
CREATE OR REPLACE FUNCTION transaction_status_get_all()
RETURNS TABLE(trx_status_id BIGINT, trx_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(transaction_status_id AS BIGINT), transaction_status FROM transaction_status;
END;
$$ LANGUAGE plpgsql;
-- GET A Transaction Status
CREATE OR REPLACE FUNCTION transaction_status_get_by_id(IN trx_status_id BIGINT)
RETURNS TABLE(transaction_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.transaction_status FROM transaction_status AS D WHERE D.transaction_status_id = trx_status_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Transaction Status
CREATE OR REPLACE FUNCTION transaction_status_insert(IN trx_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO transaction_status (transaction_status, last_modification_date, last_modified_by) VALUES
	(trx_status, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A Transaction Status
CREATE OR REPLACE FUNCTION transaction_status_update(IN trx_status_id BIGINT, IN trx_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE transaction_status 
	SET transaction_status = trx_status, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE transaction_status_id = trx_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A Transaction Status
CREATE OR REPLACE FUNCTION transaction_status_delete(IN trx_status_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM transaction_status 
	WHERE transaction_status_id = trx_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;