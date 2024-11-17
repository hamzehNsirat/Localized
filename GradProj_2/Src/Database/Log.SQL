-- TABLE: Log
-- TYPE: Main
CREATE TABLE log ( 
	log_id SERIAL PRIMARY KEY,
	log_user_id    BIGINT NOT NULL,
	action_details 	    TEXT DEFAULT NULL,
	action_json_payload JSONB DEFAULT NULL,
	action_description  VARCHAR(35) NOT NULL,
	is_transactional 	BOOLEAN NOT NULL,
	log_timestamp 	    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_log_user_id FOREIGN KEY (log_user_id)
    REFERENCES user_localized(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

/*
Log Indexes  / Triggers
*/
-- Log User ID Index
-- to optimize the Retrieval Based on a given Log's UserID
CREATE INDEX  idx_fk_loguser_id ON log(log_user_id);

/*
Log CRUD Functions
*/
-- GET A Log BY USER ID
CREATE OR REPLACE FUNCTION log_get_by_userid(IN in_log_user_id BIGINT)
RETURNS TABLE(		
	log_id BIGINT,
	action_details 	    TEXT,
	action_json_payload JSONB,
	action_description  VARCHAR,
	is_transactional 	BOOLEAN,
	log_timestamp 	    TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY 
	SELECT
	CAST(D.log_id AS BIGINT),
	D.action_details,
	D.action_json_payload,
	D.action_description,
	D.is_transactional,
	D.log_timestamp
	FROM log AS D
	WHERE CAST(D.log_user_id AS BIGINT) = in_log_user_id;
END;
$$ LANGUAGE plpgsql;
-- INSERT A Log
CREATE OR REPLACE FUNCTION log_insert(
	IN in_log_user_id BIGINT,
	IN in_action_details 	    TEXT,
	IN in_action_json_payload JSONB,
	IN in_action_description  VARCHAR,
	IN in_is_transactional 	BOOLEAN,
	OUT out_log_id BIGINT
)
RETURNS BIGINT AS $$
BEGIN
    INSERT INTO log
	(	
	log_user_id,
	action_details,
	action_json_payload,
	action_description,
	is_transactional,
	log_timestamp
	)
	VALUES 
	(
	in_log_user_id,
	in_action_details,
	in_action_json_payload,
	in_action_description,
	in_is_transactional,
	CURRENT_TIMESTAMP
	) RETURNING CAST(log_id AS BIGINT) INTO out_log_id;

EXCEPTION WHEN OTHERS THEN 
	SET out_log_id = -1;	
END;
$$ LANGUAGE plpgsql;