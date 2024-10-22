-- TABLE: Adminstrator
-- TYPE: Main

CREATE TABLE adminstrator ( 
	admin_id SERIAL PRIMARY KEY,
	hire_date    TIMESTAMP NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
