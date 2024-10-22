
-- TABLE: Order
-- TYPE: Main

CREATE TABLE order_localized ( 
	order_id SERIAL PRIMARY KEY,
	quotation_id 		 BIGINT NOT NULL,
	product_id  		 BIGINT NOT NULL,
	order_quantity   	 FLOAT  NOT NULL,
	order_quantity_unit  VARCHAR(35),
	order_date			    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		BIGINT   NOT NULL,
	CONSTRAINT fk_ordr_quotation_id FOREIGN KEY (quotation_id)
    REFERENCES quotation(quotation_id) ON DELETE CASCADE,
	CONSTRAINT fk_ordr_product_id FOREIGN KEY (product_id)
    REFERENCES product(product_id) ON DELETE CASCADE,
	CONSTRAINT chk_ordr_quantity 	  CHECK(order_quantity >= 0)
);

