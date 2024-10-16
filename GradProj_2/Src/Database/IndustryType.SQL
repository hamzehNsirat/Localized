-- TABLE: Industry Type
-- TYPE: Look up

CREATE TABLE industry_type ( 
	industry_type_id SERIAL PRIMARY KEY,
	industry_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
