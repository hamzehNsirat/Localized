-- TABLE: Notification Type
-- TYPE: Look up

CREATE TABLE notification_type (
	notification_type_id SERIAL PRIMARY KEY,
	notification_type    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
/*
Notification Type CRUD Functions
*/
-- GET ALL NOTIFICATION TYPES
CREATE OR REPLACE FUNCTION notification_type_get_all()
RETURNS TABLE(notif_type_id BIGINT, notif_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT CAST(notification_type_id AS BIGINT), notification_type FROM notification_type;
END;
$$ LANGUAGE plpgsql;
-- GET A NOTIFICATION TYPE
CREATE OR REPLACE FUNCTION notification_type_get_by_id(IN notif_type_id BIGINT)
RETURNS TABLE(notification_type VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT D.notification_type FROM notification_type AS D WHERE D.notification_type_id = notif_type_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A NOTIFICATION TYPE
CREATE OR REPLACE FUNCTION notification_type_insert(IN notif_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	INSERT INTO notification_type (notification_type, last_modification_date, last_modified_by) VALUES
	(notif_type, CURRENT_TIMESTAMP, last_modifier);
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- UPDATE AN NOTIFICATION TYPE
CREATE OR REPLACE FUNCTION notification_type_update(IN notif_type_id BIGINT, IN notif_type VARCHAR, IN last_modifier BIGINT)
RETURNS INTEGER AS $$
BEGIN
	UPDATE notification_type 
	SET notification_type = notif_type, 
	last_modification_date = CURRENT_TIMESTAMP, 
	last_modified_by =	last_modifier
	WHERE notification_type_id = notif_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;
-- DELETE AN NOTIFICATION TYPE
CREATE OR REPLACE FUNCTION notification_type_delete(IN notif_type_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
	DELETE FROM notification_type 
	WHERE notification_type_id = notif_type_id;
	RETURN 0 AS execution_result;
EXCEPTION WHEN OTHERS THEN 
	RETURN -1 AS execution_result;	
END;
$$ LANGUAGE plpgsql;

