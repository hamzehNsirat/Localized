-- TABLE: Establishment Status
-- TYPE: Look up

CREATE TABLE establishment_status (
	establishment_status_id SERIAL PRIMARY KEY,
	establishment_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);