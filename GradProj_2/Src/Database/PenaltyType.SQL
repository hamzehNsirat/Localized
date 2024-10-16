-- TABLE: Penalty Type
-- TYPE: Look up

CREATE TABLE penalty_type ( 
	penalty_type_id SERIAL PRIMARY KEY,
	penalty_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
