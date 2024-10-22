-- TABLE: Quotation Status
-- TYPE: Look up

CREATE TABLE quotation_status (
	quotation_status_id SERIAL PRIMARY KEY,
	quotation_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
