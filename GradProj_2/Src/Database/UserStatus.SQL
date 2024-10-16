-- TABLE: User Status
-- TYPE: Look up

CREATE TABLE user_status ( 
	user_status_id SERIAL PRIMARY KEY,
	user_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
