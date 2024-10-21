
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

-- Log TIMESTAMP Index
-- to optimize the Retrieval Based on a given Log's Timestamp
CREATE INDEX  idx_fk_log_timestamp ON log(log_timestamp);