-- TABLE: User Type
-- TYPE: Look up

CREATE TABLE user_type ( 
	user_type_id SERIAL PRIMARY KEY,
	user_type    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
