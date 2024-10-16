-- TABLE: Product Status
-- TYPE: Look up

CREATE TABLE product_status (
	product_status_id SERIAL PRIMARY KEY,
	product_status    VARCHAR(15) NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL
);
