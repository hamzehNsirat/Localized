-- TABLE: Product
-- TYPE: Main

CREATE TABLE product ( 
	product_id SERIAL PRIMARY KEY,
	supplier_id 		 BIGINT NOT NULL,
	product_status_id    BIGINT NOT NULL,
	product_unit_price   FLOAT  NOT NULL,
	product_unit_price_discount   FLOAT  DEFAULT NULL,
	product_category		      VARCHAR(70)  NOT NULL,
	product_description		      TEXT  DEFAULT NULL,
	product_image			      BYTEA  DEFAULT NULL,
	product_name			      VARCHAR(70)  NOT NULL,
	product_addition_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		BIGINT   NOT NULL,
	CONSTRAINT fk_prdct_supplier_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_prdct_status_id FOREIGN KEY (product_status_id)
    REFERENCES product_status(product_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_prdct_price 	  CHECK(product_unit_price >= 0),
	CONSTRAINT chk_prdct_discount CHECK(product_unit_price_discount BETWEEN 0 AND 1)
);
