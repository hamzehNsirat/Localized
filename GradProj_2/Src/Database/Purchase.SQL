
-- TABLE: Purchase
-- TYPE: Main

CREATE TABLE purchase ( 
	purchase_id SERIAL PRIMARY KEY,
	quotation_id 		 BIGINT NOT NULL,
	buyer_id 		     BIGINT NOT NULL,
	supplier_id 		 BIGINT NOT NULL,
	purchase_status_id 	 BIGINT,
	purchase_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	payment_reference	  	  VARCHAR(32)  NOT NULL UNIQUE,
	reconciliation_reference  VARCHAR(32)  UNIQUE,
	payment_amount		  	  FLOAT    NOT NULL,
	payment_currency	  	  CHAR(3)  NOT NULL DEFAULT 'JOD',
	payment_exchange_rate	  FLOAT    NOT NULL DEFAULT 1,
	last_modification_date  TIMESTAMP  NOT NULL,
	last_modified_by		BIGINT     NOT NULL,
	CONSTRAINT fk_prchs_supplier_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prchs_retailer_id FOREIGN KEY (buyer_id)
    REFERENCES retailer(retailer_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prchs_quotation_id FOREIGN KEY (quotation_id)
    REFERENCES quotation(quotation_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT fk_prchs_status_id FOREIGN KEY (purchase_status_id)
    REFERENCES purchase_status(purchase_status_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_prchs_amount   CHECK(payment_amount >= 0),
	CONSTRAINT chk_prchs_exchng 	  CHECK(payment_exchange_rate >= 0)
);
