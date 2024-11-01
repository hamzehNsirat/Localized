-- TABLE: User Type
-- TYPE: Look up

CREATE TABLE user_type ( 
	user_type_id SERIAL PRIMARY KEY,
	user_type    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
User Type CRUD Functions
*/
-- GET ALL User Types 
CREATE OR REPLACE FUNCTION user_type_get_all()
RETURNS TABLE(usr_type_id BIGINT, usr_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(user_type_id AS BIGINT), user_type FROM user_type;
END;
$$ LANGUAGE plpgsql;
-- GET A User Type
CREATE OR REPLACE FUNCTION user_type_get_by_id(IN usr_type_id BIGINT)
RETURNS TABLE(user_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.user_type FROM user_type AS D WHERE D.user_type_id = usr_type_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A User Type
CREATE OR REPLACE FUNCTION user_type_insert(IN usr_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO user_type (user_type, last_modification_date, last_modified_by) VALUES
	(usr_type, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE A User Type
CREATE OR REPLACE FUNCTION user_type_update(IN usr_type_id BIGINT, IN usr_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE user_type 
	SET user_type = usr_type, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE user_type_id = usr_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE A User Type
CREATE OR REPLACE FUNCTION user_type_delete(IN usr_type_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM user_type 
	WHERE user_type_id = usr_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;