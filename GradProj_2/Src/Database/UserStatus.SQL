-- TABLE: User Status
-- TYPE: Look up

CREATE TABLE user_status ( 
	user_status_id SERIAL PRIMARY KEY,
	user_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
User Status CRUD Functions
*/
-- GET ALL User Statuses  
CREATE OR REPLACE FUNCTION user_status_get_all()
RETURNS TABLE(usr_status_id BIGINT, usr_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(user_status_id AS BIGINT), user_status FROM user_status;
END;
$$ LANGUAGE plpgsql;
-- GET A User Status
CREATE OR REPLACE FUNCTION user_status_get_by_id(IN usr_status_id BIGINT)
RETURNS TABLE(user_status VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.user_status FROM user_status AS D WHERE D.user_status_id = usr_status_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A User Status
CREATE OR REPLACE FUNCTION user_status_insert(IN usr_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO user_status (user_status, last_modification_date, last_modified_by) VALUES
	(usr_status, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A User Status
CREATE OR REPLACE FUNCTION user_status_update(IN usr_status_id BIGINT, IN usr_status VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE user_status 
	SET user_status = usr_status, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE user_status_id = usr_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A User Status
CREATE OR REPLACE FUNCTION user_status_delete(IN usr_status_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM user_status 
	WHERE user_status_id = usr_status_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;