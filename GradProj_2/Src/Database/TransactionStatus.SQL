-- TABLE: Transaction Status
-- TYPE: Look up

CREATE TABLE transaction_status ( 
	transaction_status_id SERIAL PRIMARY KEY,
	transaction_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
