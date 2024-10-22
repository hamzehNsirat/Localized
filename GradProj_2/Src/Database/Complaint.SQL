-- TABLE: Complaint
-- TYPE: Main

CREATE TABLE complaint ( 
	complaint_id SERIAL PRIMARY KEY,
	complaint_type_id    BIGINT,
	reviewer_id BIGINT,
	supplier_id   BIGINT NOT NULL,
	retailer_id   BIGINT NOT NULL,
	complaint_status_id 	 VARCHAR(15) NOT NULL DEFAULT 'CREATED',
	complaint_notes  TEXT,
	submitter_type   BOOLEAN NOT NULL,
	creation_date  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_modification_date  TIMESTAMP NOT NULL,
	last_modified_by		 BIGINT   NOT NULL,
	CONSTRAINT fk_cmpn_rtlr_id FOREIGN KEY (retailer_id)
    REFERENCES retailer(retailer_id) ON DELETE CASCADE,
	CONSTRAINT fk_cmpn_supp_id FOREIGN KEY (supplier_id)
    REFERENCES supplier(supplier_id) ON DELETE CASCADE,
	CONSTRAINT fk_cmpn_reviewer_id FOREIGN KEY (reviewer_id)
    REFERENCES adminstrator(admin_id) ON DELETE SET NULL,
	CONSTRAINT fk_cmpn_type_id FOREIGN KEY (complaint_type_id)
    REFERENCES complaint_type(complaint_type_id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT chk_cmpn_status CHECK(complaint_status_id IN('CREATED', 'REVIEWED', 'RESOLVED', 'DELETED'))
);

/*
Complaint Indexes  / Triggers
*/

-- Complaint Supplier ID Index
-- to optimize the Retrieval Based on a given Complaint's Supplier ID
CREATE INDEX  idx_cmplnt_supplier_id ON complaint(supplier_id);

-- Complaint  ID Index
-- to optimize the Retrieval Based on a given Complaint's Retailer ID
CREATE INDEX  idx_cmplnt_retailer_id ON complaint(retailer_id);

