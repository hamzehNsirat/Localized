-- TABLE: Quotation
-- TYPE: Main

CREATE TABLE quotation ( 
	quotation_id SERIAL PRIMARY KEY,
	requester_id 		 BIGINT NOT NULL,
	supplier_id 		 BIGINT NOT NULL,
	quotation_status_id  BIGINT NOT NULL,
	quotation_request_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	quotation_details     JSONB NOT NULL,
	quotation_attachments JSONB,
	payment_details_bank		      VARCHAR(256)  NOT NULL,
	payment_details_iban		      VARCHAR(34)  NOT NULL,
	payment_details_bank_acc_num	  VARCHAR(18)  NOT NULL,
	from_establishment_name	  TEXT  NOT NULL,
	to_establishment_name	  TEXT  NOT NULL,
	ship_to_address		      TEXT  NOT NULL,
	bill_to_address		      TEXT  NOT NULL,
	supplier_address		  TEXT,
	last_updater_type		BOOLEAN   NOT NULL,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		BIGINT    NOT NULL,
	CONSTRAINT fk_qotn_supplier_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_qotn_retailer_id FOREIGN KEY (requester_id)
    REFERENCES retailer(retailer_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT fk_qotn_status_id FOREIGN KEY (quotation_status_id)
    REFERENCES quotation_status(quotation_status_id) ON DELETE SET NULL ON UPDATE CASCADE,

	CONSTRAINT chk_qotn_addrs 	  CHECK(ship_to_address <> supplier_address AND bill_to_address <> supplier_address),
	CONSTRAINT chk_qotn_name 	  CHECK(from_establishment_name <> to_establishment_name)
);
/*
Quotation Indexes  / Triggers
*/

-- Quotation Supplier ID Index
-- to optimize the Retrieval Based on a given Quotation's Supplier ID
CREATE INDEX  idx_qotn_supplier_id ON quotation(supplier_id);

-- Quotation Retailer ID Index
-- to optimize the Retrieval Based on a given Quotation's Retailer ID
CREATE INDEX  idx_qotn_retailer_id ON quotation(requester_id);
