
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
	reconciliation_reference  	VARCHAR(32)  UNIQUE,
	external_pay_reference  	VARCHAR(32)  UNIQUE,
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
/*
Purchase Indexes  / Triggers
*/

-- Quotation ID Index
-- to optimize the Retrieval Based on a given Purchase's Quotation ID
CREATE INDEX  idx_purchase_quotation ON purchase(quotation_id);

-- Supplier ID Index
-- to optimize the Retrieval Based on a given Purchase's Supplier ID
CREATE INDEX  idx_purchase_supplier ON purchase(supplier_id);

-- Retailer ID Index
-- to optimize the Retrieval Based on a given Purchase's Retailer ID
CREATE INDEX  idx_purchase_retailer ON purchase(buyer_id);


-- Review Rating Type Trigger
-- to decide type of Review (Positive: TRUE, Negative: FALSE)
CREATE OR REPLACE FUNCTION generate_payment_reference()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN			
	IF NEW.purchase_status_id = 0 THEN 
		NEW.payment_reference = (SELECT 'PST' || TO_CHAR(CURRENT_DATE,'YYMMDD') || (SELECT substr(concat(md5(random()::text), md5(random()::text)), 0, 20)));
	ELSEIF NEW.purchase_status_id = 4 THEN 
		NEW.reconciliation_reference = (SELECT 'REV' || TO_CHAR(CURRENT_DATE,'YYMMDD') || (SELECT substr(concat(md5(random()::text), md5(random()::text)), 0, 20)));
	END IF;
	RETURN NEW;
END;
$$

CREATE TRIGGER before_insert_payment_reference
BEFORE INSERT ON purchase
FOR EACH ROW
EXECUTE FUNCTION generate_payment_reference();

CREATE TRIGGER before_update_payment_reference
BEFORE UPDATE ON purchase
FOR EACH ROW
EXECUTE FUNCTION generate_payment_reference();

