-- TABLE: Complaint Type
-- TYPE: Look up

CREATE TABLE complaint_type ( 
	complaint_type_id SERIAL PRIMARY KEY,
	complaint_type    VARCHAR(15) NOT NULL, 
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
