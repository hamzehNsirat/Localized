-- TABLE: Compliant Type
-- TYPE: Look up

CREATE TABLE compliant_type ( 
	compliant_type_id SERIAL PRIMARY KEY,
	compliant_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
